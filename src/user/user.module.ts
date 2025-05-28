import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCourseAccessSchema } from 'src/user-course-access/entities/user-course-access.entity';
import { User, UserSchema } from './entities/user.entity';
import { UserSeeder } from './user-seeder';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: 'UserCourseAccess', schema: UserCourseAccessSchema },
    ]),
  ],
  providers: [UserResolver, UserService, UserSeeder],
  exports: [UserService],
})
export class UserModule {}
