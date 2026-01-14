import { Module } from '@nestjs/common';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  controllers: [ConsultationsController],
  providers: [ConsultationsService, PrismaService, NotificationsService],
  exports: [ConsultationsService],
})
export class ConsultationsModule {}
