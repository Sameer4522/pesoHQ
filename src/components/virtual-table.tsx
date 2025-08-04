import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useRef } from "react";
import { generateMockData } from "../data/mock-data";
import { useFetchQuery } from "../hooks/use-fetch-query";

const VirtualTable = () => {
	const gridRef = useRef(null);

	const { data, isLoading } = useFetchQuery({
		queryKey: ["mockData"],
		queryFn: () => Promise.resolve(generateMockData(100000, 100)),
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
