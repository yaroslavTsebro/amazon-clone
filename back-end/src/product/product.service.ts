import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { generateSlug } from 'src/utils/generate-slug';
import { ProductDto } from './dto/product.dto';
import {
	returnProductObject,
	returnProductObjectFullest
} from './dto/return-product.object';
import { EnumProductSort, GetAllProductDto } from './dto/get-all.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService
	) {}

	async getById(id: number) {
		const product = await this.prisma.product.findUnique({
			where: { id },
			select: returnProductObjectFullest
		});

		if (!product) throw new NotFoundException('product was not found');

		return product;
	}

	async getBySlug(slug: string) {
		const product = await this.prisma.product.findUnique({
			where: { slug },
			select: returnProductObjectFullest
		});

		if (!product) throw new NotFoundException('product was not found');

		return product;
	}

	async getAll(dto: GetAllProductDto = {}) {
		const { sort, searchTerm } = dto;
		const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];

		if (sort === EnumProductSort.LOW_PRICE) {
			prismaSort.push({ price: 'asc' });
		} else if (sort === EnumProductSort.HIGH_PRICE) {
			prismaSort.push({ price: 'desc' });
		} else if (sort === EnumProductSort.OLDEST) {
			prismaSort.push({ createdAt: 'asc' });
		} else prismaSort.push({ createdAt: 'desc' });

		const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
			? {
					OR: [
						{
							category: {
								name: {
									contains: searchTerm,
									mode: 'insensitive'
								}
							}
						},
						{
							name: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						},
						{
							description: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						}
					]
			  }
			: {};

		const { perPage, skip } = this.paginationService.getPagination(dto);
		const products = await this.prisma.product.findMany({
			where: prismaSearchTermFilter,
			orderBy: prismaSort,
			skip,
			take: perPage
		});
		return {
			products,
			length: await this.prisma.product.count({
				where: prismaSearchTermFilter
			})
		};
	}

	async getByCategory(categorySlug: string) {
		const products = await this.prisma.product.findMany({
			where: {
				category: {
					slug: categorySlug
				}
			},
			select: returnProductObjectFullest
		});
		if (!products) throw new NotFoundException('product was not found');

		return products;
	}

	async getSimilar(id: number) {
		const currentProduct = await this.getById(id);

		const products = await this.prisma.product.findMany({
			where: {
				category: {
					name: currentProduct.category.name
				},
				NOT: {
					id: currentProduct.id
				}
			},
			orderBy: {
				createdAt: 'desc'
			},
			select: returnProductObject
		});

		if (!products) throw new NotFoundException('product was not found');

		return products;
	}

	async create() {
		const product = await this.prisma.product.create({
			data: {
				description: '',
				name: '',
				price: 0,
				slug: ''
			}
		});
	}

	async update(id: number, dto: ProductDto) {
		const { description, name, images, categoryId, price } = dto;

		return this.prisma.product.update({
			where: {
				id
			},
			data: {
				description,
				name,
				images,
				price,
				slug: generateSlug(name),
				category: {
					connect: {
						id: categoryId
					}
				}
			}
		});
	}

	async delete(id: number) {
		return this.prisma.product.delete({ where: { id } });
	}
}
