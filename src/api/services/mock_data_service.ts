import { request } from "../axios";

export const MOCK_DATA_SERVICE = {
	getMockData: () => request.get("/api/table"),
};
