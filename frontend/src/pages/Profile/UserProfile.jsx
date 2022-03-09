import { Avatar, Col, Row, Layout, Divider } from "antd";
import React, { useContext, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import UserContext from "../../context/UserContext";
function UserProfile() {
  let userContext = useContext(UserContext);
  useEffect(() => {
    console.log(userContext.user);
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
        <Row style={{ width: "100%" }}>
          <Col span={2} />
          <Col
            span={20}
            style={{
              height: "100vh",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Avatar
              size={80}
              icon={<UserOutlined />}
              style={{ marginBottom: "1%" }}
            />
            <Title>{userContext.user && userContext.user.username}</Title>
            <Divider />
          </Col>
          <Col span={2} />
        </Row>
      </Content>
    </Layout>
  );
}

export default UserProfile;
