import Layout, { Content } from "antd/lib/layout/layout";
import React, { useContext, useState } from "react";
import {
  Form,
  Input,
  Card,
  Divider,
  Button,
  Result,
  message,
} from "antd";
import {
  UserOutlined,
  KeyOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";

export const SignUp = () => {
  const [sentMail, setSentMail] = useState(false);
  const userContext = useContext(UserContext);
  const onFinish = (values) => {
    delete values.confirmPassword;
    userContext
      .register(values)
      .then(() => {
        setSentMail(true);
      })
      .catch(() => {
        message.error("Error while registering. Please try again in sometime.");
      });
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
        <Card style={{ width: "30%", marginBottom: "3%" }}>
          <h1
            style={{ fontSize: "25px", marginBottom: "0", textAlign: "center" }}
          >
            Create new account
          </h1>
          <Divider />
          {sentMail ? (
            <>
              <Result
                status="success"
                title="Email sent to your account. Please verify to activate."
              />
            </>
          ) : (
            <>
              <Form
                name="register"
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
                    prefix={<MailOutlined />}
                    placeholder={"Enter your Email ID."}
                    disabled={true}
                    defaultValue="test@test.com"
                  />
                </Form.Item>
                <Form.Item name="name">
                  <Input
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder={"Enter your name."}
                  />
                </Form.Item>

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
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
              <Divider />
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </>
          )}
        </Card>
      </Content>
    </Layout>
  );
};
