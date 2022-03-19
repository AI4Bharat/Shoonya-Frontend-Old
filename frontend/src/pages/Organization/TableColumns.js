import React from "react";
import { Button, Tag } from "antd";
const workspaceColumns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Manager",
    dataIndex: "manager",
    key: "manager",
  },
  {
    title: "Created at",
    dataIndex: "created",
    key: "created",
  },
  {
    title: "Actions",
  },
];
const memberColumns = [
  {
    title: "Name",
    dataIndex: "first_name",
    key: "name",
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
        <Button type={"default"}>Edit</Button>
      </>
    ),
  },
];

export { workspaceColumns, memberColumns };
