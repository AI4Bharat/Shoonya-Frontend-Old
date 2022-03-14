import { Header } from "antd/lib/layout/layout";
import React, { useContext } from "react";
import { Dropdown, Menu, Button, Avatar } from "antd";
import Logo from "../../logo.svg";
import { UserOutlined } from "@ant-design/icons";
import UserContext from "../../context/User/UserContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
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
        alt="Logo"
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
          defaultSelectedKeys={["1"]}
          style={{ height: "100%", width: "90%" }}
        >
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
        <Dropdown
          overlay={
            <Menu theme="light" mode="horizontal">
              <Menu.Item key="1" onClick={() => navigate(`organization/${userContext.user.organization.id}`)}>My Organization</Menu.Item>
              <Menu.Item key="2">My Projects</Menu.Item>
              <Menu.Item
                key="3"
                onClick={() => {
                  userContext.logout();
                  navigate("/");
                }}
              >
                Logout
              </Menu.Item>
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
