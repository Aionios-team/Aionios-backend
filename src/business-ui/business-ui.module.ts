import { Module } from '@nestjs/common';
import { BusinessUiController } from './business-ui.controller';
import { BusinessUiService } from './business-ui.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessUiConfig, BusinessUiConfigSchema } from './schemas/business-ui-config.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: BusinessUiConfig.name, schema: BusinessUiConfigSchema }])],
  controllers: [BusinessUiController],
  providers: [BusinessUiService]
})
export class BusinessUiModule {}
