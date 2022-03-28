import Layout, { Content } from "antd/lib/layout/layout";
import React from "react";
import { Form, Input, Card, Divider, Button } from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../context/User/UserContext";
import { useNavigate } from "react-router-dom";
export const Login = () => {
  const userContext = useContext(UserContext);
  let navigate = useNavigate();

  const onFinish = (values) => {
    userContext.login(values).then(() => navigate("/profile/me"));
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
                // onClick={submit}
              >
                LOGIN
              </Button>
            </Form.Item>
          </Form>
          <Link to="/forget-password">Forgot Password?</Link>{" "}
        </Card>
      </Content>
    </Layout>
  );
};
