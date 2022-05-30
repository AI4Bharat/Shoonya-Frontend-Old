import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Col, Row, Button, Select, Input, message } from "antd";
import Title from "antd/lib/typography/Title";

import UserContext from "../../context/User/UserContext";

import { getDomains, createProject } from "../../api/CreateProjectAPI";
import useFullPageLoader from "../../hooks/useFullPageLoader";

const { Option } = Select;

function CreateCollectionProject() {
  const userContext = useContext(UserContext);

  const { id } = useParams();
  let navigate = useNavigate();

  const [domains, setDomains] = useState(null);
  const [types, setTypes] = useState(null);

  //Form related state variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  useEffect(() => {
    if (userContext.user) {
      getDomains().then((res) => {
        const tempDomains = [];
        const tempTypes = {};
        const tempDatasetTypes = {};
        const tempColumnFields = {};
        for (const domain in res) {
          for (const project_type in res[domain]["project_types"]) {
            if (
              res[domain]["project_types"][project_type].project_mode ===
              "Collection"
            ) {
              tempDomains.push(domain);
            }
          }

          const tempTypesArr = [];

          for (const project_type in res[domain]["project_types"]) {
            if (
              res[domain]["project_types"][project_type].project_mode ===
              "Collection"
            ) {
              tempTypesArr.push(project_type);
            }

            if (res[domain]["project_types"][project_type]["input_dataset"]) {
              tempDatasetTypes[project_type] =
                res[domain]["project_types"][project_type]["input_dataset"][
                  "class"
                ];
              tempColumnFields[project_type] =
                res[domain]["project_types"][project_type]["input_dataset"][
                  "fields"
                ];
            }
          }
          tempTypes[domain] = tempTypesArr;
        }
        setDomains(tempDomains);
        setTypes(tempTypes);
      });
    }
  }, [userContext]);

  const handleDomainChange = (value) => {
    setSelectedDomain(value);
    setSelectedType(null);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  const handleCreateProject = () => {
    showLoader();
    createProject({
      title: title,
      description: description,
      created_by: +userContext.user.id,
      is_archived: false,
      is_published: false,
      users: [+userContext.user.id],
      workspace_id: +id,
      organization_id: +userContext.user.organization.id,
      project_type: selectedType,
      label_config: "string",
      variable_parameters: {},
      project_mode: "Collection",
      required_annotators_per_task: 1,
    })
      .then((data) => {
        hideLoader();
        navigate(`/projects/${data.id}`, { replace: true });
      })
      .catch((err) => {
        hideLoader();
        message.error("Error creating project ", err);
      });
  };

  return (
    <Row style={{ width: "100%" }}>
      <Col span={5} />
      <Col span={5} style={{ height: "80vh" }}>
        <Title>Create a Project</Title>
        <h1 className="margin-top-heading">Title:</h1>
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <h1 className="margin-top-heading">Description:</h1>
        <Input
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <h1 className="margin-top-heading">Select a domain to work in:</h1>
        {domains && (
          <Select
            style={{ width: "100%" }}
            placeholder="Select Domain"
            onChange={handleDomainChange}
          >
            {domains.map((domain) => {
              return (
                <Option key={domain} value={domain}>
                  {domain}
                </Option>
              );
            })}
          </Select>
        )}
        {selectedDomain && (
          <>
            <h1 className="margin-top-heading">Select a Project Type:</h1>
            <Select
              style={{ width: "100%" }}
              placeholder="Select Project Type"
              value={selectedType}
              onChange={handleTypeChange}
            >
              {types[selectedDomain].map((type) => {
                return (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                );
              })}
            </Select>
          </>
        )}

        {selectedType && (
          <>
            <h1 className="margin-top-heading">Finalize Project</h1>
            <Button
              onClick={handleCreateProject}
              style={{ marginRight: "10px" }}
            >
              Create Project
            </Button>
            <Button onClick={() => navigate(`/workspace/${id}`)} danger>
              Cancel
            </Button>
          </>
        )}
      </Col>
      {loader}
    </Row>
  );
}

export default CreateCollectionProject;
