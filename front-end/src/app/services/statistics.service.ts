import { instace } from "../api/api.interceptor";
import { UpdateUserDto } from "../types/dto/update-user.dto";
import { IUser } from "../types/user.interface";

const USERS = 'users';

class UserService {
	async getProfile() {
		return instace<IUser>({
			url: `${USERS}/profile`,
			method: 'GET'
		});
	}

	async update(data: UpdateUserDto) {
		return instace<IUser>({
			url: `${USERS}/profile`,
			method: 'PUT',
			data: data
		});
	}

  async toggleFavorite(productId: string) {
		return instace<IUser>({
			url: `${USERS}/profile/favorites/${productId}`,
			method: 'PATCH',
		});
	}
}

export default new UserService();
