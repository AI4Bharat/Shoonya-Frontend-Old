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

const reportResultsColumns = [
	{
		title: "Name",
		dataIndex: "username",
		key: "name",
	},
	{
		title: "Email",
		dataIndex: "mail",
		key: "email",
	},
	{
		title: "Skipped Tasks",
		dataIndex: "skipped_tasks",
		key: "skipped_tasks",
	},
	{
		title: "Annotated Tasks",
		dataIndex: "total_annoted_tasks",
		key: "total_annoted_tasks",
	},
	{
		title: "Assigned Tasks",
		dataIndex: "total_assigned_tasks",
		key: "total_assigned_tasks",
	},
	{
		title: "Pending Tasks",
		dataIndex: "total_pending_tasks",
		key: "total_pending_tasks",
	},
  {
    title: "Average Annotation Time",
    dataIndex: "avg_lead_time",
    key: "avg_lead_time"
  }
];

export { getColumnNames, getDataSource, getVariableParams, memberColumns, reportResultsColumns };
