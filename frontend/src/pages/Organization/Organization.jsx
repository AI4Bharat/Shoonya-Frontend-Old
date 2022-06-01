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
} from "antd";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import UserContext from "../../context/User/UserContext";
import { fetchUsers, inviteUsers } from "../../api/OrganizationAPI";
import { memberColumns, workspaceColumns } from "./TableColumns";
import useFullPageLoader from "../../hooks/useFullPageLoader";
import { fetchWorkspaces } from "../../api/WorkspaceAPI";
import { OrganizationSettings } from "./OrganizationSettings";
import {AddNewWorkspace} from './AddNewWorkspace'

const { TabPane } = Tabs;
const { Option } = Select;

function Organization() {
  const { TextArea } = Input;
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

  useEffect(() => {
    if (userContext.user) {
      setOrganization(userContext.user.organization);
      fetchUsers(userContext.user.organization.id).then((res) => {
        if(res && Array.isArray(res)) {
          setUsers(res);
        }
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
                {userContext.user?.role === 3 && 
                <AddNewWorkspace organizationId={userContext.user?.organization.id}/>}
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
                    if (inviteData.users.length > 0) {
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
                    }
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
                  dataSource={Array.isArray(users) && users.filter((e) => {
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
                <OrganizationSettings organizationId={userContext.user?.organization.id} />
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
