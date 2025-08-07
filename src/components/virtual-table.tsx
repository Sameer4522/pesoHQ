import { themeMaterial } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { AgGridReact } from "ag-grid-react";
import { useRef, useState } from "react";
import { MOCK_DATA_SERVICE } from "../api/services/mock_data_service";
import { useFetchQuery } from "../hooks/use-fetch-query";

const LoadingCellRenderer = () => (
	<div className="p-4 w-full animate-pulse rounded bg-gray-300" />
);

const generatePlaceholderData = () => {
	const columns = Array.from({ length: 10 }, (_, index) => ({
		headerName: `Column ${index + 1}`,
		field: `col${index + 1}`,
		cellRenderer: LoadingCellRenderer,
	}));

	const data = Array.from({ length: 25 }, () => {
		const row: Record<string, null> = {};
		columns.forEach(col => {
			row[col.field] = null;
		});
		return row;
	});

	return { columns, data };
};

const VirtualTable = () => {
	const gridRef = useRef(null);
	const [page, setPage] = useState<number>(1);

	let columns, rowData;

	const { data, isLoading } = useFetchQuery({
		queryKey: ["mockData"],
		queryFn: async () => {
			try {
				const { data } = await MOCK_DATA_SERVICE.getMockData(page);
				return data || { columns: [], data: [] };
			} catch (error) {
				console.error("Error fetching mock data:", error);
				return { columns: [], data: [] };
			}
		},
		refetchInterval: 3000,
		refetchIntervalInBackground: true,
		initialData: ({ columns, data: rowData } = generatePlaceholderData()),
	});

	columns = data.columns;
	rowData = data.data;

	return (
		<div className="h-dvh w-full overflow-hidden p-2 ag-theme-material">
			<AgGridReact
				ref={gridRef}
				theme={themeMaterial}
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
