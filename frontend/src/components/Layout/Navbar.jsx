import { Header } from "antd/lib/layout/layout";
import React, { useContext } from "react";
import { Dropdown, Menu, Button, Avatar } from "antd";
import Logo from "../../logo.svg";
import { UserOutlined } from "@ant-design/icons";
import UserContext from "../../context/User/UserContext";
import { Link } from "react-router-dom";

function Navbar() {
  const userContext = useContext(UserContext);
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
          width: "15%",
          height: "100%",
          display: "flex",
          float: "right",
        }}
      >
        <Menu
          theme="light"
          mode="horizontal"
          style={{ height: "100%", width: "50%" }}
        >
          <Menu.Item key="1">
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
        </Menu>
        {userContext.user && (
          <Dropdown
            overlay={
              <Menu theme="light" mode="horizontal">
                <Menu.Item key="1">
                  <Link
                    to={`/organization/${userContext.user.organization.id}`}
                  >
                    My Organization
                  </Link>
                </Menu.Item>
                <Menu.Item key="3" onClick={() => userContext.logout()}>
                  <Link to="/">Logout</Link>
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
        )}
      </div>
    </Header>
  );
}

export default Navbar;
