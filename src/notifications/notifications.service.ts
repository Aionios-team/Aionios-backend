import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
	constructor(@InjectModel(Notification.name) private notifModel: Model<NotificationDocument>) {}

	create(data: CreateNotificationDto) {
		return this.notifModel.create(data);
	}

	findAll(limit = 100) {
		return this.notifModel.find().sort({ createdAt: -1 }).limit(limit).exec();
	}

	findByUser(usuarioId: number) {
		return this.notifModel.find({ usuario_id: usuarioId }).sort({ createdAt: -1 }).exec();
	}

	update(id: string, data: UpdateNotificationDto) {
		return this.notifModel.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	remove(id: string) {
		return this.notifModel.findByIdAndDelete(id).exec();
	}
}
