import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';

@Injectable()
export class ServicesService {
	constructor(@InjectModel(Service.name) private serviceModel: Model<ServiceDocument>) {}

	create(data: any) {
		return this.serviceModel.create(data);
	}

	findAll(limit = 100) {
		return this.serviceModel.find().sort({ createdAt: -1 }).limit(limit).exec();
	}

	findByNegocio(negocioId: number, limit = 100) {
		return this.serviceModel.find({ negocio_id: negocioId }).sort({ createdAt: -1 }).limit(limit).exec();
	}

	findOne(id: string) {
		return this.serviceModel.findById(id).exec();
	}

	update(id: string, data: any) {
		return this.serviceModel.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	remove(id: string) {
		return this.serviceModel.findByIdAndDelete(id).exec();
	}
}
