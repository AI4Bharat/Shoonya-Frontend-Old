import { Avatar, Col, Row, Layout, Divider, Card, Tag, Button } from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SelectOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import UserContext from "../../context/User/UserContext";
import Paragraph from "antd/lib/typography/Paragraph";
import { fetchProfile } from "../../api/UserAPI";
function UserProfile() {
  let userContext = useContext(UserContext);
  const [isUser, setIsUser] = useState(false);
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    if (window.location.href.split("/")[4] === "me") {
      setIsUser(true);
      setUser(userContext.user);
    } else {
      fetchProfile(window.location.href.split("/")[4]).then((res) => {
        setUser(res)
      });
    }
  }, [userContext]);

  return (
    <Layout>
      <Content
        style={{
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
        }}
      >
        {user && (
          <Row style={{ width: "100%" }}>
            <Col span={1} />

            <Col
              span={4}
              style={{
                height: "80vh",
              }}
            >
              <Card>
                <div>
                  <Avatar
                    size={128}
                    icon={<UserOutlined />}
                    style={{ marginBottom: "1%", marginRight: "3%" }}
                  />
                  {isUser && (
                    <EditOutlined
                      style={{ float: "right", fontSize: "1.4rem" }}
                    />
                  )}
                </div>
                <Divider />
                <Title style={{ marginBottom: "0" }} level={2}>
                  {user.first_name + " " + user.last_name}{" "}
                </Title>
                <Paragraph style={{ fontSize: "1.2rem", color: "gray" }}>
                  AKA {user.username}
                </Paragraph>
                <Paragraph style={{ fontSize: "1.1rem" }}>
                  <MailOutlined /> {user.email}
                </Paragraph>
                <Paragraph style={{ fontSize: "1.1rem" }}>
                  <PhoneOutlined /> {user.phone}
                </Paragraph>
              </Card>
            </Col>
            <Col span={1} />
            <Col span={16}>
              <Card>
                <Divider
                  style={{ marginTop: "0", color: "gray" }}
                  orientation="left"
                  plain
                >
                  Organization
                </Divider>
                <Title level={2}>
                  Organization Name
                  <Button
                    style={{ float: "right", color: "gray" }}
                    icon={<SelectOutlined />}
                    type="link"
                  />
                </Title>
                <Tag color="red">Admin</Tag>
                <Tag color="blue">Manager</Tag>
                <Tag color="green">Annotator</Tag>
                <Divider style={{ color: "gray" }} orientation="left" plain>
                  Performance
                </Divider>
              </Card>
            </Col>
            <Col span={1} />
          </Row>
        )}
      </Content>
    </Layout>
  );
}

export default UserProfile;
