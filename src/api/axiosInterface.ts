import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import _ from 'lodash';
import Cookies from 'react-cookie';

const TIMEOUT = 60000;

const publicCall = axios.create({
	baseURL: 'https://jsonplaceholder.typicode.com',
	timeout: TIMEOUT,
	headers: {},
});

interface ResType {
	data: {
		access_token: string;
		refresh_token?: string;
	};
}

interface ConfigType {
	headers: {
		Authorization: string;
	};
}

const _reCallFailedRequest = async (config: ConfigType, token: string): Promise<object> => {
	//!INFO: Request with new token
	config.headers.Authorization = `Bearer ${token}`;

	return new Promise((resolve, reject) => {
		axios
			.request(config)
			.then((response) => {
				resolve(response);
			})
			.catch((er) => {
				if (er.response?.status === 302) {
					resolve(er.response);
				} else {
					reject(er);
				}
			});
	});
};

const _getRefreshToken = async (
	apiClientInstance: AxiosInstance,
	params: URLSearchParams,
	onSuccess: Function
): Promise<object> => {
	return apiClientInstance
		.post('/refreshTokenApi', params, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})
		.then(async (response: AxiosResponse<any>) => await onSuccess(response))
		.catch((error) => error);
};

interface configType {
	data: {
		customerToken?: string;
	};
	url: string;
	params?: {
		cookieData?: {
			mark_one: string;
		};
	};
}

const _getAccessToken = (config: configType | AxiosRequestConfig, isPrivate: boolean) => {
	//!INFO: Get access token from cookie
	//TODO: Add check for private
	return `Bearer access_token`;
};

//!INFO: PUBLIC API INSTANCE INTERCEPTOR REQUEST
publicCall.interceptors.request.use(
	async (config: AxiosRequestConfig) => {
		const access_token = _getAccessToken(config, false);

		if (_.trim(access_token)) config.headers = { Authorization: `Bearer ${access_token}` };

		return config;
	},
	(error) => Promise.reject(error)
);

//!INFO: PUBLIC API INSTANCE INTERCEPTOR RESPONSE
publicCall.interceptors.response.use(
	(response: AxiosResponse) => {
		//TODO: Handler HTTP error here

		return response;
	},

	async (error) => {
		//TODO: Handler HTTP error here
		throw error;
		// const originalRequest = error?.config;

		// try {
		// 	if (error?.response === undefined) {
		// 		//!INFO: Handle error when no response
		// 		return Promise.reject(JSON.parse(error));
		// 	} else if (error?.response?.status >= 500) {
		// 		//!INFO: Handle 500 error
		// 		return Promise.reject(error);
		// 	} else if (error?.response?.status === 401 && !originalRequest._retry) {
		// 		originalRequest._retry = true;

		// 		//!INFO: Handle 401 error
		// 		//!INFO: Retry request with new token
		// 	} else {
		// 		//!INFO: Handle other error
		// 		return Promise.reject(error);
		// 	}
		// } catch (error: any) {
		// 	//!INFO: Handle error
		// 	return Promise.reject(error);
		// }
	}
);

const privateCall = axios.create({
	baseURL: 'https://jsonplaceholder.typicode.com/',
	timeout: TIMEOUT,
	headers: {},
});

//!INFO: PRIVATE API INSTANCE INTERCEPTOR REQUEST
privateCall.interceptors.request.use(
	async (config) => {
		try {
			const paramsData = _.cloneDeep(config.params);

			let access_token: string = _getAccessToken(config, true);

			if (_.trim(access_token)) config.headers = { Authorization: `Bearer ${access_token}` };

			config.params = paramsData;

			return config;
		} catch (e) {
			return Promise.reject(e);
		}
	},
	(error) => {
		return Promise.reject(error);
	}
);
//!INFO: PRIVATE API INSTANCE INTERCEPTOR RESPONSE
privateCall.interceptors.response.use(
	(response) => {
		//TODO: Handler HTTP error here

		return response;
	},
	async (error) => {
		//TODO: Handler HTTP error here

		throw error;
		// const originalRequest = error.config;

		// try {
		// 	if (error?.response === undefined) {
		// 		//!INFO: Handle error when no response
		// 		return Promise.reject(JSON.parse(error));
		// 	} else if (error?.response?.status >= 500) {
		// 		//!INFO: Handle 500 error
		// 		return Promise.reject(error);
		// 	} else if (error.response.status === 401 && !originalRequest._retry) {
		// 		originalRequest._retry = true;

		// 		const params = new URLSearchParams();

		// 		const _callBack = async (res: ResType) => {
		// 			try {
		// 				return await _reCallFailedRequest(error.config, res?.data?.access_token);
		// 			} catch (error: any) {
		// 				//TODO: Handle error
		// 				return Promise.reject(error);
		// 			}
		// 		};
		// 		return _getRefreshToken(privateCall, params, _callBack);
		// 	}
		// 	return Promise.reject(error);
		// } catch (error: any) {
		// 	//TODO: Handle error
		// 	return Promise.reject(error);
		// }
	}
);

export const getPrivate = async (url: string, config = {}) => {
	try {
		return await privateCall.get(url, config);
	} catch (error: any) {
		throw error.response;
	}
};

export const postPrivate = async (url: string, data: object, config = {}) => {
	try {
		const res = await privateCall.post(url, data, config);
		return res;
	} catch (error: any) {
		throw error.response;
	}
};

export const putPrivate = async (url: string, data: object, config = {}) => {
	try {
		return await privateCall.put(url, data, config);
	} catch (error: any) {
		throw error.response;
	}
};

export const deletePrivate = async (url: string, config = {}) => {
	try {
		return await privateCall.delete(url, config);
	} catch (error: any) {
		throw error.response;
	}
};

export const getPublic = async (url: string, config = {}) => {
	try {
		return await publicCall.get(url, config);
	} catch (error: any) {
		throw error.response;
	}
};

export const postPublic = async (url: string, data: object, config = {}) => {
	try {
		return await publicCall.post(url, data, config);
	} catch (error: any) {
		throw error.response;
	}
};
