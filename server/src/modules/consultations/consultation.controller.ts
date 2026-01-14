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
import { ConsultationsService } from './consultations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createConsultationSchema,
  updateConsultationSchema,
  CreateConsultationDto,
  UpdateConsultationDto,
} from '../../common/validations/consultation.validation';

@Controller('consultations')
@UseGuards(JwtAuthGuard)
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  async create(
    @Request() req,
    @Body(new ZodValidationPipe(createConsultationSchema))
    createDto: CreateConsultationDto,
  ) {
    return this.consultationsService.create(req.user.id, createDto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.consultationsService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.consultationsService.findOne(id, req.user.id, req.user.role);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body(new ZodValidationPipe(updateConsultationSchema))
    updateDto: UpdateConsultationDto,
  ) {
    return this.consultationsService.update(
      id,
      req.user.id,
      req.user.role,
      updateDto,
    );
  }

  @Put(':id/assign/:doctorId')
  async assignDoctor(
    @Param('id') id: string,
    @Param('doctorId') doctorId: string,
  ) {
    return this.consultationsService.assignDoctor(id, doctorId);
  }
}
