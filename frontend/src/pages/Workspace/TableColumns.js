import React from "react";
import { Button, Popconfirm, Tag } from "antd";
import { removeAnnotatorsFromWorkspace } from "../../api/WorkspaceAPI";
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
const getMemberColumns = (workspaceID) => [
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
          <Button type={"primary"} size="small" style={{ marginRight: "2%" }}>
            View
          </Button>
        </a>
        <Popconfirm
          title="Remove user from workspace?"
          okText="Remove"
          onConfirm={async () => {
            await removeAnnotatorsFromWorkspace(workspaceID, [item.id]);
            location.reload();
          }}
        >
          <Button
            type={"default"}
            danger
            size="small"
            style={{ marginRight: "1%" }}
          >
            Remove
          </Button>
        </Popconfirm>
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

export { projectColumns, getMemberColumns, managerColumns };
