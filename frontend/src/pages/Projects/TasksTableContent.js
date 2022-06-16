import React from "react";
import { Link } from "react-router-dom";
import { Button, Tag } from "antd";

const getColumnNames = async (data, project_mode, project_type) => {
  if (data) {
    let cols = Object.keys(data);
    if (cols.indexOf('ID') > 0) {
      cols.splice(cols.indexOf('ID'), 1);
      cols.unshift('ID');
    }
    let columns = [];
    cols.forEach((value) => {
      if (project_mode == "Collection" && value == "status") {
        return;
      }
      let el = {};
      el["ID"] = value;
      el["title"] = value[0].toUpperCase() + value.substring(1);
      el["dataIndex"] = value;
      columns.push(el);
    });
    return columns;
  }
};

const getDataSource = async (data, project_id, project_type, is_published) => {
  if (data) {
    data.forEach((value) => {
      value.data["ID"] = value.id;
      value.data["status"] = value.task_status;

      value.data["actions"] = (
        <Button type="primary">
          {/* {is_published === true ? ( */}
            <Link to={`/projects/${project_id}/task/${value.id}`}>
              {project_type === "Annotation" ? "Annotate this Task" : "Edit"}
            </Link>
          {/* ) : (
            "Disabled"
          )} */}
        </Button>
      );
    });
    const d = data.map((t) => t.data);
    return d;
  }
};

const getVariableParams = async (project) => {
  return project.variable_parameters;
};
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
    dataIndex: "removeAction",
    render: (item) => (
      <>
        <a href={`/profile/${item?.userId}`}>
          <Button type={"primary"} size="small" style={{ marginRight: "2%" }}>
            View
          </Button>
        </a>
        {
          item?.isFrozen ? (
            <Tag color="blue">Frozen</Tag>
          ) : (
            <Button onClick={item?.handleClick} danger size="small">
              Remove
            </Button>
          )
        }
      </>
    ),
  },
];

const reportResultsColumns = [
	{
		title: "Username",
		dataIndex: "Username",
		key: "Username",
    align: "center"
	},
	{
		title: "Email",
		dataIndex: "Email",
		key: "Email",
    align: "center"
	},
  {
    title: "Assigned Tasks",
    dataIndex: "Assigned Tasks",
    key: "Assigned Tasks",
    align: "center"
  },
  {
    title: "Pending Tasks",
    dataIndex: "Pending Tasks",
    key: "Pending Tasks",
    align: "center"
  },
  {
    title: "Annotated Tasks",
    dataIndex: "Annotated Tasks",
    key: "Annotated Tasks",
    align: "center"
  },
  {
    title: "Average Annotation Time (in seconds)",
    dataIndex: "Average Annotation Time",
    key: "Average Annotation Time",
    align: "center"
  },
	{
		title: "Skipped Tasks",
		dataIndex: "Skipped Tasks",
		key: "Skipped Tasks",
    align: "center"
	},
  {
      title: "Draft Tasks",
      dataIndex: "Draft Tasks",
      key: "Draft Tasks",
      align: "center"
  }
];

export { getColumnNames, getDataSource, getVariableParams, memberColumns, reportResultsColumns };
