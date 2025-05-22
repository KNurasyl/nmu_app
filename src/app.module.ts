import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module';
import { TaskModule } from './task/task.module';
import { UploadContentModule } from './upload-content/upload-content.module';
import { UserLessonProgressModule } from './user-lesson-progress/user-lesson-progress.module';
import { UserTaskProgressModule } from './user-task-progress/user-task-progress.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: () => {
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          playground: true,
          installSubscriptionHandlers: true,
        };
      },
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('MONGODB_DB'),
      }),
    }),
    UserModule,
    CourseModule,
    LessonModule,
    UploadContentModule,
    TaskModule,
    UserTaskProgressModule,
    UserLessonProgressModule,
  ],
})
export class AppModule {}
