import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { returnUserObject } from './dto/return-user.object';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async toggleFavorite(id: number, productId: number) {
		const user = await this.getProfile(id, {});

		const isExistis = user.favorites.some(product => product.id === productId);

		return await this.prisma.user.update({
			where: { id },
			data: {
				favorites: {
					[isExistis ? 'disconect' : 'connect']: {
						id: productId
					}
				}
			}
		});
	}

	async update(id: number, dto: UpdateUserDto) {
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email }
		});

		if (!user) throw new NotFoundException('User was not found');
		if (id !== user.id)
			throw new ForbiddenException('You dont have such permission');

		return this.prisma.user.update({
			where: { id },
			data: {
				email: dto.email,
				name: dto.name,
				avatarPath: dto.avatarPath,
				phone: dto.phone,
				password: dto.password ? await hash(dto.password) : user.password
			}
		});
	}

	async getProfile(id: number, selectObject: Prisma.UserSelect) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				...returnUserObject,
				...selectObject,
				favorites: {
					select: {
						id: true,
						name: true,
						price: true,
						images: true,
						slug: true
					}
				}
			}
		});

		if (!user) throw new NotFoundException('User was not found');

		return user;
	}
}
