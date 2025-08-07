import { request } from "../axios";

export const MOCK_DATA_SERVICE = {
	getMockData: (page: number) =>
		request.get("/api/table", { params: { page, size: 40, columns: 100 } }),
};
