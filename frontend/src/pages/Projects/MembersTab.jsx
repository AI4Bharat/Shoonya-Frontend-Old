import { Table, Button, Modal, Select } from "antd";
import Title from "antd/lib/typography/Title";
import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";

import { addAnnotatorsToProject } from "../../api/ProjectAPI";
import UserContext from "../../context/User/UserContext";
import { memberColumns } from "./TasksTableContent";

export function MembersTab({ projectMembers }) {
	const [modalOpen, setModalOpen] = useState(false);
	const [addedUsers, setAddedUsers] = useState([]);
	const { project_id: projectId } = useParams();
	const userContext = useContext(UserContext);

	const addNewUsers = async () => {
		await addAnnotatorsToProject(projectId, addedUsers).then((done) => {
			if (done) {
				setAddedUsers([]);
				setModalOpen(false);
				location.reload();
			}
		});
	};

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
							mode="tags"
							style={{ width: "100%", marginTop: "5%" }}
							onChange={(users) => setAddedUsers(users)}
							value={addedUsers}
						/>
					</Modal>
				</>
			)}
			<Table columns={memberColumns} dataSource={projectMembers} />
		</>
	);
}

MembersTab.propTypes = {
	projectMembers: PropTypes.array,
};
