import React, { useState, useEffect } from "react";
import { Button, Col, Form, Input, Row, Card } from "antd";
import Title from "antd/lib/typography/Title";
import { useParams, useNavigate, Link } from "react-router-dom";
import { snakeToTitleCase } from "../../utils/stringConversions";
import useFullPageLoader from "../../hooks/useFullPageLoader";
import {
  publishProject,
  getProject,
  updateProject,
  exportProject,
  PullNewData,
} from "../../api/ProjectAPI";

function ProjectSettings() {
  const { id } = useParams();
  let navigate = useNavigate();

  const [basicSettingsForm] = Form.useForm();

  const [isLoading, setLoading] = useState(true);
  const [project, setProject] = useState({});
  const [published, setPublished] = useState(false);
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const prefilBasicForm = () => {
    basicSettingsForm.setFieldsValue({
      title: project.title,
      description: project.description,
    });
  };

  useEffect(() => {
    getProject(id).then((res) => {
      setProject(res);
      setLoading(false);
    });
  }, []);

  const onExport = async (id)=>{
    showLoader();
    let projects =  await exportProject(id)
    hideLoader();
  }
   
    const onPullData = async () => {
      showLoader();
      await PullNewData(id);
      hideLoader();
    };
  

  const onEditProjectForm = async (values) => {
    showLoader();
    const { project_mode, project_type, users } = project;

    await updateProject(project.id, {
      ...values,
      project_mode,
      project_type,
      users,
    });
    hideLoader();
  };

  const handlePublishProject = async () => {
    showLoader();
    await publishProject(id);
    setPublished(true);
    hideLoader();
    navigate(`/projects/${id}`, { replace: true });
  };

  prefilBasicForm();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Row style={{ width: "100%", height: "100%" }}>
        <Col span={1} />
        <Col
          span={22}
          style={{ width: "100%", rowGap: "0px", marginBottom: "20px" }}
        >
          <Card>
            <Link to={`/projects/${id}`}>
              <Button style={{ marginBottom: "1%" }}>
                {"<"} Back to Project
              </Button>
            </Link>
            <Title>Project Settings</Title>
            <Title level={3}>Basic Settings</Title>
            <Form
              name="basic"
              layout="horizontal"
              onFinish={onEditProjectForm}
              autoComplete="on"
              initialValues={{ remember: true }}
              form={basicSettingsForm}
            >
              <Form.Item
                label="Project Name"
                name="title"
                rules={[
                  { required: true, message: "Please enter a project name!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Project Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please enter a project description!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Form>
            <Title level={3}>Advanced Operations</Title>
            <div style={{width:'50%', display:'flex', justifyContent:'space-between', marginBottom: '24px'}}>
              <Button type="primary" disabled={published} onClick={handlePublishProject}>
                Publish Project
              </Button>
              <Button type="primary"  onClick={() =>onExport(id)}>
                Export project
              </Button>
              <Button type="primary" onClick={()=>onPullData(id)}>
                Pull DataItems
              </Button> 
            </div>
            <Title level={3}>Read-only Configurations</Title>
            {project.sampling_mode && (
              <div>
                <Title level={4}>Sampling Parameters</Title>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="sampling-params">
                  <Col xs={12} md={8}>
                    <p>Sampling Mode:</p>
                  </Col>
                  <Col xs={12} md={16}>
                    <p>
                      {project.sampling_mode == "b" && "Batch"}
                      {project.sampling_mode == "r" && "Random"}
                      {project.sampling_mode == "f" && "Full"}
                    </p>
                  </Col>
                </Row>
                {Object.keys(project.sampling_parameters_json).map((key, i) => (
                  <Row key={i} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="sampling-params">
                    <Col xs={12} md={8}>
                      <p>{snakeToTitleCase(key)}:</p>
                    </Col>
                    <Col xs={12} md={16}>
                      <p>{project.sampling_parameters_json[key]}</p>
                    </Col>
                  </Row>
                ))}
              </div>
            )}
            {Object.keys(project.variable_parameters).length !==0 && (
              <div>
              <Title level={4}>Variable Parameters</Title>
              {Object.keys(project.variable_parameters).map((key, i) => (
                  <Row key={i} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="variable-params">
                    <Col xs={12} md={8}>
                      <p>{snakeToTitleCase(key)}:</p>
                    </Col>
                    <Col xs={12} md={16}>
                      <p>{project.variable_parameters[key]}</p>
                    </Col>
                  </Row>
                ))}
              </div>
            )}
          </Card>
        </Col>
        <Col span={1} />
      </Row>
      {loader}
    </>
  );
}

export default ProjectSettings;
