import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadContentService } from './upload-content.service';

@Controller('upload-content')
export class UploadContentController {
  constructor(private readonly uploadContentService: UploadContentService) {}

  @Post('excel')
  @UseInterceptors(FileInterceptor('file'))
  uploadExcel(@UploadedFile() file: Express.Multer.File) {
    return this.uploadContentService.uploadAndSave(file);
  }
}
