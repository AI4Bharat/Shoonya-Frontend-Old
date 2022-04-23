import React from "react";
import Layout, { Content } from "antd/lib/layout/layout";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function DefinedLayout() {
  return (
    <Layout style={{ height: "100vh", overflowY: "hidden" }}>
      <Navbar />
      <Content
        style={{
          minHeight: "calc(100vh - 7%)",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflowY: "auto",
          padding: "30px 0",
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
}

export default DefinedLayout;
