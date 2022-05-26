import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Button, Input, Layout, Divider, message } from "antd";
import { Content } from "antd/lib/layout/layout";
import { UserOutlined, DoubleRightOutlined } from "@ant-design/icons";

import { createWorkspace } from "../../api/WorkspaceAPI";
import { editOrganization } from "../../api/OrganizationAPI";

export function OrganizationSettings({ organizationId }) {
	const [editOrg, setEditOrg] = useState({ title: "" });
	const [newWorkspace, setNewWorkspace] = useState({
		workspace_name: "",
		is_archived: false,
	});

	const handleEditOrganization = async () => {
		await editOrganization(organizationId, editOrg).then((data) => {
			if (data) {
				message.success("Organization Name changed!");
			}
			setEditOrg({ title: "" });
		}).then(()=>{
			location.reload();
		})
	};

	const handleCreateNewWorkspace = async () => {
		const data = await createWorkspace({
			...newWorkspace,
			organization: organizationId,
		});

		if ("message" in data) {
			message.success(data.message);
		}
		setNewWorkspace({ workspace_name: "", is_archived: false });
	};

	return (
		<Card bordered={true} style={{ width: "100%", marginBottom: "3%" }}>
			<Layout>
				<Content
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
						<h1
							style={{
								fontSize: "25px",
								marginBottom: "0",
								textAlign: "center",
							}}
						>
							Edit Organization
						</h1>
						<Divider />
						<Input
							value={editOrg.title}
							onChange={(e) =>
								setEditOrg({
									...editOrg,
									title: e.target.value,
								})
							}
							size="default"
							placeholder="Organization Name"
							prefix={<UserOutlined />}
						/>
						<Button
							style={{
								width: "100%",
								marginTop: "1%",
							}}
							type="primary"
							onClick={() => handleEditOrganization()}
						>
							Change
						</Button>
					</Card>
					<Card
						bordered="false"
						style={{ width: "75%", marginBottom: "3%" }}
					>
						<h1
							style={{
								fontSize: "25px",
								marginBottom: "0",
								textAlign: "center",
							}}
						>
							Create New Workspace
						</h1>
						<Divider />
						<Input.Group>
							<Input
								value={newWorkspace.workspace_name}
								onChange={(e) =>
									setNewWorkspace((prev) => ({
										...prev,
										workspace_name: e.target.value,
									}))
								}
								size="default"
								placeholder="Workspace Name"
								prefix={<DoubleRightOutlined />}
							/>
						</Input.Group>
						<Button
							style={{
								width: "100%",
								marginTop: "1%",
							}}
							type="primary"
							onClick={() => handleCreateNewWorkspace()}
						>
							Create
						</Button>
					</Card>
				</Content>
			</Layout>
		</Card>
	);
}

OrganizationSettings.propTypes = {
	organizationId: PropTypes.number,
};
