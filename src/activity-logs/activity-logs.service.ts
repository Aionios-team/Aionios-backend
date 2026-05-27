import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityLog, ActivityLogDocument } from './schemas/activity-log.schema';

@Injectable()
export class ActivityLogsService {
	constructor(@InjectModel(ActivityLog.name) private logModel: Model<ActivityLogDocument>) {}

	create(data: any) {
		return this.logModel.create(data);
	}

	findAll(limit = 200) {
		return this.logModel.find().sort({ createdAt: -1 }).limit(limit).exec();
	}

	findByUser(usuarioId: number) {
		return this.logModel.find({ usuario_id: usuarioId }).sort({ createdAt: -1 }).exec();
	}
}
