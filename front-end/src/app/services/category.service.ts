import { instace } from '@/app/api/api.interceptor';
import { ICategory } from '../types/category.interface';

const CATEGORIES = 'categories';

class CategoryService {
	async getAll() {
		return instace<ICategory[]>({
			url: CATEGORIES,
			method: 'GET'
		});
	}

	async getById(id: string) {
		return instace<ICategory>({
			url: `${CATEGORIES}/${id}`,
			method: 'GET'
		});
	}

	async getBySlug(slug: string) {
		return instace<ICategory>({
			url: `${CATEGORIES}/by-slug/${slug}`,
			method: 'GET'
		});
	}

	async create() {
		return instace<ICategory>({
			url: `${CATEGORIES}`,
			method: 'POST'
		});
	}

	async delete(id: string) {
		return instace<ICategory>({
			url: `${CATEGORIES}/${id}`,
			method: 'DELETE'
		});
	}

	async update(id: string, name: string) {
		return instace<ICategory>({
			url: `${CATEGORIES}/${id}`,
			method: 'PUT',
			data: { name }
		});
	}
}

export default new CategoryService();
