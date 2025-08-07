import type { AxiosResponse } from "axios";
import axios, { AxiosError } from "axios";

const instance = axios.create({
	baseURL: "/",
	timeout: 30000,
});

const normalizeResponse = (response: AxiosResponse) => {
	return Promise.resolve({
		message:
			response?.data?.message ||
			(response.status === 200
				? "Request successful"
				: "Unable to process request. Try again later!"),
		data: response.data || null,
		status: response.status,
		headers: response.headers,
		fullResponse: response.data,
	});
};

const normalizeError = (error: AxiosError<any>) => {
	return Promise.reject({
		message: error.response?.data?.message || null,
		data: error.response?.data?.data || error.response?.data || null,
		status: error.status,
		responseStatus: error.response?.data?.error_code || error.status,
		error: error,
		fullResponse: error.response,
	});
};

export const request = {
	get: (url: string, headers?: any) =>
		instance
			.get(url, { ...headers })
			.then(res => normalizeResponse(res))
			.catch((err: AxiosError) => normalizeError(err)),
	post: <B>(url: string, body: B, headers?: any) =>
		instance
			.post(url, body, { ...headers })
			.then(res => normalizeResponse(res))
			.catch((err: AxiosError) => normalizeError(err)),
	put: <B>(url: string, body: B, headers?: any) =>
		instance
			.put(url, body, { ...headers })
			.then(res => normalizeResponse(res))
			.catch((err: AxiosError) => normalizeError(err)),
	delete: (url: string) =>
		instance
			.delete(url)
			.then(res => normalizeResponse(res))
			.catch((err: AxiosError) => normalizeError(err)),
};
