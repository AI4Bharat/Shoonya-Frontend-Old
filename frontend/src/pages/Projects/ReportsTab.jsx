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
		const result = await getReportsWithinRange(
			projectId,
			fromDate.format(DATE_FORMAT),
			toDate.format(DATE_FORMAT)
		);

		if (result) {
			console.log(result);
			setReportResults(result);
		}
	};

	// date format is YYYY-MM-DD

	//     var keys = [];
	//   if (resultsource?.length > 0) {
	//     for (var key in resultsource[0]) {
	//       let obj = {}
	//       obj['title'] = camelize(key)
	//       obj['dataIndex'] = key
	//       obj['key'] = key
	//       keys.push(obj);
	//     }

	//   }

	//     const onDisplayTable = async (id) => {
	//         try {
	//           let response = await axiosInstance.post(`/projects/${id}/get_analytics/`, dateRange);
	//           setResultsource(response.data)
	//           return;
	//         } catch (error) {
	//           message.error(error);
	//         }

	//       };

	return (
		<>
			<div
				style={{
					display: "flex",
					alignItems: "center",
				}}
			>
				<Input.Group style={{ display: "flex", alignItems: "center" }}>
					<Typography style={{ marginRight: "2%" }}>
						Select From Date:
					</Typography>
					<DatePicker
						value={fromDate}
						onChange={(value) => setFromDate(value)}
						allowClear={false}
					/>
				</Input.Group>
				<Input.Group style={{ display: "flex", alignItems: "center" }}>
					<Typography style={{ marginRight: "2%" }}>
						Select To Date:
					</Typography>
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
