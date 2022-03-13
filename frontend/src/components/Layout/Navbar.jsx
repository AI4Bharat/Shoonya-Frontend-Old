import { Header } from "antd/lib/layout/layout";
import React from "react";
import { Dropdown, Menu, Button, Avatar } from "antd";
import Logo from "../../logo.svg";
import { UserOutlined } from "@ant-design/icons";
function Navbar() {
  return (
    <Header
      style={{
        height: "7%",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
      theme="light"
    >
      <img
        src={Logo}
        style={{ float: "left", height: "70%", verticalAlign: "middle" }}
      />
      <div
        style={{
          width: "20%",
          height: "100%",
          display: "flex",
          float: "right",
        }}
      >
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          style={{ height: "100%", width: "90%" }}
        >
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
        <Dropdown
          overlay={
            <Menu theme="light" mode="horizontal" defaultSelectedKeys={["2"]}>
              <Menu.Item key="1">nav 1</Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
          }
        >
          <Button
            style={{
              backgroundColor: "white",
              border: "0",
              height: "100%",
            }}
          >
            <Avatar icon={<UserOutlined />} size={50} />
          </Button>
        </Dropdown>
      </div>
    </Header>
  );
}

export default Navbar;
