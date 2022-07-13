import { postPrivate, getPrivate } from './axiosInterface';

type DataType = {
	error?: object | null;
	message?: string;
	errors?: object | null;
	status?: string;
};

interface ResponseInterface {
	data?: DataType | null | Array<object>;
	status: string;
	message?: string;
	httpStatus: number;
	statusText: string;
}

interface ResponseArgType {
	data?: DataType;
	status: number;
	statusText: string;
}

const _getResponseObj = (response: ResponseArgType): ResponseInterface => {
	return {
		status: response?.data?.status || 'success',
		message: response?.data?.message || '',
		data: response?.data || null,
		httpStatus: response?.status || 401,
		statusText: response?.statusText || 'OK',
	};
};

interface ErrorArgType {
	response?: object | undefined | null;
	status?: number;
	statusText?: string;
	data?: object;
}

interface ErrorReturnType {
	status: string;
	error: object | null;
	httpStatus: number;
	statusText: string;
}

const _getErrorObj = (error: ErrorArgType): ErrorReturnType => {
	return {
		status: 'error',
		error: error?.data || error?.response || null,
		httpStatus: error?.status || 401,
		statusText: error?.statusText || 'NOT OK',
	};
};

export const postPrivateAPI = async (urlPath: string, data: {}, config = {}) => {
	try {
		const response = await postPrivate(urlPath, data, config);
		return _getResponseObj(response);
	} catch (error: any) {
		return _getErrorObj(error);
	}
};

export const getPrivateAPI = async (urlPath: string, config = {}) => {
	try {
		const response = await getPrivate(urlPath);
		return _getResponseObj(response);
	} catch (error: any) {
		return _getErrorObj(error);
	}
};

export { _getResponseObj, _getErrorObj };
