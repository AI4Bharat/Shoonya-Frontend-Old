import React, { useContext, useEffect, useState } from "react";
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
import { fetchUsers, inviteUsers } from "../../api/OrganizationAPI";
import { memberColumns, workspaceColumns } from "./TableColumns";
import FormItem from "antd/lib/form/FormItem";
import { createWorkspace, fetchWorkspaces } from "../../api/WorkspaceAPI";
import { useForm } from "antd/lib/form/Form";
const { TabPane } = Tabs;
const { Option } = Select;

function Organization() {
  const [workspaceForm] = useForm();
  const [organization, setOrganization] = useState(undefined);
  const [inviteData, setInviteData] = useState({
    visible: false,
    users: [],
    role: 0,
  });
  const [users, setUsers] = useState([]);
  const [workspace, setWorkspace] = useState({
    workspaces: [],
    visible: false,
  });
  const userContext = useContext(UserContext);

  const onCreateWorkspace = (data) => {
    createWorkspace({
      organization: userContext.user.organization.id,
      workspace_name: data.workspace_name,
      managers: data.managers,
      created_by: userContext.user.id,
    }).then(() => setWorkspace({ ...workspace, visible: false }));
  };

  useEffect(() => {
    if (userContext.user) {
      setOrganization(userContext.user.organization);
      fetchUsers(userContext.user.organization.id).then((res) => {
        setUsers(res);
      });
      fetchWorkspaces().then((res) => {
        setWorkspace({ ...workspace, workspaces: res });
      });
    }
  }, [userContext]);

  return (
    <>
      <Row style={{ width: "100%" }}>
        <Col span={1} />
        <Col span={22} style={{ height: "80vh" }}>
          <Card>
            <Title>{organization && organization.title}</Title>
            <Paragraph>Created by: Admin Name</Paragraph>
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
              <TabPane tab="Workspaces" key="1">
                {userContext.user?.role === 1 &&
                  userContext.user?.role === 2 &&
                  userContext.user?.role === 3 && (
                    <>
                      <Button
                        style={{ width: "100%", marginBottom: "1%" }}
                        onClick={() =>
                          setWorkspace({ ...workspace, visible: true })
                        }
                        type="primary"
                      >
                        Add new workspace
                      </Button>
                      <Modal
                        visible={workspace.visible}
                        onCancel={() =>
                          setWorkspace({ ...workspace, visible: false })
                        }
                        onOk={() => workspaceForm.submit()}
                      >
                        <Title level={5}>Enter workspace details</Title>
                        <Form
                          form={workspaceForm}
                          labelCol={{ span: 4 }}
                          wrapperCol={{ span: 14 }}
                          onFinish={(data) => onCreateWorkspace(data)}
                        >
                          <FormItem
                            label="Workspace Name"
                            name="workspace_name"
                          >
                            <Input />
                          </FormItem>
                          <FormItem label="Managers" name="managers">
                            <Select mode="multiple" placeholder="Please Select">
                              {users.map((e) => {
                                if (e.role === 2) {
                                  return (
                                    <Option key={e.id}>{e.username}</Option>
                                  );
                                }
                              })}
                            </Select>
                          </FormItem>
                        </Form>
                      </Modal>
                    </>
                  )}

                <Table
                  columns={workspaceColumns}
                  dataSource={workspace.workspaces?.results}
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
                  Invite new members to organization
                </Button>
                <Modal
                  visible={inviteData.visible}
                  onCancel={() =>
                    setInviteData({ ...inviteData, visible: false })
                  }
                  onOk={() =>
                    inviteUsers(
                      inviteData.users,
                      userContext.user.organization.id,
                      inviteData.role
                    ).then(() =>
                      setInviteData({ ...inviteData, visible: false })
                    )
                  }
                >
                  <Title level={2}>Invite Users</Title>
                  <Select
                    placeholder="Please enter email IDs to be invited"
                    mode="tags"
                    style={{ width: "100%", marginTop: "5%" }}
                    onChange={(e) => setInviteData({ ...inviteData, users: e })}
                  />
                  <Select
                    placeholder="Please select a role for all the mentioned users"
                    style={{ width: "100%", marginTop: "5%" }}
                    onChange={(e) => setInviteData({ ...inviteData, role: e })}
                  >
                    <Option value={1}>Annotator</Option>
                    <Option value={2}>Manager</Option>
                    <Option value={3}>Admin</Option>
                  </Select>
                </Modal>
                <Table
                  columns={memberColumns}
                  dataSource={users?.filter((e) => {
                    return e.has_accepted_invite == true;
                  })}
                />
              </TabPane>
              {userContext.user?.role === 3 && userContext.user?.role === 2 && (
                <TabPane tab="Invites">
                  <Table
                    columns={memberColumns}
                    dataSource={users?.filter((e) => {
                      return e.has_accepted_invite == false;
                    })}
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

export default Organization;
