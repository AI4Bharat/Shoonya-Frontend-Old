import React, { useState } from "react";
import { Button, DatePicker, Input, Table, Typography } from "antd";
import moment from "moment"; // present along with 'antd'
import { useParams } from "react-router-dom";

import { getReportsWithinRange } from "../../api/ProjectDashboardAPI";
import { reportResultsColumns } from "./TasksTableContent";
import useFullPageLoader from "../../hooks/useFullPageLoader";

const DATE_FORMAT = "YYYY-MM-DD";

export function ReportsTab() {
	const { project_id: projectId } = useParams();
	const [fromDate, setFromDate] = useState(moment());
	const [toDate, setToDate] = useState(moment());
	const [reportResults, setReportResults] = useState([]);
	const [loader, showLoader, hideLoader] = useFullPageLoader();
	const [columns, setColumns] = useState(reportResultsColumns);

	const handleFetchResults = async () => {
		showLoader();
		const results = await getReportsWithinRange(
			projectId,
			fromDate.format(DATE_FORMAT),
			toDate.format(DATE_FORMAT)
		).then((results) => {
			hideLoader();
			if (results?.length && Object.keys(results[0]).includes("Word Count")) {
				setColumns([...reportResultsColumns, 
					{
						title: "Average Word Count",
						dataIndex: "Word Count",
						key: "Word Count",
						align: "center"
					}
				]);
			}
			return results;
		});

		if (results && Array.isArray(results)) {
			setReportResults(results);
		}
	};

	return (
		<>
			<div
				style={{
					display: "flex",
					alignItems: "center",
				}}
			>
				<Input.Group style={{ display: "flex", alignItems: "center" }}>
					<Typography.Text
						strong={true}
						style={{ marginRight: "2%" }}
					>
						From Date:
					</Typography.Text>
					<DatePicker
						value={fromDate}
						onChange={(value) => setFromDate(value)}
						allowClear={false}
					/>
				</Input.Group>
				<Input.Group style={{ display: "flex", alignItems: "center" }}>
					<Typography.Text
						strong={true}
						style={{ marginRight: "2%" }}
					>
						To Date:
					</Typography.Text>
					<DatePicker
						value={toDate}
						onChange={(value) => setToDate(value)}
						allowClear={false}
					/>
				</Input.Group>
				<Button type="primary" onClick={handleFetchResults}>
					Fetch Results
				</Button>
			</div>
			<Table
				style={{ margin: "80px 10px 10px 10px" }}
				columns={columns}
				dataSource={reportResults}
			/>
			{loader}
		</>
	);
}
