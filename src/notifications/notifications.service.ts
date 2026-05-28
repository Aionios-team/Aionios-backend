import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
	constructor(@InjectModel(Notification.name) private notifModel: Model<NotificationDocument>) {}

	create(data: any) {
		return this.notifModel.create(data);
	}

	findAll(limit = 100) {
		return this.notifModel.find().sort({ createdAt: -1 }).limit(limit).exec();
	}

	findByUser(usuarioId: number, limit = 10) {
		return this.notifModel
			.find({ usuario_id: usuarioId })
			.sort({ createdAt: -1 })
			.limit(limit)
			.exec();
	}

	removeLegacyByUser(usuarioId: number) {
		return this.notifModel
			.deleteMany({ usuario_id: usuarioId, titulo: 'Actividad registrada' })
			.exec();
	}

	update(id: string, data: any) {
		return this.notifModel.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	remove(id: string) {
		return this.notifModel.findByIdAndDelete(id).exec();
	}
}
