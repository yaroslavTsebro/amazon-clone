import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnCategoryObject } from './dto/return-category.object';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { generateSlug } from 'src/utils/generate-slug';

@Injectable()
export class CategoryService {
	constructor(private readonly prisma: PrismaService) {}

	async update(id: number, dto: UpdateCategoryDto) {
		return this.prisma.category.update({
			where: { id },
			data: {
				name: dto.name,
				slug: generateSlug(dto.name)
			}
		});
	}

	async delete(id: number) {
		return this.prisma.category.delete({
			where: { id }
		});
	}

	async create() {
		return this.prisma.category.create({
			data: { name: '', slug: '' }
		});
	}

	async getById(id: number) {
		const category = await this.prisma.category.findUnique({
			where: { id },
			select: returnCategoryObject
		});

		if (!category) throw new NotFoundException('Category was not found');

		return category;
	}

	async getBySlug(slug: string) {
		const category = await this.prisma.category.findUnique({
			where: { slug },
			select: returnCategoryObject
		});

		if (!category) throw new NotFoundException('Category was not found');

		return category;
	}

	async getAll() {
		return this.prisma.category.findMany({ select: returnCategoryObject });
	}
}
