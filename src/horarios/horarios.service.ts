import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Horario, HorarioDocument } from './schemas/horario.schema';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';

@Injectable()
export class HorariosService {
	constructor(@InjectModel(Horario.name) private horarioModel: Model<HorarioDocument>) {}

	create(data: CreateHorarioDto) {
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

	update(id: string, data: UpdateHorarioDto) {
		return this.horarioModel.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	remove(id: string) {
		return this.horarioModel.findByIdAndDelete(id).exec();
	}
}
