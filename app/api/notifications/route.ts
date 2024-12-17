// app/api/notifications/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma';

// Define the connections map if not already defined
const connections = new Map();

export async function GET(request: Request) {
  try {
    const headersList = await headers();
    const accept = headersList.get('accept');
    const session = await getServerSession(authOptions)
    
    // Early return if not authenticated
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { 
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    // Handle SSE connections
    if (accept === 'text/event-stream') {
      const stream = new TransformStream();
      const writer = stream.writable.getWriter();
      const encoder = new TextEncoder();

      try {
        // Send initial heartbeat
        const initialMessage = encoder.encode('data: {"type":"connected"}\n\n');
        await writer.write(initialMessage);

        // Store the connection
        const userId = session.user.id;
        connections.set(userId, writer);

        // Setup heartbeat interval
        const heartbeatInterval = setInterval(async () => {
          try {
            await writer.write(encoder.encode('data: {"type":"heartbeat"}\n\n'));
          } catch (error) {
            console.log(error)
            clearInterval(heartbeatInterval);
            connections.delete(userId);
            writer.close().catch(console.error);
          }
        }, 30000); // Send heartbeat every 30 seconds

        // Clean up on connection close
        request.signal.addEventListener('abort', () => {
          clearInterval(heartbeatInterval);
          connections.delete(userId);
          writer.close().catch(console.error);
        });

        return new NextResponse(stream.readable, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'X-Accel-Buffering': 'no'
          },
        });
      } catch (error) {
        console.error('Stream error:', error);
        connections.delete(session.user.id);
        return new NextResponse('Stream error', { status: 500 });
      }
    }

    // Handle regular GET requests
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        read: false
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    return NextResponse.json(notifications, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Error in notifications route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
