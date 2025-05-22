/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { CourseService } from 'src/course/course.service';
import { Course } from 'src/course/entities/course.entity';
import { Lesson } from 'src/lesson/entities/lesson.entity';
import { LessonService } from 'src/lesson/lesson.service';
import * as XLSX from 'xlsx';

@Injectable()
export class UploadContentService {
  private readonly logger = new Logger(UploadContentService.name);

  constructor(
    @Inject(CourseService)
    private readonly courseService: CourseService,
    @Inject(LessonService)
    private readonly lessonService: LessonService,
  ) {}

  async uploadAndSave(file: Express.Multer.File) {
    const parsedData = this.parseExcel(file);
    return this.saveParsedContent(parsedData.preview);
  }

  private parseExcel(file: Express.Multer.File) {
    if (!file?.buffer) throw new BadRequestException('Файл отсутствует или повреждён');

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const result = {};

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      result[sheetName] = XLSX.utils.sheet_to_json(sheet);
    }

    return {
      message: 'Файл успешно прочитан',
      sheets: Object.keys(result),
      preview: result,
    };
  }

  private async saveParsedContent(parsedData: Record<string, any[]>) {
    const results: {
      courses: Course[];
      lessons: Lesson[];
    } = {
      courses: [],
      lessons: [],
    };
    // 1. Создание курсов
    if (parsedData['course']) {
      for (const row of parsedData['course']) {
        const course = await this.courseService.create({
          courseName: row.courseName,
          description: row.description || '',
          lang: row.lang || 'kz',
        });

        results.courses.push(course);
      }
    }

    // 2. Создание уроков
    if (parsedData['lesson']) {
      for (const row of parsedData['lesson']) {
        const course = await this.courseService.findByNameAndLang(row.courseName, row.lang);
        if (!course) {
          this.logger.warn(`Курс "${row.courseName}" (${row.lang}) не найден для урока "${row.lessonName}"`);
          continue;
        }

        const lesson = await this.lessonService.create({
          lessonName: row.lessonName,
          description: row.description || '',
          videoUrl: row.videoUrl || '',
          lessonCode: row.lessonCode || '',
          order: row.order || 0,
          lang: row.lang || 'kz',
          course: course._id,
        });

        results.lessons.push(lesson);
      }
    }

    return {
      message: 'Контент успешно импортирован',
      ...results,
    };
  }
}
