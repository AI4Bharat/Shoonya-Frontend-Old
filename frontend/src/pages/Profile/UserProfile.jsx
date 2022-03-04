import { Avatar, Col, Row, Typography, Layout, Divider } from "antd";
import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
function UserProfile() {
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
            <Avatar size={80} icon={<UserOutlined />}  style={{marginBottom:'1%'}}/>
            <Title>User Name</Title>
            <Divider />
          </Col>
          <Col span={2} />
        </Row>
      </Content>
    </Layout>
  );
}

export default UserProfile;
