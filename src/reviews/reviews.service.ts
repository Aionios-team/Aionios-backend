import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
	constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>) {}

	create(data: CreateReviewDto) {
		return this.reviewModel.create(data);
	}

	findAll(limit = 100) {
		return this.reviewModel.find().sort({ createdAt: -1 }).limit(limit).exec();
	}

	findByNegocio(negocioId: number, limit = 100) {
		return this.reviewModel.find({ negocio_id: negocioId }).sort({ createdAt: -1 }).limit(limit).exec();
	}

	findOne(id: string) {
		return this.reviewModel.findById(id).exec();
	}

	update(id: string, data: UpdateReviewDto) {
		return this.reviewModel.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	remove(id: string) {
		return this.reviewModel.findByIdAndDelete(id).exec();
	}
}
