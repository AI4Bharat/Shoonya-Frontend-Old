import Layout, { Content } from "antd/lib/layout/layout";
import React, { useState, useContext } from "react";
import { Form, Input, Card, Divider, Button, Result } from "antd";
import { UserOutlined } from "@ant-design/icons";
import UserContext from "../../context/UserContext";

export const ForgetPassword = () => {
  const userContext = useContext(UserContext);
  const [sentMail, setSentMail] = useState(false);
  const onFinish = (values) => {
    try {
      userContext.forgetPassword(values)
      setSentMail(true);
    } catch {
      setSentMail(false);
    }
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
        <Card bordered={false} style={{ width: "30%", marginBottom: "3%" }}>
          {sentMail ? (
            <>
              <Result
                status="success"
                title="Email has been sent with a new password."
              />
            </>
          ) : (
            <>
              <h1
                style={{
                  fontSize: "25px",
                  marginBottom: "0",
                  textAlign: "center",
                }}
              >
                Reset your password
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
                    placeholder={"Enter your Email ID."}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{ width: "100%", margin: "auto" }}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
        </Card>
      </Content>
    </Layout>
  );
};
