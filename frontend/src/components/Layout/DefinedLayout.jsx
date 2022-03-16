import React from "react";
import Layout, { Content } from "antd/lib/layout/layout";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function DefinedLayout() {
  return (
    <Layout style={{height:'100vh'}}>
      <Navbar />
      <Content
        style={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
}

export default DefinedLayout;
