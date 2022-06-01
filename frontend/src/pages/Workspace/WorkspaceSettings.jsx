import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Button, Layout, Select, Typography, message } from "antd";

import { fetchWorkspaceData, unAssignManagers } from "../../api/WorkspaceAPI";

export function WorkspaceSettings({ workspaceId }) {
	const [currentManagers, setCurrentManagers] = useState([]);
	const [removeManagers, setRemoveManagers] = useState([]);

	useEffect(() => {
		fetchWorkspaceData(workspaceId).then((data) => {
			if (data && Array.isArray(data.managers)) {
				setCurrentManagers(data.managers);
			}
		});
	}, [setCurrentManagers]);

	const handleUnassignSelectChange = (usernames) => {
		setRemoveManagers(usernames);
	};

	const handleUnassignClick = async () => {
		if (removeManagers.length === 0) {
			message.error("Please select managers before removing");
			return;
		}

		const result = await unAssignManagers(workspaceId, removeManagers);
		if (result) {
			window.location.reload();
		}
	};

	return (
		<Card bordered={true} style={{ width: "100%", marginBottom: "3%" }}>
			<Layout>
				<Layout.Content
					style={{
						height: "100vh",
						justifyContent: "center",
						alignItems: "center",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<Card
						bordered="false"
						style={{ width: "75%", marginBottom: "3%" }}
					>
						<Button
							danger
							style={{
								width: "100%",
							}}
							type="primary"
							// onClick={() => {}}
						>
							Archive Workspace
						</Button>
					</Card>
					{currentManagers.length > 0 && (
						<Card
							bordered="false"
							style={{ width: "75%", marginBottom: "3%" }}
						>
							<Typography.Title level={5}>
								Unassign Managers
							</Typography.Title>
							<Select
								mode="multiple"
								allowClear
								bordered
								placeholder="Select managers to unassign"
								options={currentManagers.map((user) => ({
									label: user.username,
									value: user.username,
								}))}
								style={{ width: "100%", marginTop: "1%" }}
								onChange={handleUnassignSelectChange}
							/>
							<Button
								type="primary"
								style={{ marginTop: "1%" }}
								onClick={handleUnassignClick}
							>
								Unassign
							</Button>
						</Card>
					)}
				</Layout.Content>
			</Layout>
		</Card>
	);
}

WorkspaceSettings.propTypes = {
	workspaceId: PropTypes.string,
};
