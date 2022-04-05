import { Button, Col, Input, message, Row } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDomains, getProject } from "../api/CreateProjectAPI";
import axiosInstance from "../utils/apiInstance";
// import projects from "../utils/projectData";

function DynamicForm() {
  const { id } = useParams();

  const [currentProject, setCurrentProject] = useState({});
  const [domains, setDomains] = useState({});
  const [projectType, setProjectType] = useState([]);

  const getDatasetFields = (currentProjectData) => {
    console.log(currentProjectData);

    getDomains()
      .then((data) => {
        console.log(data);
        const tempTypes = [];
        Object.keys(data).forEach((key) => {
          Object.keys(data[key].project_types).forEach((project_type) => {
            tempTypes.push({ domain: key, project_type });
          });
        });

        const fields = {};
        console.log(tempTypes, currentProjectData);
        tempTypes.forEach((item) => {
          if (item.project_type === currentProjectData.project_type) {
            console.log(
              data[item.domain].project_types[item.project_type].output_dataset
                .fields.annotations
            );
          }
        });

        setProjectType([...tempTypes]);
      })
      .catch((error) => message.error("Unable to get Project Type"));
  };

  //   useEffect(() => {

  //   }, []);

  useEffect(() => {
    getProject(id)
      .then((data) => {
        setCurrentProject({ ...data });
        getDatasetFields(data);
      })
      .catch((err) => message.error("Unable to fetch Project"));
  }, []);

  return (
    <>
      {currentProject && Object.keys(currentProject).length > 0 && (
        <Row style={{ width: "100%" }}>
          <Col span={5} />
          <Col span={14} style={{ height: "80vh" }}>
            <Title>Add Dataset</Title>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {currentProject.title && (
                <div className="half-input">
                  <h1 className="margin-top-heading">Title:</h1>
                  <Input value={currentProject.title} disabled={true} />
                </div>
              )}
              {currentProject.description && (
                <div className="half-input">
                  <h1 className="margin-top-heading">Description:</h1>
                  <Input value={currentProject.description} disabled={true} />
                </div>
              )}
            </div>

            <div>
              <h1 className="margin-top-heading">Dataset Items : </h1>
            </div>

            <>
              <h1 className="margin-top-heading">Finalize Project</h1>
              <Button style={{ marginRight: "10px" }}>Submit</Button>
              <Button danger>Cancel</Button>
            </>
          </Col>
        </Row>
      )}
    </>
  );
}

export default DynamicForm;
