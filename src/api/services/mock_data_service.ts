import { request } from "../axios";

export const MOCK_DATA_SERVICE = {
	getMockData: (page: number, size: number) =>
		request.get("/api/table", { params: { page, size, columns: 100 } }),
};
