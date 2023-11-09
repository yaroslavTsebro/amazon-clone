import { Prisma } from '@prisma/client';

export const returnReviewObject: Prisma.ReviewSelect = {
	user: {
		select: {
			id: true,
			name: true,
			avatarPath: true
		}
	},
	id: true,
	text: true,
	rating: true,
	createdAt: true,
};
