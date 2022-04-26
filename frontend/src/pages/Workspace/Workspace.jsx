import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Row, Card, Tabs, Table, Button, Modal, Select } from "antd";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import UserContext from "../../context/User/UserContext";
import {
  fetchUsersInWorkspace,
  fetchWorkspaceData,
} from "../../api/WorkspaceAPI";
import { memberColumns, projectColumns } from "./TableColumns";
import { fetchProjects } from "../../api/ProjectAPI";
const { TabPane } = Tabs;

function Workspace() {
  const { id } = useParams();
  let navigate = useNavigate();

  const [workspace, setWorkspace] = useState(undefined);
  const [inviteData, setInviteData] = useState({ visible: false, users: [] });
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
      fetchProjects().then((res) => {
        // console.log(res);

        setProject({ ...project, projects: res.results });
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
              Created by: {workspace && workspace.created_by.username}
            </Paragraph>
            <Paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Paragraph>
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

                <Table columns={projectColumns} dataSource={project.projects} />
              </TabPane>
              <TabPane tab="Members" key="2">
                <Button
                  style={{ width: "100%", marginBottom: "1%" }}
                  onClick={() =>
                    setInviteData({ ...inviteData, visible: true })
                  }
                  type="primary"
                >
                  Invite new members to workspace
                </Button>
                <Modal
                  visible={inviteData.visible}
                  onCancel={() =>
                    setInviteData({ ...inviteData, visible: false })
                  }
                  // //   onOk={() =>
                  //     inviteUsers(
                  //       inviteData.users,
                  //       userContext.user.organization.id
                  //     ).then(() =>
                  //       setInviteData({ ...inviteData, visible: false })
                  //     )
                  // //   }
                >
                  <Title level={5}>Enter emails to be invited</Title>
                  <Select
                    mode="tags"
                    style={{ width: "100%", marginTop: "5%" }}
                    onChange={(e) => setInviteData({ ...inviteData, users: e })}
                  />
                </Modal>
                <Table columns={memberColumns} dataSource={users} />
              </TabPane>
              {(userContext.user?.role === 3 ||
                userContext.user?.role === 2) && (
                <TabPane tab="Invites">
                  <Table columns={memberColumns} dataSource={users} />
                </TabPane>
              )}
              <TabPane tab="Settings" key="3"></TabPane>
            </Tabs>
          </Card>
        </Col>
        <Col span={1} />
      </Row>
    </>
  );
}

export default Workspace;
