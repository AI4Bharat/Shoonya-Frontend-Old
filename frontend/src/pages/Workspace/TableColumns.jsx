import React from "react";
import { Button, Tag } from "antd";
const projectColumns = [
  {
    title: "Name",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Users",
    dataIndex: "users",
    render: (user) => user.map((m) => m.username).join(", "),
    key: "users",
  },
  {
    title: "Created by",
    dataIndex: ["created_by", "username"],
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
    render: (item) => (
      <>
        <Button type={"primary"} style={{ marginRight: "1%" }}>
          View {console.log(item)}
        </Button>
      </>
    ),
  },
];

export { projectColumns, memberColumns };
