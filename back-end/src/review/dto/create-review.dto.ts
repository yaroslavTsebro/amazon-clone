import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
	@IsNumber()
	@Min(1)
	@Max(1)
	rating: number;

	@IsString()
	text: string;
}
