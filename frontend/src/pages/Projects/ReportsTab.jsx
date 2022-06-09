import React, { useState } from "react";
import { Button, DatePicker, Input, Table, Typography } from "antd";
import moment from "moment"; // present along with 'antd'
import { useParams } from "react-router-dom";

import { getReportsWithinRange } from "../../api/ProjectDashboardAPI";
import { reportResultsColumns } from "./TasksTableContent";

const DATE_FORMAT = "YYYY-MM-DD";

export function ReportsTab() {
	const { project_id: projectId } = useParams();
	const [fromDate, setFromDate] = useState(moment());
	const [toDate, setToDate] = useState(moment());
	const [reportResults, setReportResults] = useState([]);

	const handleFetchResults = async () => {
		const results = await getReportsWithinRange(
			projectId,
			fromDate.format(DATE_FORMAT),
			toDate.format(DATE_FORMAT)
		);

		if (results && Array.isArray(results)) {
			const sanitizedResults = results.map((result) => ({
				...result,
				avg_lead_time: parseFloat(result.avg_lead_time).toFixed(2),
			}));
			setReportResults(sanitizedResults);
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
						Select From Date:
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
						Select To Date:
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
				columns={reportResultsColumns}
				dataSource={reportResults}
			/>
		</>
	);
}
