import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadPhotoDto } from '../../common/validations/photo.validation';

@Injectable()
export class PhotosService {
  constructor(private prisma: PrismaService) {}

  async upload(
    userId: string,
    file: Express.Multer.File,
    uploadDto: UploadPhotoDto,
  ) {
    const photo = await this.prisma.photo.create({
      data: {
        userId,
        consultationId: uploadDto.consultationId,
        url: `/uploads/photos/${file.filename}`,
        caption: uploadDto.caption,
        bodyPart: uploadDto.bodyPart,
        angle: uploadDto.angle,
        metadata: {
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
        },
      },
    });

    return photo;
  }

  async findByUser(userId: string) {
    return this.prisma.photo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByConsultation(consultationId: string) {
    return this.prisma.photo.findMany({
      where: { consultationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findForComparison(userId: string, bodyPart?: string, angle?: string) {
    const where: any = { userId };

    if (bodyPart) {
      where.bodyPart = bodyPart;
    }

    if (angle) {
      where.angle = angle;
    }

    return this.prisma.photo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        consultation: {
          select: {
            id: true,
            createdAt: true,
            status: true,
          },
        },
      },
    });
  }

  async getComparisonPairs(userId: string, bodyPart: string, angle?: string) {
    const photos = await this.findForComparison(userId, bodyPart, angle);

    // Group photos by date for easy comparison
    const photosByDate = photos.reduce((acc, photo) => {
      const date = new Date(photo.createdAt).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(photo);
      return acc;
    }, {});

    return {
      bodyPart,
      angle,
      totalPhotos: photos.length,
      photosByDate,
      photos,
    };
  }

  async delete(id: string, userId: string) {
    const photo = await this.prisma.photo.findUnique({
      where: { id },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    if (photo.userId !== userId) {
      throw new NotFoundException('Photo not found');
    }

    await this.prisma.photo.delete({
      where: { id },
    });

    // TODO: Delete actual file from filesystem
    // fs.unlinkSync(path.join(process.cwd(), photo.url));

    return { message: 'Photo deleted successfully' };
  }

  async getBodyPartStats(userId: string) {
    const photos = await this.prisma.photo.findMany({
      where: { userId },
      select: {
        bodyPart: true,
        angle: true,
        createdAt: true,
      },
    });

    const stats = photos.reduce((acc, photo) => {
      if (photo.bodyPart) {
        if (!acc[photo.bodyPart]) {
          acc[photo.bodyPart] = {
            count: 0,
            angles: {},
            firstPhoto: photo.createdAt,
            lastPhoto: photo.createdAt,
          };
        }

        acc[photo.bodyPart].count++;

        if (photo.angle) {
          acc[photo.bodyPart].angles[photo.angle] =
            (acc[photo.bodyPart].angles[photo.angle] || 0) + 1;
        }

        if (photo.createdAt > acc[photo.bodyPart].lastPhoto) {
          acc[photo.bodyPart].lastPhoto = photo.createdAt;
        }
      }
      return acc;
    }, {});

    return stats;
  }
}
