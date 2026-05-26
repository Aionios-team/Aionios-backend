import { Module } from '@nestjs/common';
import { BusinessUiController } from './business-ui.controller';
import { BusinessUiService } from './business-ui.service';

@Module({
  controllers: [BusinessUiController],
  providers: [BusinessUiService]
})
export class BusinessUiModule {}
