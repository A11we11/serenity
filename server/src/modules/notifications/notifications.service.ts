import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as twilio from 'twilio';

@Injectable()
export class NotificationsService {
  private twilioClient: twilio.Twilio;
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');

    if (accountSid && authToken) {
      this.twilioClient = twilio(accountSid, authToken);
    } else {
      this.logger.warn(
        'Twilio credentials not configured. Notifications will be logged only.',
      );
    }
  }

  async sendSMS(to: string, message: string, userId?: string) {
    try {
      if (!this.twilioClient) {
        this.logger.log(`[SMS Mock] To: ${to}, Message: ${message}`);
        return { success: true, mock: true };
      }

      const result = await this.twilioClient.messages.create({
        body: message,
        from: this.configService.get('TWILIO_PHONE_NUMBER'),
        to: to,
      });

      // Save notification record
      if (userId) {
        await this.prisma.notification.create({
          data: {
            userId,
            type: 'SMS',
            recipient: to,
            message,
            sent: true,
            sentAt: new Date(),
            metadata: {
              messageSid: result.sid,
              status: result.status,
            },
          },
        });
      }

      this.logger.log(`SMS sent successfully to ${to}`);
      return { success: true, sid: result.sid };
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${to}: ${error.message}`);
      throw error;
    }
  }

  async sendWhatsApp(to: string, message: string, userId?: string) {
    try {
      if (!this.twilioClient) {
        this.logger.log(`[WhatsApp Mock] To: ${to}, Message: ${message}`);
        return { success: true, mock: true };
      }

      // Ensure phone number has whatsapp: prefix
      const whatsappNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

      const result = await this.twilioClient.messages.create({
        body: message,
        from: this.configService.get('TWILIO_WHATSAPP_NUMBER'),
        to: whatsappNumber,
      });

      // Save notification record
      if (userId) {
        await this.prisma.notification.create({
          data: {
            userId,
            type: 'WHATSAPP',
            recipient: to,
            message,
            sent: true,
            sentAt: new Date(),
            metadata: {
              messageSid: result.sid,
              status: result.status,
            },
          },
        });
      }

      this.logger.log(`WhatsApp message sent successfully to ${to}`);
      return { success: true, sid: result.sid };
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp to ${to}: ${error.message}`);
      throw error;
    }
  }

  // Pre-built notification templates
  async sendConsultationConfirmation(phone: string, consultationId: string) {
    const message = `Your consultation has been submitted successfully! 🏥\n\nConsultation ID: ${consultationId}\n\nA doctor will review your case shortly. You'll receive updates via SMS and in the app.`;

    return this.sendSMS(phone, message);
  }

  async sendDoctorAssigned(
    phone: string,
    consultationId: string,
    doctorName: string,
  ) {
    const message = `Good news! ${doctorName} has been assigned to your consultation.\n\nConsultation ID: ${consultationId}\n\nThey will review your case and respond soon.`;

    return this.sendWhatsApp(phone, message);
  }

  async sendStatusUpdate(
    phone: string,
    consultationId: string,
    status: string,
  ) {
    const statusMessages = {
      IN_PROGRESS: `Your consultation is now being reviewed by your doctor. 👨‍⚕️`,
      AWAITING_RESPONSE: `Your doctor has responded! Check the app for their recommendations. 📱`,
      COMPLETED: `Your consultation has been completed. You can view the summary in the app. ✅`,
      CANCELLED: `Your consultation has been cancelled. If you need help, please create a new consultation. ❌`,
    };

    const message = `${statusMessages[status] || 'Your consultation status has been updated.'}\n\nConsultation ID: ${consultationId}`;

    return this.sendSMS(phone, message);
  }

  async sendFollowUpReminder(
    phone: string,
    consultationId: string,
    followUpDate: string,
  ) {
    const message = `Reminder: You have a follow-up scheduled for ${followUpDate}. 📅\n\nConsultation ID: ${consultationId}\n\nPlease check the app for details.`;

    return this.sendSMS(phone, message);
  }

  async sendMessageNotification(
    phone: string,
    senderName: string,
    consultationId: string,
  ) {
    const message = `💬 New message from ${senderName}\n\nConsultation ID: ${consultationId}\n\nOpen the app to read and reply.`;

    return this.sendWhatsApp(phone, message);
  }

  // Get notification history for a user
  async getNotificationHistory(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
