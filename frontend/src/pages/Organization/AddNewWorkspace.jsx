import React, { useState } from "react";
import propTypes from "prop-types";
import { Button, Modal, Input } from "antd";
import Title from "antd/lib/typography/Title";

import { createWorkspace } from "../../api/WorkspaceAPI";

export function AddNewWorkspace({ organizationId }) {
	const [modalOpen, setModalOpen] = useState(false);
	const [workspaceName, setWorkspaceName] = useState("");

	const handleCreateWorkspace = () => {
		const santizedWorkspaceName = workspaceName.trim();
		if (santizedWorkspaceName.length === 0) {
			return;
		}

		createWorkspace({
			organization: organizationId,
			workspace_name: santizedWorkspaceName,
			is_archived: false,
		}).then((result) => {
			if (result) {
                setModalOpen(false);
				window.location.reload();
			}
		});
	};

	return (
		<>
			<Button
				style={{ width: "100%", marginBottom: "1%" }}
				onClick={() => setModalOpen(true)}
				type="primary"
			>
				Add new workspace
			</Button>
			<Modal
				visible={modalOpen}
				onCancel={() => setModalOpen(false)}
				onOk={() => handleCreateWorkspace()}
			>
				<Title level={5}>Enter workspace details</Title>
				<Input.Group compact>
					<Input
						style={{ width: "100%" }}
						placeholder="Enter workspace name"
						value={workspaceName}
						onChange={(e) => setWorkspaceName(e.target.value)}
					/>
				</Input.Group>
			</Modal>
		</>
	);
}

AddNewWorkspace.propTypes = {
	organizationId: propTypes.number,
};
