import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Button, Layout } from "antd";

import { archiveWorkspace, fetchWorkspaceData } from "../../api/WorkspaceAPI";

export function WorkspaceSettings({ workspaceId }) {
	const [workspaceDetais, setWorkspaceDetails] = useState(null);

	useEffect(() => {
		fetchWorkspaceData(workspaceId).then((data) => {
			if (data && "workspace_name" in data) {
				setWorkspaceDetails(data);
			}
		});
	}, [workspaceId, setWorkspaceDetails]);

	const handleArchiveWorkspaceClick = async () => {
		if (!workspaceDetais?.is_archived) {
			const result = await archiveWorkspace(workspaceId);
			if (result) {
				window.location.reload();
			}
		}
	};

	return (
		<Card bordered={true} style={{ width: "100%", marginBottom: "3%" }}>
			<Layout>
				<Layout.Content
					style={{
						justifyContent: "center",
						alignItems: "center",
						display: "flex",
						flexDirection: "column",
						paddingTop: "5%"
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
				</Layout.Content>
			</Layout>
		</Card>
	);
}

WorkspaceSettings.propTypes = {
	workspaceId: PropTypes.string,
};
