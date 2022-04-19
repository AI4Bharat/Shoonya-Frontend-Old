import React, { useEffect, useState, useContext } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { getTasks } from "../../api/ProjectDashboardAPI"
import { getProject } from "../../api/ProjectAPI"
import { getColumnNames, getDataSource, getVariableParams } from "./TasksTableContent"
import { message } from "antd";
import axiosInstance from "../../utils/apiInstance";
import LabelAllTaskContext from "../../context/TaskContext";


function ProjectDashboard() {

    let navigate = useNavigate();
    const { project_id } = useParams();
    const [project, setProject] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [variableParams, setVariableParams] = useState([]);

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
        if (project) {
            getVariableParams(project).then(res => {
                setVariableParams(res);
            })
        }
    }, [project]);

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

    const labelAllTasks = async (project_id) => {
        try {
            let response = await axiosInstance.post(`/projects/${project_id}/next/`, {
              id: project_id
            })
            navigate(`/projects/${project_id}/task/${response.data.id}`);
          }
          catch {
            message.error("Error labelling all tasks.")
          }
    }

    console.log(variableParams);

    return (
        <>
            <Row style={{width: "100%", maxHeight: "90vh"}}>
                <Col span={1} />
                <Col span={22}>
                    <Card style={{ width: "100%" }}>
                        <Title>{project.title}</Title>
                        <Paragraph><b>Project ID:</b> {project.id}</Paragraph>
                        <Paragraph><b>Description:</b> {project.description}</Paragraph>
                        <Paragraph><b>Project Type:</b> {project.project_mode} - {project.project_type}</Paragraph>
                        <Paragraph><b>Status: </b> {project.published ? "Published" : (project.archived ? "Archived" : "Draft")}</Paragraph>
                        <Paragraph>
                            <b>Variable Parameters: </b> {JSON.stringify(variableParams)}
                        </Paragraph>
                    </Card>
                    <br />
                    <Card style={{ width: "100%" }}>
                        <Row>
                            <Col span={21}>
                                <Title>Tasks</Title>
                            </Col>
                            <Col span={3}>
                                {project.project_mode == "Annotation" ? 
                                <LabelAllTaskContext.Provider value='labelAll'>
                                    <Button onClick={e => { e.stopPropagation(); labelAllTasks(project_id)}} type="primary">Label All Tasks</Button>
                                </LabelAllTaskContext.Provider> :
                                <Button type="primary">Add New Item</Button>}
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
        </>
    );
}

export default ProjectDashboard;