import React, { useContext, useEffect, useState } from "react";
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
import UserContext from "../../context/User/UserContext";


function ProjectDashboard() {
    const userContext = useContext(UserContext)
    let navigate = useNavigate();
    const { project_id } = useParams();
    const [project, setProject] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [variableParams, setVariableParams] = useState([]);
    const [isLoading, setLoading] = useState(true);

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
            getDataSource(tasks, project_id, project.project_mode, project.is_published).then(res => {
                setDataSource(res);
            });
        }
    }, [tasks]);

    useEffect(() => {
        if (dataSource) {
            getColumnNames(dataSource[0], project.project_mode, project.project_type).then(res => {
                for(let i =0;i<res.length;i++){
                    res[i].title = res[i].title.replaceAll('_', ' ');
                }
                setColumns(res);
            });
        }
        setLoading(false);
    }, [dataSource]);

    const labelAllTasks = async (project_id) => {
        try {
            let response = await axiosInstance.post(`/projects/${project_id}/next/`, {
              id: project_id
            })
            localStorage.setItem('labelAll', true);
            navigate(`/projects/${project_id}/task/${response.data.id}`);
          }
          catch {
            message.error("Error labelling all tasks.")
          }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

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
                        <Paragraph><b>Status: </b> {project.is_published ? "Published" : (project.is_archived ? "Archived" : "Draft")}</Paragraph>
                        <Paragraph>
                            <b>Variable Parameters: </b> {JSON.stringify(variableParams)}
                        </Paragraph>
                        {userContext.user.role !== 1 && <Button type="primary">
                            <Link to="settings">Show Project Settings</Link>
                        </Button>}
                        
                    </Card>
                    <br />
                    <Card style={{ width: "100%" }}>
                        <Row>
                            <Col span={21}>
                                <Title>Tasks</Title>
                            </Col>
                            <Col span={3}>
                                {project.project_mode == "Annotation" ? 
                                <Button onClick={e => { e.stopPropagation(); labelAllTasks(project_id)}} type="primary">Label All Tasks</Button>:
                                <Button type="primary"><Link to={`/add-collection-data/${project.id}`}>Add New Item</Link></Button>}
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