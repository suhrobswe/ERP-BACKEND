import { Module } from '@nestjs/common';
import { AdminModule } from './api/admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from './config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TeacherModule } from './api/teacher/teacher.module';
import { StudentModule } from './api/student/student.module';
import { GroupModule } from './api/group/group.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { VideoModule } from './api/video/video.module';
import { AuthModule } from './api/auth/auth.module';
import { StatisticModule } from './api/statistic/statistic.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 sekund (millisekundda)
        limit: 10, // Maksimum 10 ta so'rov
      },
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        try {
          console.log('⏳ Connecting to PostgreSQL...');

          return {
            type: 'postgres',
            url: appConfig.dbUrl,
            synchronize: true,
            entities: ['dist/core/entity/*.entity{.ts,.js}'],
            autoLoadEntities: true,
            ssl:
              appConfig.NODE_ENV === 'production'
                ? { rejectUnauthorized: false }
                : false,
          };
        } catch (err) {
          console.error('❌ PostgreSQL connection failed:', err.message);
          process.exit(1); // yoki throw err
        }
      },
    }),
    JwtModule.register({ global: true }),
    AdminModule,
    TeacherModule,
    StudentModule,
    GroupModule,
    AuthModule,
    StatisticModule,
    // VideoModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
