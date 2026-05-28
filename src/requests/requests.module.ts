import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { RequestMessage, RequestMessageSchema } from './schemas/request-message.schema';

@Module({
  imports: [
    PrismaModule,
    NotificationsModule,
    MongooseModule.forFeature([{ name: RequestMessage.name, schema: RequestMessageSchema }]),
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
