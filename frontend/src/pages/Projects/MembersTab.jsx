import { Table, Button, Modal, Select } from "antd";
import Title from "antd/lib/typography/Title";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { addAnnotatorsToProject } from "../../api/ProjectAPI";
import { memberColumns } from "./TasksTableContent";

export function MembersTab({ projectMembers }) {
	const [modalOpen, setModalOpen] = useState(false);
	const [addedUsers, setAddedUsers] = useState([]);
	const { project_id: projectId } = useParams();

	const addNewUsers = async () => {
		await addAnnotatorsToProject(projectId, addedUsers).then(() =>
			setAddedUsers([])
		);
		setModalOpen(false);
	};

	return (
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
					mode="tags"
					style={{ width: "100%", marginTop: "5%" }}
					onChange={(users) => setAddedUsers(users)}
					value={addedUsers}
				/>
			</Modal>
			<Table columns={memberColumns} dataSource={projectMembers} />
		</>
	);
}

MembersTab.propTypes = {
	projectMembers: PropTypes.array,
};
