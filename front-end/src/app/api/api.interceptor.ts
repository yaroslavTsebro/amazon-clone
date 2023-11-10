import axios from 'axios';
import {
	getAccessToken,
	removeFromStorage
} from '../services/auth/auth.helper';
import authService from '../services/auth/auth.service';
import { errorCatch, getContentType } from './api.helper';

export const instace = axios.create({
	baseURL: process.env.SERVER_URL,
	headers: getContentType()
});

instace.interceptors.request.use(config => {
	const accessToken = getAccessToken();

	if (config && accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	return config;
});

instace.interceptors.response.use(
	config => config,
	async error => {
		const originalrequest = error.config;

		if (
			(error.response.status === 401 ||
				errorCatch(error) === 'jwt expired' ||
				errorCatch(error) === 'jwt must be provided') &&
			error.config &&
			!error.config._isRetry
		) {
			originalrequest._isRetry = true;

			try {
				await authService.getNewTokens();
				return instace.request(originalrequest);
			} catch (e) {
				if (errorCatch(error) === 'jwt expired') removeFromStorage();
			}
		}

		throw error;
	}
);