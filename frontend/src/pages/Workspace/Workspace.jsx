import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Col,
  Row,
  Card,
  Tabs,
  Table,
  Button,
  Modal,
  Select,
  Input,
  Form,
} from "antd";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import UserContext from "../../context/User/UserContext";
import { fetchUsersInWorkspace,fetchWorkspaceData } from "../../api/WorkspaceAPI";
import { memberColumns, projectColumns } from "./TableColumns";
import FormItem from "antd/lib/form/FormItem";
import { createProject, fetchProjects } from "../../api/ProjectAPI";
import { useForm } from "antd/lib/form/Form";
const { TabPane } = Tabs;
const { Option } = Select;

function Workspace() {
  const {id} = useParams();
  const [projectForm] = useForm();
  const [workspace,setWorkspace]=useState(undefined);
  const [inviteData, setInviteData] = useState({ visible: false, users: [] });
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState({
    projects:[],
    visible: false,
  });
  const userContext = useContext(UserContext);

  const onCreateProject = (data) => {
    createProject({
        title: data.title,
        description: data.description,
        created_by: userContext.user.id,
        is_archived: true,
        is_published: true,
        users: users,
        workspace_id: id,
        organization_id: useContext.user.organization_id,
        filter_string: "string",
        sampling_mode: "r",
        sampling_parameters_json: {},
        project_type: 1,
        dataset_id: [
          0
        ],
    }).then(() => setProject({ ...project, visible: false }));
  };

  useEffect(() => {
    if (userContext.user) {
      fetchUsersInWorkspace(id).then((res) => {
        setUsers(res);
      });
      fetchProjects().then((res) => setProject({ ...project, projects: res }));
      fetchWorkspaceData(id).then((res) => setWorkspace(res));
    }
  }, [userContext]);

  return (
    <>
      <Row style={{ width: "100%" }}>
        <Col span={1} />
        <Col span={22} style={{ height: "80vh" }}>
          <Card>
            <Title>{workspace && workspace.workspace_name}</Title>
            <Paragraph>Created by: {workspace&&workspace.created_by.username}</Paragraph>
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
                {userContext.user?.role === 2 && (
                  <>
                    <Button
                      style={{ width: "100%", marginBottom: "1%" }}
                      onClick={() =>
                        setProject({ ...project, visible: true })
                      }
                      type="primary"
                    >
                      Add new Project
                    </Button>
                    <Modal
                      visible={project.visible}
                      onCancel={() =>
                        setProject({ ...project, visible: false })
                      }
                      onOk={() => projectForm.submit()}
                    >
                      <Title level={5}>Enter Project details</Title>
                      <Form
                        form={projectForm}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        onFinish={(data) => onCreateProject(data)}
                      >
                        <FormItem label="Project Title" name="title">
                          <Input />
                        </FormItem>
                        <FormItem label="Project Description" name="description">
                          <Input />
                        </FormItem>
                        <FormItem label="Users" name="users">
                          <Select mode="multiple" placeholder="Please Select">
                            {users.map((e) => {
                                return <Option key={e.id}>{e.username}</Option>;
                            })}
                          </Select>
                        </FormItem>
                      </Form>
                    </Modal>
                  </>
                )}

                <Table
                  columns={projectColumns}
                  dataSource={project.projects}
                />
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
                <Table
                  columns={memberColumns}
                  dataSource={users}
                />
              </TabPane>
              {userContext.user?.role === 3 && (
                <TabPane tab="Invites">
                  <Table
                    columns={memberColumns}
                    dataSource={users}
                  />
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
