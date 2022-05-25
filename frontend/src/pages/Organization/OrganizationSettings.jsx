import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Button, Input, Layout, Divider, Checkbox } from "antd";
import { Content } from "antd/lib/layout/layout";
import { UserOutlined, DoubleRightOutlined } from "@ant-design/icons";

import axiosInstance from "../../utils/apiInstance";

export function OrganizationSettings({ organizationId }) {
	const [editOrg, setEditOrg] = useState({});
	const [newWorkspace, setNewWorkspace] = useState({
		workspace_name: "",
		is_archived: false,
	});

	const editOrganization = () => {
		axiosInstance
			.patch(`organizations/${organizationId}`, editOrg)
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const createNewWorkspace = () => {
		return null;
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
							onClick={() => editOrganization()}
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
							<Checkbox
								checked={newWorkspace.is_archived}
								onChange={(e) =>
									setNewWorkspace((prev) => ({
										...prev,
										is_archived: e.target.checked,
									}))
								}
							>
								Is Archived?
							</Checkbox>
						</Input.Group>
						<Button
							style={{
								width: "100%",
								marginTop: "1%",
							}}
							type="primary"
							onClick={() => createNewWorkspace()}
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
