import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Horario, HorarioDocument } from './schemas/horario.schema';

@Injectable()
export class HorariosService {
	constructor(@InjectModel(Horario.name) private horarioModel: Model<HorarioDocument>) {}

	create(data: any) {
		return this.horarioModel.create(data);
	}

	findAll(limit = 100) {
		return this.horarioModel.find().sort({ createdAt: -1 }).limit(limit).exec();
	}

	findByNegocio(negocioId: number) {
		return this.horarioModel.findOne({ negocio_id: negocioId }).exec();
	}

	findOne(id: string) {
		return this.horarioModel.findById(id).exec();
	}

	update(id: string, data: any) {
		return this.horarioModel.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	remove(id: string) {
		return this.horarioModel.findByIdAndDelete(id).exec();
	}

	async addBloqueo(negocioId: number, bloqueo: { fecha: string; hora_inicio: string; hora_fin: string; motivo?: string }) {
		return this.horarioModel.findOneAndUpdate(
			{ negocio_id: negocioId },
			{ $push: { excepciones_y_festivos: { ...bloqueo, tipo: 'bloqueo' } } },
			{ new: true, upsert: true },
		).exec();
	}

	async removeBloqueo(negocioId: number, bloqueoIndex: number) {
		const horario = await this.horarioModel.findOne({ negocio_id: negocioId }).exec();
		if (!horario) return null;
		horario.excepciones_y_festivos.splice(bloqueoIndex, 1);
		return horario.save();
	}
}
