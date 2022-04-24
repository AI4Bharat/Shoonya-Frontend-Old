import React from "react";
import Layout, { Content } from "antd/lib/layout/layout";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function DefinedLayout() {
  return (
    <Layout style={{height:'100vh'}}>
      <Navbar />
      <Content
        style={{paddingTop:'3%'
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
}

export default DefinedLayout;
