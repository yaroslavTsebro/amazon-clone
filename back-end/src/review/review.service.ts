import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnReviewObject } from './dto/return-review.object';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
	constructor(private readonly prisma: PrismaService) {}

	async getAll() {
		return this.prisma.review.findMany({
			orderBy: { createdAt: 'desc' },
			select: returnReviewObject
		});
	}

	async create(userId: number, dto: CreateReviewDto, productId: number) {
		return this.prisma.review.create({
			data: {
				...dto,
				product: {
					connect: {
						id: productId
					}
				},
				user: {
					connect: {
						id: userId
					}
				}
			}
		});
	}

	async getAverageValueByProductId(productId: number) {
		return this.prisma.review
			.aggregate({
				where: { productId },
				_avg: { rating: true }
			})
			.then(data => data._avg);
	}
}
