import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma';

const debug = (...args: any[]) => {
  console.log(new Date().toISOString(), ...args);
};

// Store active SSE connections
const connections = new Map();

// POST endpoint for sending notifications
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const payload = await request.json();

    debug('POST: Notification payload received:', payload);

    const notification = await prisma.notification.create({
      data: {
        userId: payload.creatorId,
        title: payload.title,
        message: payload.message,
      },
    });

    // Send to connected client if online
    const writer = connections.get(payload.creatorId);
    if (writer) {
      const encoder = new TextEncoder();
      await writer.write(encoder.encode(`data: ${JSON.stringify(notification)}\n\n`));
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error sending notification:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// GET endpoint
export async function GET(request: Request) {
  try {
    debug('GET: Request received');
    const headersList = await headers();
    const accept = headersList.get('accept');    
    debug('GET: Accept header:', accept);
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      debug('GET: Unauthorized request');
      return new NextResponse('Unauthorized', { status: 401 });
    }
    debug('GET: User authenticated:', session.user.email);

    if (accept === 'text/event-stream') {
      debug('GET: SSE connection requested');
      const stream = new TransformStream();
      const writer = stream.writable.getWriter();
      const encoder = new TextEncoder();
      const userId = session.user.id;

      debug('GET: Sending initial connection message');
      await writer.write(encoder.encode('data: {"type":"connected"}\n\n'));

      const heartbeatInterval = setInterval(async () => {
        try {
          debug('GET: Sending heartbeat for user:', userId);
          await writer.write(encoder.encode('data: {"type":"heartbeat"}\n\n'));
        } catch (error) {
          debug('GET: Heartbeat error for user:', userId, error);
          console.error('Heartbeat error:', error);
          clearInterval(heartbeatInterval);
          connections.delete(userId);
          writer.close().catch(console.error);
        }
      }, 30000);

      debug('GET: Storing connection for user:', userId);
      connections.set(userId, writer);
      debug('GET: Active connections count:', connections.size);

      request.signal.addEventListener('abort', () => {
        debug('GET: Connection aborted for user:', userId);
        clearInterval(heartbeatInterval);
        connections.delete(userId);
        writer.close().catch(console.error);
        debug('GET: Active connections count after abort:', connections.size);
      });

      return new Response(stream.readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    debug('GET: Fetching recent notifications');
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
    debug('GET: Found notifications count:', notifications.length);

    return NextResponse.json(notifications);
  } catch (error) {
    debug('GET: Error:', error);
    console.error('SSE error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}