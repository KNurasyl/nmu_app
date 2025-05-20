import { Module } from '@nestjs/common';
import { CourseModule } from 'src/course/course.module';
import { LessonModule } from 'src/lesson/lesson.module';
import { UploadContentController } from './upload-content.controller';
import { UploadContentService } from './upload-content.service';

@Module({
  imports: [CourseModule, LessonModule],
  controllers: [UploadContentController],
  providers: [UploadContentService],
})
export class UploadContentModule {}
