import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useRef } from "react";
import { MOCK_DATA_SERVICE } from "../api/services/mock_data_service";
import { useFetchQuery } from "../hooks/use-fetch-query";

const fetchData = async () => {
	try {
		const { data } = await MOCK_DATA_SERVICE.getMockData();
		return data || { columns: [], data: [] };
	} catch (error) {
		console.error("Error fetching mock data:", error);
		return { columns: [], data: [] };
	}
};

const VirtualTable = () => {
	const gridRef = useRef(null);

	const { data, isLoading } = useFetchQuery({
		queryKey: ["mockData"],
		queryFn: () => fetchData(),
	});

	if (isLoading || !data) {
		return (
			<div className="p-6 text-center text-gray-500 text-lg">
				Loading table...
			</div>
		);
	}

	const { columns, data: rowData } = data;

	return (
		<div className="h-dvh w-full overflow-hidden p-2 ag-theme-alpine">
			<AgGridReact
				ref={gridRef}
				columnDefs={columns}
				rowData={rowData}
				defaultColDef={{
					resizable: true,
					sortable: true,
					filter: true,
					cellStyle: { padding: "4px 8px" },
				}}
				rowHeight={32}
				headerHeight={36}
				rowBuffer={10}
				domLayout="normal"
			/>
		</div>
	);
};

export default VirtualTable;
