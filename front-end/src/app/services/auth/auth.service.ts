import { getContentType } from '@/app/api/api.helper';
import { IAuthResponse, IEmailPassword } from '@/app/store/user/user.interface';
import axios from 'axios';
import Cookies from 'js-cookie';
import { saveToStorage } from './auth.helper';
import { instace } from '@/app/api/api.interceptor';

class AuthService {
	async main(type: 'login' | 'register', data: IEmailPassword) {
		const response = await instace<IAuthResponse>({
			url: `/auth/${type}`,
			method: 'POST',
			data
		});

		if (response.data.accessToken) saveToStorage(response.data);

		return response.data;
	}

	async getNewTokens() {
		const refreshToken = Cookies.get('refresh-token');

		const response = await axios.post<string, { data: IAuthResponse }>(
			process.env.SERVER_URL + '/login/access-token',
			{ refreshToken },
			{
				headers: getContentType()
			}
		);
		if (response.data.accessToken) saveToStorage(response.data);

		return response;
	}
}

export default new AuthService();
