import { Prisma } from '@prisma/client';
import { returnCategoryObject } from 'src/category/dto/return-category.object';
import { returnReviewObject } from 'src/review/dto/return-review.object';

export const returnProductObject: Prisma.ProductSelect = {
	id: true,
	price: true,
	name: true,
	createdAt: true,
	slug: true,
	description: true,
	images: true
};

export const returnProductObjectFullest: Prisma.ProductSelect = {
	...returnProductObject,
	reviews: {
		select: returnReviewObject
	},
	category: { select: returnCategoryObject }
};
