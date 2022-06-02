import React from "react";
import { Button, Tag } from "antd";
const projectColumns = [
  {
    title: "Name",
    dataIndex: "title",
    key: "title",
  },
  // {
  //   title: "Users",
  //   dataIndex: "users",
  //   render: (user) => user.map((m) => m.username).join(", "),
  //   key: "users",
  // },
  {
    title: "Created by",
    dataIndex: ["created_by", "username"],
    key: "created",
  },
  {
    title: "Actions",
    render: (item) => (
      <>
        <a href={`/projects/${item.id}`}>
          <Button type={"primary"} style={{ marginRight: "1%" }}>
            View
          </Button>
        </a>
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
    title: "Actions",
    render: (item) => (
      <>
        <a href={`/profile/${item.id}`}>
          <Button type={"primary"} style={{ marginRight: "1%" }}>
            View
          </Button>
        </a>
      </>
    ),
  },
];

const managerColumns = [
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
    title: "Remove Manager",
    dataIndex: "removeAction",
    render: (item) => (
      <Button
        disabled={item.isArchived}
        danger
        type="primary"
        onClick={item.handleClick}
      >
        Remove
      </Button>
    )
  }
]

export { projectColumns, memberColumns, managerColumns };
