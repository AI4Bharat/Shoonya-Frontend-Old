import React, { useState, useEffect } from "react";
import { Button, Col, Form, Input, Row, Card } from "antd";
import Title from "antd/lib/typography/Title";
import { useParams, useNavigate } from "react-router-dom";
import {
  addAnnotatorsToProject,
  publishProject,
  getProject,
  updateProject,
} from "../../api/ProjectAPI";

function ProjectSettings() {
  const { id } = useParams();
  let navigate = useNavigate();
  const { TextArea } = Input;

  const [basicSettingsForm] = Form.useForm();

  const [isLoading, setLoading] = useState(true);
  const [project, setProject] = useState({});

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

  const onFinishAddAnnotator = async (values) => {
    const emails = values.emails.split(", ");

    await addAnnotatorsToProject(id, emails);
  };

  const onEditProjectForm = async (values) => {
    await updateProject(project.id, values);
  };

  const handlePublishProject = async () => {
    await publishProject(id);
    navigate(`/projects/${id}`, { replace: true });
  };

  prefilBasicForm();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Row style={{ width: "100%" }}>
        <Col span={1} />
        <Col span={22}>
          <Card>
            <Title>Project Settings</Title>
          </Card>

          <Card>
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
          </Card>

          <Card span={22} style={{ height: "80vh" }}>
            <Title level={3}>Add Annotators To The Project</Title>
            <Form
              name="basic"
              layout="vertical"
              onFinish={onFinishAddAnnotator}
              autoComplete="off"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  width: "100%",
                }}
              >
                <Form.Item
                  label="Emails"
                  name="emails"
                  rules={[
                    {
                      message: "Please enter annotator email",
                    },
                  ]}
                  className="full-textarea"
                  required="true"
                >
                  <TextArea
                    rows={4}
                    placeholder="Enter emails of Annotators separated by commas(,)"
                  />
                </Form.Item>

                <div style={{ display: "flex" }}>
                  <Form.Item
                    wrapperCol={{ span: 16 }}
                    style={{ marginRight: "10px" }}
                  >
                    <Button type="primary" htmlType="submit">
                      Add Annotators
                    </Button>
                  </Form.Item>
                  <Button type="primary" onClick={handlePublishProject}>
                    Publish Project
                  </Button>
                </div>
              </div>
            </Form>
          </Card>
        </Col>
        <Col span={1} />
      </Row>
    </>
  );
}

export default ProjectSettings;
