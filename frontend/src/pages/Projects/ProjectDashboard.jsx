import React, { useEffect, useState } from "react";
import {
    Col,
    Row,
    Card,
    Table,
    Button
} from "antd";
import { Link } from "react-router-dom";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import { useParams } from "react-router-dom";
import { getTasks } from "../../api/ProjectDashboardAPI"
import { getProject } from "../../api/ProjectAPI"
import { getColumnNames, getDataSource } from "./TasksTableContent"

function ProjectDashboard() {

    const { project_id } = useParams();
    const [project, setProject] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        getProject(project_id).then(res => {
            setProject(res);
        });
    }, [project_id]);

    useEffect(() => {
        if (project_id) {
            getTasks(project_id).then(res => {
                setTasks(res);
            })
        }

    }, [project_id]);

    useEffect(() => {
        if (tasks) {
            getDataSource(tasks, project_id, project.project_mode).then(res => {
                setDataSource(res);
            });
        }
    }, [tasks]);

    useEffect(() => {
        if (dataSource) {
            getColumnNames(dataSource[0], project.project_mode).then(res => {
                setColumns(res);
            });
        }
    }, [dataSource]);

    return (
        <div>
            <Row style={{width: "100%", maxHeight: "90vh"}}>
                <Col span={1} />
                <Col span={22}>
                    <Card style={{ width: "100%" }}>
                        <Title>{project.title}</Title>
                        <Paragraph><b>Project ID:</b> {project.id}</Paragraph>
                        <Paragraph><b>Description:</b> {project.description}</Paragraph>
                        <Paragraph><b>Project Type:</b> {project.project_mode} - {project.project_type}</Paragraph>
                        <Paragraph><b>Status: </b> {project.published ? "Published" : (project.archived ? "Archived" : "Draft")}</Paragraph>
                    </Card>
                    <br />
                    <Card style={{ width: "100%" }}>
                        <Row>
                            <Col span={21}>
                                <Title>Tasks</Title>
                            </Col>
                            <Col span={3}>
                                <Link to={`/projects/${project_id}/tasks/new`}>
                                    {project.project_mode == "Annotation" ? <Button type="primary">Label All Tasks</Button> : <Button type="primary">Add New Item</Button>}
                                </Link>
                            </Col>
                        </Row>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                        />
                    </Card>
                </Col>
                <Col span={1} />
            </Row>
        </div>
    );
}

export default ProjectDashboard;