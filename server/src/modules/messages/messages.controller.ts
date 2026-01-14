import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createMessageSchema,
  CreateMessageDto,
} from '../../common/validations/message.validation';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(
    @Request() req,
    @Body(new ZodValidationPipe(createMessageSchema))
    createDto: CreateMessageDto,
  ) {
    return this.messagesService.create(req.user.id, createDto);
  }

  @Get('consultation/:consultationId')
  async findByConsultation(
    @Param('consultationId') consultationId: string,
    @Request() req,
  ) {
    return this.messagesService.findByConsultation(consultationId, req.user.id);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.messagesService.markAsRead(id, req.user.id);
  }

  @Get('unread/count')
  async getUnreadCount(@Request() req) {
    const count = await this.messagesService.getUnreadCount(req.user.id);
    return { count };
  }
}
