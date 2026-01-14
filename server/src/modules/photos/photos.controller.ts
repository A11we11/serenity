import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotosService } from './photos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  uploadPhotoSchema,
  UploadPhotoDto,
} from '../../common/validations/photo.validation';

@Controller('photos')
@UseGuards(JwtAuthGuard)
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('photo'))
  async upload(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body(new ZodValidationPipe(uploadPhotoSchema)) uploadDto: UploadPhotoDto,
  ) {
    return this.photosService.upload(req.user.id, file, uploadDto);
  }

  @Get()
  async findByUser(@Request() req) {
    return this.photosService.findByUser(req.user.id);
  }

  @Get('consultation/:consultationId')
  async findByConsultation(@Param('consultationId') consultationId: string) {
    return this.photosService.findByConsultation(consultationId);
  }

  @Get('comparison')
  async getComparison(
    @Request() req,
    @Query('bodyPart') bodyPart?: string,
    @Query('angle') angle?: string,
  ) {
    return this.photosService.findForComparison(req.user.id, bodyPart, angle);
  }

  @Get('comparison/pairs')
  async getComparisonPairs(
    @Request() req,
    @Query('bodyPart') bodyPart: string,
    @Query('angle') angle?: string,
  ) {
    return this.photosService.getComparisonPairs(req.user.id, bodyPart, angle);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.photosService.getBodyPartStats(req.user.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.photosService.delete(id, req.user.id);
  }
}
