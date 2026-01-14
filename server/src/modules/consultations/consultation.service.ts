import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateConsultationDto,
  UpdateConsultationDto,
} from '../../common/validations/consultation.validation';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ConsultationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(userId: string, createDto: CreateConsultationDto) {
    const consultation = await this.prisma.consultation.create({
      data: {
        patientId: userId,
        chiefComplaint: createDto.chiefComplaint,
        symptoms: createDto.symptoms,
        duration: createDto.duration,
        medicalHistory: createDto.medicalHistory || {},
        medications: createDto.medications || [],
        allergies: createDto.allergies || [],
        vitalSigns: createDto.vitalSigns || {},
        videoUrl: createDto.videoUrl,
        priority: createDto.priority,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Send notification to patient
    if (consultation.patient.phone) {
      await this.notificationsService.sendConsultationConfirmation(
        consultation.patient.phone,
        consultation.id,
      );
    }

    return consultation;
  }

  async findAll(userId: string, role: string) {
    const where =
      role === 'PATIENT'
        ? { patientId: userId }
        : role === 'DOCTOR'
          ? { doctorId: userId }
          : {};

    return this.prisma.consultation.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            messages: true,
            photos: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        messages: {
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
        },
        photos: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        followUps: {
          orderBy: {
            scheduledDate: 'asc',
          },
        },
      },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    // Check authorization
    if (role === 'PATIENT' && consultation.patientId !== userId) {
      throw new ForbiddenException(
        'You do not have access to this consultation',
      );
    }

    if (role === 'DOCTOR' && consultation.doctorId !== userId) {
      throw new ForbiddenException(
        'You do not have access to this consultation',
      );
    }

    return consultation;
  }

  async update(
    id: string,
    userId: string,
    role: string,
    updateDto: UpdateConsultationDto,
  ) {
    const consultation = await this.findOne(id, userId, role);

    // Only doctors can update diagnosis and prescription
    if (role !== 'DOCTOR' && (updateDto.diagnosis || updateDto.prescription)) {
      throw new ForbiddenException(
        'Only doctors can update diagnosis and prescription',
      );
    }

    const updated = await this.prisma.consultation.update({
      where: { id },
      data: {
        ...updateDto,
        ...(updateDto.status === 'COMPLETED' && { completedAt: new Date() }),
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    // Send notification on status change
    if (updateDto.status && consultation.patient.phone) {
      await this.notificationsService.sendStatusUpdate(
        consultation.patient.phone,
        updated.id,
        updateDto.status,
      );
    }

    return updated;
  }

  async assignDoctor(consultationId: string, doctorId: string) {
    const consultation = await this.prisma.consultation.update({
      where: { id: consultationId },
      data: {
        doctorId,
        status: 'IN_PROGRESS',
      },
      include: {
        patient: {
          select: {
            phone: true,
          },
        },
        doctor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Notify patient
    if (consultation.patient.phone) {
      await this.notificationsService.sendDoctorAssigned(
        consultation.patient.phone,
        consultation.id,
        `Dr. ${consultation.doctor.firstName} ${consultation.doctor.lastName}`,
      );
    }

    return consultation;
  }

  async createFollowUp(
    consultationId: string,
    scheduledDate: Date,
    notes?: string,
  ) {
    const followUp = await this.prisma.followUp.create({
      data: {
        consultationId,
        scheduledDate,
        notes,
      },
    });

    // Schedule reminder notification (you'd use a queue like Bull for this)
    // For now, we'll just create the follow-up

    return followUp;
  }
}
