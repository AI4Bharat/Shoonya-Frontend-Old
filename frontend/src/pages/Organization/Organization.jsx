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
  Layout,
  Divider,
} from "antd";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import UserContext from "../../context/User/UserContext";
import { fetchUsers, inviteUsers } from "../../api/OrganizationAPI";
import { memberColumns, workspaceColumns } from "./TableColumns";
import FormItem from "antd/lib/form/FormItem";
import { createWorkspace, fetchWorkspaces } from "../../api/WorkspaceAPI";
import { useForm } from "antd/lib/form/Form";
import { Content } from "antd/lib/layout/layout";
import { UserOutlined } from '@ant-design/icons';
import axiosInstance from "../../utils/apiInstance";
import useFullPageLoader from "../../hooks/useFullPageLoader";
const { TabPane } = Tabs;
const { Option } = Select;

function Organization() {
  const { TextArea } = Input;
  const [workspaceForm] = useForm();
  const [editOrg, setEditOrg] = useState({});
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
  const [pagination, setPagination] = useState({});
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  function handleTableChange() {
    fetchWorkspaces(pagination.current).then((res) => {
      pagination.next = res.next;
      setPagination(pagination);
      setWorkspace({ ...workspace, workspaces: res });
    })
  }

  const onCreateWorkspace = (data) => {
    createWorkspace({
      organization: userContext.user.organization.id,
      workspace_name: data.workspace_name,
      managers: data.managers,
      created_by: userContext.user.id,
    }).then(() => {
      setWorkspace({ ...workspace, visible: false });
    });
  };

  const editOrganization = () => {
    axiosInstance.patch(`organizations/${userContext.user.organization.id}`, editOrg)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (userContext.user) {
      setOrganization(userContext.user.organization);
      fetchUsers(userContext.user.organization.id).then((res) => {
        setUsers(res);
      });
      fetchWorkspaces(1).then((res) => {
        pagination.total = res.count;
        pagination.next = res.next;
        setPagination(pagination);
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
            <Paragraph>Created by: {organization?.created_by.first_name + " " + organization?.created_by.last_name}</Paragraph>
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
                  pagination={{
                    total: pagination.total,
                    onChange: (page) => { pagination.current = page }
                  }}
                  onChange={handleTableChange}
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
                  onOk={() => {
                    showLoader();
                    const emails = inviteData.users
                      .split(",")
                      .map((email) => email.trim());

                    inviteUsers(
                      emails,
                      userContext.user.organization.id,
                      inviteData.role
                    ).then(() =>{
                      setInviteData({ ...inviteData, visible: false })
                      hideLoader();
                    });
                  }}
                >
                  <Title level={2}>Invite Users</Title>
                  <TextArea
                    rows={1}
                    placeholder="Enter emails of Annotators separated by commas(,)"
                    className="email-textarea"
                    onChange={(e) => {
                      setInviteData({
                        ...inviteData,
                        users: e.target.value,
                      });
                    }}
                  />

                  <Select
                    placeholder="Please select a role for all the mentioned users"
                    style={{ width: "100%", marginTop: "5%" }}
                    onChange={(e) => setInviteData({ ...inviteData, role: e })}
                    rules={{ required: true, message: "Please select role for users!" }}
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
              {(userContext.user?.role === 3 || userContext.user?.role === 2) && (
                <TabPane tab="Invites">
                  <Table
                    columns={memberColumns}
                    dataSource={users?.filter((e) => {
                      return e.has_accepted_invite == false;
                    })}
                  />
                </TabPane>
              )}
              <TabPane tab="Settings" key="3">
                <Card bordered={true} style={{ width: "100%", marginBottom: "3%" }}>
                  <Layout>
                    <Content
                      style={{
                        height: "100vh",
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}>
                        <Card bordered="false" style={{ width: "75%", marginBottom: "3%" }}>
                          <h1
                            style={{
                              fontSize: "25px",
                              marginBottom: "0",
                              textAlign: "center",
                            }}>
                              Edit Organization
                            </h1>
                          <Divider/>
                          <Input onChange={(e) => setEditOrg({...editOrg, title: e.target.value})} size="default" placeholder="Organization Name" prefix={<UserOutlined />} />
                          <Button
                            style={{
                              width: "100%", 
                              marginTop: "1%"
                            }}
                            type="primary"
                            onClick={editOrganization}
                          >
                            Change
                          </Button>
                        </Card>
                      </Content>
                  </Layout>
                </Card>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
        <Col span={1} />
      </Row>
      {loader}
    </>
  );
}

export default Organization;
