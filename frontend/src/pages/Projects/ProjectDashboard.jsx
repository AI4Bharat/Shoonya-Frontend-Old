import React, { useEffect, useState } from "react";
import {
    Col,
    Row,
    Card,
    Table,
} from "antd";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import { useParams } from "react-router-dom";
import { getTasks } from "../../api/ProjectsDashboardAPI"
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
            getDataSource(tasks, project_id).then(res => {
                setDataSource(res);
            });
        }
    }, [tasks]);

    useEffect(() => {
        if (dataSource) {
            getColumnNames(dataSource[0]).then(res => {
                setColumns(res);
            });
        }
    }, [dataSource]);

    return (
        <>
            <Row style={{width: "100%"}}>
                <Col span={1} />
                <Col span={22}>
                    <Card style={{ width: "100%" }}>
                        <Title>{project.title}</Title>
                        <Paragraph><b>Project ID:</b> {project.id}</Paragraph>
                        <Paragraph><b>Description:</b> {project.description}</Paragraph>
                        <Paragraph><b>Project Type:</b> {project.project_mode} - {project.project_type}</Paragraph>
                        <Paragraph><b>Status: </b> {project.published ? "Published" : (project.archived ? "Archived" : "Not published or archived.")}</Paragraph>
                    </Card>
                    <Card style={{ width: "100%" }}>
                        <Title>Tasks</Title>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                        />
                    </Card>
                </Col>
                <Col span={1} />
            </Row>
        </>
    );
}

export default ProjectDashboard;