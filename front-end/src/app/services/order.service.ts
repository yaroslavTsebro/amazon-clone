import { instace } from "../api/api.interceptor";
import { UpdateUserDto } from "../types/dto/update-user.dto";
import { IOrder } from "../types/order.interface";
import { IUser } from "../types/user.interface";

const ORDER = 'orders';

class OrderService {
	async getAll() {
		return instace<IOrder[]>({
			url: ORDER,
			method: 'GET'
		});
	}
}

export default new OrderService();
