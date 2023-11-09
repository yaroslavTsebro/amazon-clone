import {
	Controller,
	Query,
	ValidationPipe,
	Get,
	UsePipes,
	Param,
	Post,
	HttpCode,
	Put,
	Delete,
	Body
} from '@nestjs/common';
import { ProductService } from './product.service';
import { GetAllProductDto } from './dto/get-all.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: GetAllProductDto) {
		return this.productService.getAll(queryDto);
	}

	@Get('similar/:id')
	async getSimilar(@Param('id') id: string) {
		return this.productService.getSimilar(+id);
	}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.productService.getBySlug(slug);
	}

	@Get('by-category/:categorySlug')
	async getProductsByCategory(@Param('categorySlug') slug: string) {
		return this.productService.getByCategory(slug);
	}

	@HttpCode(200)
	@Post()
	@Auth()
	@UsePipes(new ValidationPipe())
	async createProduct() {
		return this.productService.create();
	}

	@HttpCode(200)
	@Put(':id')
	@Auth()
	@UsePipes(new ValidationPipe())
	async updateProduct(@Param('id') id: string, @Body() dto: ProductDto) {
		return this.productService.update(+id, dto);
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async delete(@Param('id') id: string) {
		return this.productService.delete(+id);
	}

	@Get(':id')
	@Auth()
	async getProduct(@Param('id') id: string) {
		return this.productService.getById(+id);
	}
}
