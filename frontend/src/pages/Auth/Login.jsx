import Layout, { Content } from "antd/lib/layout/layout";
import React from "react";
import { Form, Input, Card, Divider, Button } from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/apiInstance";
import { login } from "../../utils/auth";

export const Login = () => {
  const [loginData, setLoginData] = React.useState({
    username: '',
    password: ''
  });
  const submit = (e) => {
    e.preventDefault();

    axiosInstance
      .post('users/auth/jwt/create', {
        username: loginData.username,
        password: loginData.password,
      })
      .then((res) => {
        login(res);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
  }
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
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
              />
            </Form.Item>
            <Form.Item name="password">
              <Input.Password
                size="large"
                className="cb"
                prefix={<KeyOutlined />}
                placeholder={"Enter your Password."}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ width: "100%", margin: "auto" }}
                className="cb"
                onClick={submit}
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
