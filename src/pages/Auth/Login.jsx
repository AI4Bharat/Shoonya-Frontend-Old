import Layout, { Content } from "antd/lib/layout/layout";
import React from "react";
import { Row, Col, Form, Input, Card, Divider, Button } from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";

export const Login = () => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  return (
    <Layout>
      <Content
        style={{
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <Card
          className="bs"
          bordered={false}
          style={{ width: "30%", marginBottom: "3%" }}
        >
          <h1
            style={{
              fontSize: "25px",
              marginBottom: "0",
              textAlign: "center",
            }}
          >
            Login
          </h1>
          <Divider />
          <Form
            name="enquiry"
            onFinish={onFinish}
            scrollToFirstError
            style={{ textAlign: "left" }}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                className="cb"
                placeholder={"Enter your Email ID."}
              />
            </Form.Item>
            <Form.Item name="password">
              <Input.Password
                size="large"
                className="cb"
                prefix={<KeyOutlined />}
                placeholder={"Enter your Password."}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ width: "100%", margin: "auto" }}
                className="cb"
              >
                LOGIN
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};
