import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessUiConfig, BusinessUiConfigDocument } from './schemas/business-ui-config.schema';

@Injectable()
export class BusinessUiService {
  constructor(@InjectModel(BusinessUiConfig.name) private configModel: Model<BusinessUiConfigDocument>) {}

  findByNegocio(negocioId: number) {
    return this.configModel.findOne({ negocio_id: negocioId }).exec();
  }

  upsertByNegocio(negocioId: number, data: { color_primario?: string; slogan?: string; descripcion_corta?: string }) {
    return this.configModel.findOneAndUpdate(
      { negocio_id: negocioId },
      { $set: data },
      { new: true, upsert: true },
    ).exec();
  }
}
