import { request } from "../axios";

export const MOCK_DATA_SERVICE = {
	getMockData: (page: number) =>
		request.get("/api/table", { params: { page, size: 25, columns: 100 } }),
};
