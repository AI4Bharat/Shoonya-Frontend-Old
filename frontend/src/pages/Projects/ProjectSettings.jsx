import React, { useState, useEffect } from "react";
import { Button, Col, Form, Input, Row, Card,Space } from "antd";
import Title from "antd/lib/typography/Title";
import { useParams, useNavigate, Link } from "react-router-dom";
import useFullPageLoader from "../../hooks/useFullPageLoader";
import {
  addAnnotatorsToProject,
  publishProject,
  getProject,
  updateProject,
  exportProject,
  PullNewData,
  downloadProject,
} from "../../api/ProjectAPI";
import { CSVDownload } from "react-csv";

function ProjectSettings() {
  const { id } = useParams();
  let navigate = useNavigate();
  const { TextArea } = Input;

  const [basicSettingsForm] = Form.useForm();
   const [data, setData] = useState(true);
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
  const onFinishAddAnnotator = async (values) => {
    const emails = values.emails.split(",").map((email) => email.trim());

    await addAnnotatorsToProject(id, emails);
  };

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

    const onDownload =async (id) =>{

      let download =await downloadProject(id)
      console.log(download)
      setData( download.data)
    }
  

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
                  <Button type="primary" disabled={published} onClick={handlePublishProject}>
                    Publish Project
                  </Button>
                </div>
                <Title level={3}> Advanced Operation</Title>
                
                <div style={{ display: "flex" }}>
               
                  <Form.Item
                    wrapperCol={{ span: 16 }}
                    style={{ marginRight: "10px" }}
                  >
                   <Button type="primary"  onClick={() =>onExport(id)}>
                   Export Project into Dataset
                    </Button>
                  </Form.Item>
                  
                  <Button type="primary" onClick={()=>onPullData(id)}>
                  Pull New Data Items from Source Dataset
                  </Button>
               
                  <Form.Item
                    wrapperCol={{ span: 16 }}
                   >
                  <Button   style={{ marginLeft: "10px" }} type="primary"  onClick={()=>onDownload(id)}>
                  Download project
                  {data?.length &&
                   <CSVDownload
              filename={"Expense_Table.csv"}
              data={data}
              target="_blank"
            >
             
            </CSVDownload> 
}
                  </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Card>
        </Col>
        <Col span={1} />
      </Row>
      {loader}
    </>
  );
}

export default ProjectSettings;
