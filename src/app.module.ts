import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BusinessModule } from './business/business.module';
import { ServicesModule } from './services/services.module';
import { RequestsModule } from './requests/requests.module';
import { PaymentsModule } from './payments/payments.module';
import { HorariosModule } from './horarios/horarios.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { SupportTicketsModule } from './support-tickets/support-tickets.module';
import { BusinessUiModule } from './business-ui/business-ui.module';

@Module({
  imports: [AuthModule, UsersModule, BusinessModule, ServicesModule, RequestsModule, PaymentsModule, HorariosModule, ReviewsModule, NotificationsModule, ActivityLogsModule, SupportTicketsModule, BusinessUiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
