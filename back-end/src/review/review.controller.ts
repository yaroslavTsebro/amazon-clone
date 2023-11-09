import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Review } from '@prisma/client';

@Controller('reviews')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@Get()
	async getAll() {
		return this.reviewService.getAll();
	}

	@UsePipes(new ValidationPipe())
	@Post('leave/:productId')
	@Auth()
	@HttpCode(200)
	async leaveReview(
		@CurrentUser('id') id: number,
		@Body() dto: CreateReviewDto,
		@Param('productId') productId: string
	): Promise<Review> {
		return this.reviewService.create(id, dto, +productId);
	}
}
