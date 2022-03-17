import React, { useContext, useEffect, useState } from "react";
import { Col, Row, Card, Tabs, Table, Button, Modal, Select } from "antd";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import UserContext from "../../context/User/UserContext";
import { inviteUsers } from "../../api/OrganizationAPI";
const { TabPane } = Tabs;
function Organization() {
  const [organization, setOrganization] = useState(undefined);
  const [inviteData, setInviteData] = useState({ visible: false, users: [] });
  const userContext = useContext(UserContext);
  const workspaceColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Manager",
      dataIndex: "manager",
      key: "manager",
    },
    {
      title: "Created at",
      dataIndex: "created",
      key: "created",
    },
    {
      title: "Actions",
    },
  ];
  const memberColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Invited By",
      dataIndex: "inviter",
      key: "inviter",
    },
    {
      title: "Actions",
    },
  ];

  useEffect(() => {
    if (userContext.user) {
      setOrganization(userContext.user.organization);
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
                <Table columns={workspaceColumns} />
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
                  onOk={() => inviteUsers(inviteData.users,userContext.user.organization.id)}
                >
                  <Title level={5}>Enter emails to be invited</Title>
                  <Select
                    mode="tags"
                    style={{ width: "100%", marginTop: "5%" }}
                    onChange={(e) =>
                      setInviteData({ ...inviteData, users: e })
                    }
                  />
                </Modal>
                <Table columns={memberColumns} />
              </TabPane>
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
