import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Button, Layout, Select, Typography, message } from "antd";

import {
	archiveWorkspace,
	assignManager,
	fetchWorkspaceData,
	unAssignManagers,
} from "../../api/WorkspaceAPI";
import { fetchUsers } from "../../api/OrganizationAPI";

export function WorkspaceSettings({ workspaceId, organizationId }) {
	const [workspaceDetais, setWorkspaceDetails] = useState(null);

	const [availableUsers, setAvailableUsers] = useState([]);
	const [newAssignedManager, setNewAssignedManager] = useState(null);

	const [currentManagers, setCurrentManagers] = useState([]);
	const [removeManagers, setRemoveManagers] = useState([]);

	useEffect(() => {
		fetchWorkspaceData(workspaceId).then((data) => {
			if (data && "workspace_name" in data) {
				setWorkspaceDetails(data);
			}
		});
	}, [workspaceId, setWorkspaceDetails]);

	useEffect(() => {
		if (!organizationId) return;

		fetchUsers(organizationId).then((users) => {
			if (users && Array.isArray(users)) {
				setAvailableUsers(users);
			}
		});
	}, [organizationId, setAvailableUsers]);

	useEffect(() => {
		if (workspaceDetais && Array.isArray(workspaceDetais.managers)) {
			setCurrentManagers(workspaceDetais.managers);
		}
	}, [workspaceDetais, setCurrentManagers]);

	// filter managers from being displayed in assign managers
	useEffect(() => {
		setAvailableUsers((users) =>
			users.filter(
				(user) =>
					currentManagers.findIndex(
						(manager) => manager.id === user.id
					) === -1
			)
		);
	}, [currentManagers, setAvailableUsers]);

	const handleArchiveWorkspaceClick = async () => {
		if (!workspaceDetais?.is_archived) {
			const result = await archiveWorkspace(workspaceId);
			if (result) {
				window.location.reload();
			}
		}
	};

	const handleAssignSelectChange = (username) => {
		setNewAssignedManager(username);
	};

	const handleUnassignSelectChange = (usernames) => {
		setRemoveManagers(usernames);
	};

	const handleAssignClick = async () => {
		if (!newAssignedManager) {
			message.error("Please select manager to assign");
			return;
		}

		const result = await assignManager(workspaceId, newAssignedManager);
		if (result) {
			window.location.reload();
		}
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
							disabled={workspaceDetais?.is_archived}
							onClick={handleArchiveWorkspaceClick}
						>
							Archive Workspace
						</Button>
					</Card>
					{availableUsers.length > 0 && (
						<Card
							bordered="false"
							style={{ width: "75%", marginBottom: "3%" }}
						>
							<Typography.Title level={5}>
								Assign Manager
							</Typography.Title>
							<Select
								allowClear
								bordered
								placeholder="Select managers to assign"
								options={availableUsers.map((user) => ({
									label: user.username,
									value: user.username,
								}))}
								style={{ width: "100%", marginTop: "1%" }}
								onChange={handleAssignSelectChange}
							/>
							<Button
								type="primary"
								style={{ marginTop: "1%" }}
								onClick={handleAssignClick}
							>
								Assign
							</Button>
						</Card>
					)}
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
	organizationId: PropTypes.number,
};
