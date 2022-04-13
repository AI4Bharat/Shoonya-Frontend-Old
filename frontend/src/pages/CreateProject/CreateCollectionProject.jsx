import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Col, Row, Button, Select, Input, message, Table } from "antd";
import Title from "antd/lib/typography/Title";

import { InputNumber } from "antd";

import UserContext from "../../context/User/UserContext";

import {
  getDomains,
  getInstanceIds,
  getData,
  createProject,
} from "../../api/CreateProjectAPI";

const { Option } = Select;

function CreateCollectionProject() {
  const userContext = useContext(UserContext);

  const { id } = useParams();
  let navigate = useNavigate();

  const [domains, setDomains] = useState(null);
  const [types, setTypes] = useState(null);
  const [datasetType, setDatasetType] = useState(null);
  const [columnFields, setColumnFields] = useState(null);
  const [instanceIds, setInstanceIds] = useState(null);

  //Form related state variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedAnnotatorsNum, setSelectedAnnotatorsNum] = useState(null);
  const [filterString, setFilterString] = useState(null);
  const [samplingMode, setSamplingMode] = useState(null);
  const [random, setRandom] = useState(5);
  const [batchSize, setBatchSize] = useState(null);
  const [batchNumber, setBatchNumber] = useState(null);
  const [samplingParameters, setSamplingParameters] = useState(null);
  const [selectedInstances, setSelectedInstances] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  //Table related state variables (do we need states here?)
  const [columns, setColumns] = useState(null);
  const [tableData, setTableData] = useState(null);

  useEffect(() => {
    if (userContext.user) {
      getDomains().then((res) => {
        const tempDomains = [];
        const tempTypes = {};
        const tempDatasetTypes = {};
        const tempColumnFields = {};
        for (const domain in res) {
          tempDomains.push(domain);
          const tempTypesArr = [];
          for (const project_type in res[domain]["project_types"]) {
            tempTypesArr.push(project_type);
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
        setDatasetType(tempDatasetTypes);
        setColumnFields(tempColumnFields);
      });
    }
  }, [userContext]);

  useEffect(() => {
    if (batchSize && batchNumber) {
      setSamplingParameters({
        batch_size: batchSize,
        batch_number: batchNumber,
      });
    }
  }, [batchSize, batchNumber]);

  const handleDomainChange = (value) => {
    setSelectedDomain(value);
    setSelectedType(null);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    let tempColumns = [];
    for (const column in columnFields[value]) {
      tempColumns.push({
        title: columnFields[value][column],
        dataIndex: columnFields[value][column],
        key: columnFields[value][column],
      });
    }
    setColumns(tempColumns);
    getInstanceIds(datasetType[value]).then((res) => {
      let tempInstanceIds = {};
      for (const instance in res) {
        tempInstanceIds[res[instance]["instance_id"]] =
          res[instance]["instance_name"];
      }
      setInstanceIds(tempInstanceIds);
    });
  };

  const handleSamplingChange = (value) => {
    setSamplingMode(value);
    if (value === "f") {
      setSamplingParameters({});
    }
  };

  const handleRandomChange = (value) => {
    setRandom(value);
    setSamplingParameters({
      fraction: parseFloat(value / 100),
    });
  };

  const handleBatchSizeChange = (value) => {
    setBatchSize(value);
  };

  const handleBatchNumberChange = (value) => {
    setBatchNumber(value);
  };

  const handleInstanceSelect = (value) => {
    setSelectedInstances(value);
  };

  const handleGetData = () => {
    if (selectedInstances) {
      setConfirmed(true);
      getData(selectedInstances).then((res) => {
        let key = 1;
        for (const data in res) {
          res[data].key = key;
          key++;
        }
        setTableData(res);
      });
    } else {
      message.info("You haven't selected any sources");
    }
  };

  const handleChangeInstances = () => {
    setConfirmed(false);
    setTableData(null);
    setSamplingMode(null);
    setSamplingParameters(null);
  };

  const handleCreateProject = () => {
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
        navigate(`/project/${data.id}`, { replace: true });
      })
      .catch((err) => {
        message.error("Error creating project");
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
            <h1 className="margin-top-heading">Annotators Per Task :</h1>
            <Input
              value={selectedAnnotatorsNum}
              onChange={(e) => {
                setSelectedAnnotatorsNum(e.target.value);
              }}
            />
          </>
        )}

        {selectedAnnotatorsNum && (
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
    </Row>
  );
}

export default CreateCollectionProject;
