export const generateMockData = (rowCount: number, columnCount: number) => {
	const columns = Array.from({ length: columnCount }, (_, i) => ({
		headerName: `Col ${i + 1}`,
		field: `col-${i}`,
		width: 120,
	}));

	const data = Array.from({ length: rowCount }, (_, rowIndex) => {
		const row: Record<string, string> = {};
		for (let colIndex = 0; colIndex < columnCount; colIndex++) {
			row[`col-${colIndex}`] = `R${rowIndex}C${colIndex}`;
		}
		return row;
	});

	return { columns, data };
};
