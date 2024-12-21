import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';

export const generateVerificationToken = async (userId: string) => {
  const token = uuidv4();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const existingToken = await prisma.verificationToken.findUnique({
    where: { userId }
  });

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: { id: existingToken.id }
    });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      token,
      expires,
      userId,
    }
  });

  return verificationToken;
};

export const generatePasswordResetToken = async (userId: string) => {
  const token = uuidv4();
  const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

  const existingToken = await prisma.passwordResetToken.findUnique({
    where: { userId }
  });

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id }
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      token,
      expires,
      userId,
    }
  });

  return passwordResetToken;
};
