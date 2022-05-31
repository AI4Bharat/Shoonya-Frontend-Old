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
import { MembersTab } from "./MembersTab";
const { TabPane } = Tabs;

function Workspace() {
  const { id } = useParams();
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
      fetchUsersInWorkspace(id).then((res) => {
        setUsers(res);
      });
      fetchWorkspaceProjects(id).then((res) => {
        setProject({ ...project, projects: res });
      });
      fetchWorkspaceData(id).then((res) => setWorkspace(res));
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
                            navigate(`/create-annotation-project/${id}`, {
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
                            navigate(`/create-collection-project/${id}`, {
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
                  <TabPane tab="Members" key="2">
                    <MembersTab workspaceMembers={users} orgId={workspace?.organization} workspaceId={workspace?.id} />
                  </TabPane>
                  {(userContext.user?.role === 3 ||
                    userContext.user?.role === 2) && (
                    <TabPane tab="Invites">
                      <Table columns={memberColumns} dataSource={users} />
                    </TabPane>
                  )}
                  <TabPane tab="Settings" key="3"></TabPane>
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
