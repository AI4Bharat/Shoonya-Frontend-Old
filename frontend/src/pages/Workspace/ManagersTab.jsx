import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Table, Button, Modal, Select, Typography, message } from "antd";

import {
	assignManager,
	fetchWorkspaceData,
	unAssignManagers,
} from "../../api/WorkspaceAPI";
import { fetchUsers } from "../../api/OrganizationAPI";
import { managerColumns } from "./TableColumns";

function AssignManagersModal({ workspaceDetais }) {
	const [modalOpen, setModalOpen] = useState(false);

	const [availableUsers, setAvailableUsers] = useState([]);
	const [newAssignedManager, setNewAssignedManager] = useState(null);

	useEffect(() => {
		if (!workspaceDetais || !("organization" in workspaceDetais)) return;

		fetchUsers(workspaceDetais.organization).then((users) => {
			if (users && Array.isArray(users)) {
				const filteredUsers = users.filter(
					(user) =>
						workspaceDetais.managers.findIndex(
							(manager) => manager.id === user.id
						) === -1
				);
				setAvailableUsers(filteredUsers);
			}
		});
	}, [setAvailableUsers, workspaceDetais]);

	const handleAssignClick = async () => {
		if (!newAssignedManager) {
			message.error("Please select manager to assign");
			return;
		}

		const result = await assignManager(
			workspaceDetais.id,
			newAssignedManager
		);
		if (result) {
			window.location.reload();
		}
	};

	return (
		<>
			<Button
				type="primary"
				style={{ width: "100%", marginBottom: "1%" }}
				onClick={() => setModalOpen(true)}
				disabled={workspaceDetais?.is_archived}
			>
				Assign Managers
			</Button>
			<Modal
				visible={modalOpen}
				onCancel={() => setModalOpen(false)}
				onOk={handleAssignClick}
			>
				<Typography.Title level={5}>Assign Manager</Typography.Title>
				<Select
					allowClear
					bordered
					placeholder="Select managers to assign"
					options={availableUsers.map((user) => ({
						label: user.username,
						value: user.username,
					}))}
					style={{ width: "100%", marginTop: "1%" }}
					onChange={(username) => setNewAssignedManager(username)}
				/>
			</Modal>
		</>
	);
}

export function ManagersTab({ workspaceId }) {
	const [workspaceDetais, setWorkspaceDetails] = useState(null);

	useEffect(() => {
		fetchWorkspaceData(workspaceId).then((data) => {
			if (data && "workspace_name" in data) {
				setWorkspaceDetails(data);
			}
		});
	}, [workspaceId, setWorkspaceDetails]);

	const handleUnassignClick = async (username) => {
		const result = await unAssignManagers(workspaceId, [username]);
		if (result) {
			window.location.reload();
		}
	};

	const tableData = useMemo(() => {
		if (!workspaceDetais || !Array.isArray(workspaceDetais.managers)) {
			return [];
		}

		return workspaceDetais.managers.map((user) => ({
			id: user.id,
			username: user.username,
			email: user.email,
			removeAction: {
				isArchived: workspaceDetais?.is_archived,
				handleClick: () => handleUnassignClick(user.username),
				userId: user.id
			},
		}));
	}, [workspaceDetais]);

	return (
		<>
			<AssignManagersModal workspaceDetais={workspaceDetais} />
			<Table columns={managerColumns} dataSource={tableData} />
		</>
	);
}

AssignManagersModal.propTypes = {
	workspaceDetais: PropTypes.object,
};

ManagersTab.propTypes = {
	workspaceId: PropTypes.string,
};
