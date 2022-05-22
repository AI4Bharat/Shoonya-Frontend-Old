import Layout, { Content } from "antd/lib/layout/layout";
import React from "react";
import { Form, Input, Card, Divider, Button, message } from "antd";
import {  KeyOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../context/User/UserContext";

export const ConfirmForgetPassword = () => {
  const { key, token } = useParams();
  const userContext = useContext(UserContext);
  const onFinish = (values) => {
    delete values.confirmPassword;
    userContext
      .confirmForgetPassword({ formData: values, key: key, token: token })
      .then(() => {window.location.pathname = "/login"})
      .catch((err) => {message.error("Error changing password!")});
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
          <h1
            style={{
              fontSize: "25px",
              marginBottom: "0",
              textAlign: "center",
            }}
          >
            Confirm Forgot Password
          </h1>
          <Divider />
          <Form
            name="enquiry"
            onFinish={onFinish}
            scrollToFirstError
            style={{ textAlign: "left" }}
          >
            <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    size="large"
                    prefix={<KeyOutlined />}
                    placeholder={"Enter your Password."}
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          "The two passwords that you entered do not match!"
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={<KeyOutlined />}
                    placeholder={"Re-enter your Password."}
                  />
                </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ width: "100%", margin: "auto" }}
                className="cb"
                onClick={onFinish}
              >
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};
