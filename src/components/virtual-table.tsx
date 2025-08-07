import { useQuery } from "@tanstack/react-query";
import { themeMaterial, type GridApi } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MOCK_DATA_SERVICE } from "../api/services/mock_data_service";

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

	return { columns, data, totalSize: data.length };
};

const VirtualTable = () => {
	const gridBodyRef = useRef<HTMLDivElement | null>(null);
	const scrollTopBeforeUpdate = useRef<number>(0);
	const gridRef = useRef<AgGridReact>(null);

	const [pagination, setPagination] = useState({ page: 1, size: 25 });
	const [allRows, setAllRows] = useState<any[]>([]);
	const [columns, setColumns] = useState<any[]>([]);

	const [gridApi, setGridApi] = useState<GridApi | null>(null);
	const [metrics, setMetrics] = useState({
		mountedColumns: 0,
		mountedRows: 0,
		mountedCells: 0,
		rowsInMemory: 0,
		columnsInMemory: 0,
	});

	const { data, isFetching } = useQuery({
		queryKey: ["mockData", pagination.page, pagination.size],
		queryFn: async () => {
			const { data } = await MOCK_DATA_SERVICE.getMockData(
				pagination.page,
				pagination.size
			);
			return data ?? { columns: [], data: [] };
		},
		refetchInterval: 6000,
		refetchIntervalInBackground: true,
		enabled: !!pagination.page,
	});

	useEffect(() => {
		const gridBody = document.querySelector(".ag-body-viewport");
		gridBodyRef.current = gridBody as HTMLDivElement;
		if (gridBodyRef.current) {
			scrollTopBeforeUpdate.current = gridBodyRef.current.scrollTop;
		}
	}, [isFetching]);

	useEffect(() => {
		if (data?.data?.length) {
			setAllRows(data.data);
			if (!columns.length && data.columns?.length) {
				setColumns(data.columns);
			}
		}
	}, [data]);

	useEffect(() => {
		if (gridBodyRef.current) {
			gridBodyRef.current.scrollTop = scrollTopBeforeUpdate.current;
		}
	}, [allRows]);

	const handleBodyScrollEnd = () => {
		const gridBody = gridBodyRef.current;
		if (!gridBody || isFetching) return;
		const { scrollTop, scrollHeight, clientHeight } = gridBody;

		if (scrollTop + clientHeight >= scrollHeight - 50) {
			setPagination(prev => ({
				page: prev.page + 1,
				size: prev.size + 25,
			}));
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (!gridApi) return;

			const renderedRows = gridApi.getRenderedNodes().length;
			const colCount = Math.max(columns.length - 1, 0);

			setMetrics({
				mountedColumns: colCount,
				mountedRows: renderedRows,
				mountedCells: renderedRows * colCount,
				rowsInMemory: allRows.length,
				columnsInMemory: colCount,
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [gridApi, columns, allRows]);

	const memoizedColumns = useMemo(() => {
		if (columns.length > 0) return columns;
		return generatePlaceholderData().columns;
	}, [columns]);

	const memoizedRowData = useMemo(() => {
		if (allRows.length > 0) return allRows;
		return generatePlaceholderData().data;
	}, [allRows]);

	return (
		<div className="h-dvh w-full flex overflow-hidden p-2">
			<div className="flex-1 ag-theme-material">
				<AgGridReact
					ref={gridRef}
					theme={themeMaterial}
					columnDefs={memoizedColumns}
					rowData={memoizedRowData}
					defaultColDef={{
						resizable: true,
						sortable: true,
						filter: true,
						cellStyle: { padding: "4px 8px" },
					}}
					rowHeight={32}
					headerHeight={36}
					domLayout="normal"
					onBodyScrollEnd={handleBodyScrollEnd}
					onGridReady={params => setGridApi(params.api)}
				/>
			</div>

			<div className="w-64 bg-gray-100 border-l border-gray-300 p-4 text-sm font-mono">
				<h2 className="font-bold mb-4 text-base">Debug Panel</h2>
				<ul className="space-y-2">
					<li>Columns Mounted: {metrics.mountedColumns}</li>
					<li>Rows Mounted: {metrics.mountedRows}</li>
					<li>Cells Mounted: {metrics.mountedCells}</li>
					<li>Rows in Memory: {metrics.rowsInMemory}</li>
					<li>Columns in Memory: {metrics.columnsInMemory}</li>
				</ul>
			</div>
		</div>
	);
};

export default VirtualTable;
