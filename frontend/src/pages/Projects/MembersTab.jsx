import { Table, Button, Modal, Select } from "antd";
import Title from "antd/lib/typography/Title";
import PropTypes from "prop-types";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

import {
	addAnnotatorsToProject,
	getProject,
	removeUserFromProject,
} from "../../api/ProjectAPI";
import { fetchUsersInWorkspace } from "../../api/WorkspaceAPI";
import UserContext from "../../context/User/UserContext";
import { memberColumns } from "./TasksTableContent";
import useFullPageLoader from "../../hooks/useFullPageLoader";

export function MembersTab({ project }) {
	const projectMembers = project?.users ?? [];
	const frozenUsers = project?.frozen_users ?? [];

	const [modalOpen, setModalOpen] = useState(false);
	const { project_id: projectId } = useParams();
	const userContext = useContext(UserContext);
	const [availableUsers, setAvailableUsers] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [loader, showLoader, hideLoader] = useFullPageLoader();

	const addNewUsers = async () => {
		showLoader();
		await addAnnotatorsToProject(projectId, selectedUsers).then((done) => {
			if (done) {
				setSelectedUsers([]);
				setModalOpen(false);
				hideLoader();
				location.reload();
			}
		});
		hideLoader();
	};

	useEffect(() => {
		showLoader();
		const populateAvailableUsers = async () => {
			const projectDetails = await getProject(projectId);
			if (!projectDetails || !projectDetails.workspace_id) {
				hideLoader();
				return;
			}

			const users = await fetchUsersInWorkspace(
				projectDetails.workspace_id
			);
			if (!users || !Array.isArray(users) || users.length === 0) {
				hideLoader();
				return;
			}

			let displayUsers = users;

			// filter out users which are already present in project
			if (Array.isArray(projectMembers) && projectMembers.length !== 0) {
				displayUsers = displayUsers.filter(
					(displayUser) =>
						projectMembers.findIndex(
							(projectUser) => displayUser.id === projectUser.id
						) === -1
				);
			}

			setAvailableUsers(displayUsers);
			hideLoader();
		};

		populateAvailableUsers();
	}, [projectId, setAvailableUsers]);

	const handleSelectChange = (userIds) => {
		setSelectedUsers(userIds);
	};

	const handleRemoveUserClick = async (email) => {
		showLoader();
		removeUserFromProject(projectId, email).then(result=>{
			if (result) {
				window.location.reload();
			} else {
				hideLoader();
			}
		});
	};

	const tableDataUsers = useMemo(() => {
		if (!projectMembers || !Array.isArray(projectMembers)) {
			return [];
		}

		return projectMembers.map((user) => ({
			id: user.id,
			username: user.username,
			email: user.email,
			role: user.role,
			removeAction: {
				isFrozen:
					frozenUsers.findIndex((frozen) => frozen.id === user.id) !==
					-1,
				userId: user.id,
				handleClick: () => handleRemoveUserClick(user.email),
			},
		}));
	}, [projectMembers]);

	return (
		<>
			{(userContext.user?.role === 2 || userContext.user?.role === 3) && (
				<>
					<Button
						style={{ width: "100%", marginBottom: "1%" }}
						type="primary"
						onClick={() => setModalOpen(true)}
					>
						Add Users to Project
					</Button>
					<Modal
						visible={modalOpen}
						onCancel={() => setModalOpen(false)}
						onOk={() => addNewUsers()}
					>
						<Title level={5}>Enter the emails to be added</Title>
						<Select
							mode="multiple"
							allowClear
							bordered
							placeholder="Select users to add"
							options={availableUsers.map((user) => ({
								label: user.username,
								value: user.id,
							}))}
							style={{ width: "100%", marginTop: "5%" }}
							onChange={handleSelectChange}
						/>
					</Modal>
				</>
			)}
			<Table columns={memberColumns} dataSource={tableDataUsers} />
			{loader}
		</>
	);
}

MembersTab.propTypes = {
	project: PropTypes.object,
};
