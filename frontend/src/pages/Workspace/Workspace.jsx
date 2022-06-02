import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Row, Card, Tabs, Table, Button, Modal, Select } from "antd";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import UserContext from "../../context/User/UserContext";
import {
  fetchUsersInWorkspace,
  fetchWorkspaceData,
  fetchWorkspaceProjects,
} from "../../api/WorkspaceAPI";
import { memberColumns, projectColumns } from "./TableColumns";
import { AnnotatorsTab } from "./AnnotatorsTab";
import {ManagersTab} from './ManagersTab'
import { WorkspaceSettings } from "./WorkspaceSettings";

const { TabPane } = Tabs;

function Workspace() {
  const { id: workspaceId } = useParams();
  let navigate = useNavigate();

  const [workspace, setWorkspace] = useState(undefined);
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState({
    projects: [],
    visible: false,
  });

  const userContext = useContext(UserContext);

  useEffect(() => {
    if (userContext.user) {
      fetchUsersInWorkspace(workspaceId).then((res) => {
        setUsers(res);
      });
      fetchWorkspaceProjects(workspaceId).then((res) => {
        setProject({ ...project, projects: res });
      });
      fetchWorkspaceData(workspaceId).then((res) => setWorkspace(res));
    }
  }, [userContext]);

  return (
    <>
      <Row style={{ width: "100%", height: "100%" }}>
        <Col span={1} />
        <Col
          span={22}
          style={{ width: "100%", rowGap: "0px", marginBottom: "20px" }}
        >
          <Card>
            <Title>{workspace && workspace.workspace_name}</Title>
            <Paragraph>
              Created by: {workspace && workspace.created_by?.username}
            </Paragraph>
            <Paragraph>{/* Put relevant text later */}</Paragraph>
            {(userContext.user?.role === 2 || userContext.user?.role === 3) && (
              <>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Projects" key="1">
                    {(userContext.user?.role === 2 ||
                      userContext.user?.role === 3) && (
                      <>
                        <Button
                          style={{
                            width: "48%",
                            marginRight: "4%",
                            marginBottom: "1%",
                          }}
                          onClick={() =>
                            navigate(`/create-annotation-project/${workspaceId}`, {
                              replace: true,
                            })
                          }
                          type="primary"
                        >
                          Add new Annotation Project
                        </Button>

                        <Button
                          style={{ width: "48%", marginBottom: "1%" }}
                          onClick={() =>
                            navigate(`/create-collection-project/${workspaceId}`, {
                              replace: true,
                            })
                          }
                          type="primary"
                        >
                          Add new Collection Project
                        </Button>
                      </>
                    )}

                    <Table
                      columns={projectColumns}
                      dataSource={project.projects}
                    />
                  </TabPane>
                  <TabPane tab="Annotators" key="2">
                    <AnnotatorsTab workspaceAnnotators={users} orgId={workspace?.organization} workspaceId={workspace?.id} />
                  </TabPane>
                  {(userContext.user?.role === 3 &&
                    <TabPane tab="Managers" key="3">
                       <ManagersTab workspaceId={workspaceId} />
                    </TabPane>
                  )}
                  {(userContext.user?.role === 3 &&
                    <TabPane tab="Settings" key="4">
                      <WorkspaceSettings workspaceId={workspaceId} organizationId={userContext.user?.organization?.id} />
                    </TabPane>
                  )}
                </Tabs>
              </>
            )}
          </Card>
        </Col>
        <Col span={1} />
      </Row>
    </>
  );
}

export default Workspace;
