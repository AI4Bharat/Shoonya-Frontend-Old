import React, { useState, useEffect } from "react";
import { Button, Col, Form, Input, Row, Card, Modal } from "antd";
import Title from "antd/lib/typography/Title";
import { useParams, useNavigate, Link } from "react-router-dom";
import useFullPageLoader from "../../hooks/useFullPageLoader";
import {
  publishProject,
  getProject,
  updateProject,
  exportProject,
  PullNewData,
  downloadProject,
  archiveProject,
} from "../../api/ProjectAPI";
import { CSVDownload } from "react-csv";
import { Select } from 'antd';
import { snakeToTitleCase } from "../../utils/stringConversions";


function ProjectSettings() {
  const { id } = useParams();
  let navigate = useNavigate();
  const { Option } = Select;
  const [basicSettingsForm] = Form.useForm();
  const [data, setData] = useState(true);
  const [project, setProject] = useState({});
  const [published, setPublished] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [options, setOptions] = useState("CSV");

  const prefilBasicForm = () => {
    basicSettingsForm.setFieldsValue({
      title: project.title,
      description: project.description,
    });
  };

  useEffect(() => {
    showLoader();
    getProject(id).then((res) => {
      setProject(res);
      setIsArchived(res.is_archived);
      hideLoader();
    });
  }, []);

  const onExport = async (id) => {
    showLoader();
    let projects = await exportProject(id)
    hideLoader();
  }

  const onArchive = async (id) => {
    Modal.confirm({
      title: isArchived ? "Are you sure you want to unarchive this project?" : "Are you sure you want to archive this project?",
      OkText: "Yes",
      CancelText: "No",
      width: "400px",
      onOk: async () => {
        showLoader();
        let res = await archiveProject(id)
        if (res != undefined) {
          setIsArchived(res);
        }
        hideLoader();
      }
    });
  }

  const onPullData = async () => {
    showLoader();
    await PullNewData(id);
    hideLoader();
  };


  const onDownload = async (id) => {
    showLoader();
    let download = await downloadProject(id)
    if (download.status == 200) {
      setData(download.data)
    }
    hideLoader();
  }


  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "data.json";

    link.click();
  };
  const handleChange = (e) => {
    if (e === "CSV") {
      setOptions(e)
    }
    else {
      setOptions(e)
    }
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
            <div style={{display:'flex', marginBottom: '24px', flexWrap: 'wrap', rowGap: '16px', columnGap: '8px'}}>
              <Button type="primary" disabled={published} onClick={handlePublishProject}>
                Publish Project
              </Button>
              <Button type="primary" onClick={() => onExport(id)}>
                Export Project
              </Button>
              <Button type="primary" onClick={() => onArchive(id)}>
                {isArchived ? "Unarchive Project" : "Archive Project"}
              </Button>
              <Button type="primary" onClick={() => onPullData(id)}>
                Pull New Data Items
              </Button>
              <Select
                defaultValue="CSV"
                style={{
                  width: 120,
                  marginLeft: "10px"
                }}
                onChange={handleChange}
              >
                <Option value="CSV">CSV</Option>
                <Option value="JSON">JSON</Option>

              </Select>
              <Button type="primary" onClick={() => onDownload(id)}>
                Download project
              </Button>
              {data?.length && (options == "CSV" ? <CSVDownload
                    filename={"Expense_Table.csv"}
                    data={data}
                    target="_blank"
                  >

                  </CSVDownload> : exportData())

                  }
            </div>
            <Title level={3}>Read-only Configurations</Title>
            {project && project.sampling_mode && (
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
            {project && project.variable_parameters && Object.keys(project.variable_parameters).length !==0 && (
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
