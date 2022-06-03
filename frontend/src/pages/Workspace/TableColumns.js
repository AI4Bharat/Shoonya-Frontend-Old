import React from "react";
import { Button, Tag } from "antd";

import { removeAnnotatorsFromWorkspace } from "../../api/WorkspaceAPI";
import {Link} from 'react-router-dom'

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
const getMemberColumns = (workspaceID, workspaceIsArchived) => [
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
        <Link to={`/profile/${item.id}`}>
          <Button type={"primary"} size="small" style={{ marginRight: "2%" }}>
            View
          </Button>
        </Link>
        <Button
          type={"default"}
          danger
          size="small"
          style={{ marginRight: "1%" }}
          disabled={workspaceIsArchived}
          onClick={async () => {
            await removeAnnotatorsFromWorkspace(workspaceID, [item.id]);
            location.reload();
          }}
        >
          Remove
        </Button>
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
    title: "Actions",
    dataIndex: "removeAction",
    render: (item) => (
      <>
        <Link to={`/profile/${item.userId}`}>
          <Button type={"primary"} size="small" style={{ marginRight: "2%" }}>
            View
          </Button>
        </Link>
        <Button
          disabled={item.isArchived}
          danger
          size="small"
          type="primary"
          onClick={item.handleClick}
        >
          Remove
        </Button>
      </>
    )
  }
]

export { projectColumns, getMemberColumns, managerColumns };
