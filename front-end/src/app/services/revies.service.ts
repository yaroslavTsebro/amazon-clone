import { instace } from '@/app/api/api.interceptor';
import { IReview } from '../types/review.interface';
import { CreateReviewDto } from '../types/dto/create-review.dto';

const REVIEWS = 'reviews';

class ReviewService {
	async getAll() {
		return instace<IReview[]>({
			url: REVIEWS,
			method: 'GET'
		});
	}

	async leave(productId: string, data: CreateReviewDto) {
		return instace<IReview>({
			url: `${REVIEWS}/leave/${productId}`,
			method: 'POST',
			data: { data }
		});
	}
}

export default new ReviewService();
