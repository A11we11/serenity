import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMessageDto } from '../../common/validations/message.validation';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(userId: string, createDto: CreateMessageDto) {
    // Verify user has access to consultation
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: createDto.consultationId },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (consultation.patientId !== userId && consultation.doctorId !== userId) {
      throw new ForbiddenException(
        'You do not have access to this consultation',
      );
    }

    const message = await this.prisma.message.create({
      data: {
        consultationId: createDto.consultationId,
        senderId: userId,
        type: createDto.type,
        content: createDto.content,
        attachments: createDto.attachments || [],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    // Send notification to the other party
    const recipient =
      consultation.patientId === userId
        ? consultation.doctor
        : consultation.patient;

    if (recipient?.phone) {
      await this.notificationsService.sendMessageNotification(
        recipient.phone,
        `${message.sender.firstName} ${message.sender.lastName}`,
        consultation.id,
      );
    }

    return message;
  }

  async findByConsultation(consultationId: string, userId: string) {
    // Verify user has access
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (consultation.patientId !== userId && consultation.doctorId !== userId) {
      throw new ForbiddenException(
        'You do not have access to this consultation',
      );
    }

    return this.prisma.message.findMany({
      where: { consultationId },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async markAsRead(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        consultation: true,
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Only the recipient can mark as read (not the sender)
    if (message.senderId === userId) {
      return message;
    }

    if (
      message.consultation.patientId !== userId &&
      message.consultation.doctorId !== userId
    ) {
      throw new ForbiddenException('You do not have access to this message');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async getUnreadCount(userId: string) {
    const consultations = await this.prisma.consultation.findMany({
      where: {
        OR: [{ patientId: userId }, { doctorId: userId }],
      },
      select: { id: true },
    });

    const consultationIds = consultations.map((c) => c.id);

    return this.prisma.message.count({
      where: {
        consultationId: { in: consultationIds },
        senderId: { not: userId },
        isRead: false,
      },
    });
  }
}
