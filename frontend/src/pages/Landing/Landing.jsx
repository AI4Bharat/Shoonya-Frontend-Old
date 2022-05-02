import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../context/User/UserContext";
import { Col, Row, Card, List, Divider, Tag, Table, Button } from "antd";
import { fetchProjects } from "../../api/ProjectAPI";
import Meta from "antd/lib/card/Meta";
import Title from "antd/lib/typography/Title";
import { SelectOutlined } from "@ant-design/icons";
import { fetchWorkspaces } from "../../api/WorkspaceAPI";
function Landing() {
  let userContext = useContext(UserContext);
  const [projects, setProject] = useState();
  const [workspaces, setWorkspaces] = useState();
  useEffect(() => {
    fetchProjects().then((res) => {
      setProject(res);
    });
    fetchWorkspaces().then((res) => {
      setWorkspaces(res.results);
    });
  }, [userContext.user]);

  return (
    <Row style={{ width: "100%", height: "100%" }}>
      <Col span={1} />
      <Col
        span={4}
        style={{ width: "100%", rowGap: "0px", marginBottom: "20px" }}
      >
        <Card>
          <h1>Welcome {userContext.user?.username}!</h1>
          <Divider />
          {userContext.user?.role === 3 && <Tag color="red">Admin</Tag>}
          {userContext.user?.role === 2 && <Tag color="blue">Manager</Tag>}
          {userContext.user?.role === 1 && <Tag color="green">Annotator</Tag>}
        </Card>
      </Col>
      <Col span={1} />
      <Col span={16}>
        <Title style={{ fontSize: "2.3rem" }} level={2}>
          {userContext.user?.organization.title}
          <a href={`/organization/${userContext.user?.organization.id}`}>
            <Button
              style={{ float: "right", color: "gray" }}
              icon={<SelectOutlined />}
              type="link"
            />
          </a>
        </Title>
        {projects && (
          <List
            grid={{ gutter: 24, column: 4 }}
            dataSource={projects}
            renderItem={(project) => (
              <a href={`projects/${project.id}`}>
                <Card style={{ margin: "1% 2%" }} key={project.title}>
                  <Meta
                    title={project.title}
                    description={project.project_mode + " Project"}
                  />
                  <Divider />
                  <p> {project.project_type}</p>
                </Card>
              </a>
            )}
          />
        )}

        <Divider />
<<<<<<< HEAD
        {(userContext.user?.role === 2 || userContext.user?.role === 3) && (
          <>
            <h1 style={{ fontSize: "1.5rem" }}>Visit Workspaces</h1>
            <Table
              dataSource={workspaces}
              columns={[
                {
                  title: "Name",
                  dataIndex: "workspace_name",
                  key: "workspace_name",
                },
                {
                  title: "Actions",
                  render: (item) => (
                    <>
                      <a href={`/workspace/${item.id}`}>
                        <Button type={"primary"} style={{ marginRight: "1%" }}>
                          View
                        </Button>
                      </a>
                    </>
                  ),
                },
              ]}
            />
          </>
        )}
=======
        <h1 style={{ fontSize: "1.5rem" }}>Visit Workspaces</h1>
        <Table
          dataSource={workspaces}
          pagination={{ pageSize: 5 }} 
          columns={[
            {
              title: "Name",
              dataIndex: "workspace_name",
              key: "workspace_name",
            },
            {
              title: "Actions",
              render: (item) => (
                <>
                  <a href={`/workspace/${item.id}`}>
                    <Button type={"primary"} style={{ marginRight: "1%" }}>
                      View
                    </Button>
                  </a>
                </>
              ),
            },
          ]}
        />
>>>>>>> 71abfa5bd867f6e066397874700c3d86d3598ea8
      </Col>
    </Row>
  );
}

export default Landing;
