import React from "react";
import { Button, Tag } from "antd";
const workspaceColumns = [
  {
    title: "Name",
    dataIndex: "workspace_name",
    key: "name",
  },
  {
    title: "Manager",
    dataIndex: "managers",
    render: (managers) => managers.map((m) => m.username).join(", "),
    key: "managers",
  },
  {
    title: "Created by",
    dataIndex: ["created_by","username"],
    key: "created",
  },
  {
    title: "Actions",
    render: () => (
      <>
        <Button type={"primary"} style={{ marginRight: "1%" }}>
          View
        </Button>
      </>
    ),
  },
];
const memberColumns = [
  {
    title: "Name",
    dataIndex: "username",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (role) => (
      <>
        {role === 3 && <Tag color="red">Admin</Tag>}
        {role === 2 && <Tag color="blue">Manager</Tag>}
        {role === 1 && <Tag color="green">Annotator</Tag>}
      </>
    ),
  },
  {
    title: "Invited By",
    dataIndex: "inviter",
    key: "inviter",
  },
  {
    title: "Actions",
    render: () => (
      <>
        <Button type={"primary"} style={{ marginRight: "1%" }}>
          View
        </Button>
      </>
    ),
  },
];

export { workspaceColumns, memberColumns };
