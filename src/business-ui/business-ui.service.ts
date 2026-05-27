import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessUiConfig, BusinessUiConfigDocument } from './schemas/business-ui-config.schema';

@Injectable()
export class BusinessUiService {
	constructor(@InjectModel(BusinessUiConfig.name) private configModel: Model<BusinessUiConfigDocument>) {}

	create(data: any) {
		return this.configModel.create(data);
	}

	findAll(limit = 100) {
		return this.configModel.find().sort({ createdAt: -1 }).limit(limit).exec();
	}

	findByNegocio(negocioId: number) {
		return this.configModel.findOne({ negocio_id: negocioId }).exec();
	}

	update(id: string, data: any) {
		return this.configModel.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	remove(id: string) {
		return this.configModel.findByIdAndDelete(id).exec();
	}
}
