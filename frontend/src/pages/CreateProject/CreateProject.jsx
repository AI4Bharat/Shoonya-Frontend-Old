import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Col,
  Row,
  Button,
  Select,
  Input,
  InputNumber,
  message,
  Table,
} from "antd";
import Title from "antd/lib/typography/Title";

import UserContext from "../../context/User/UserContext";
import useFullPageLoader from "../../hooks/useFullPageLoader";

import {
  getDomains,
  getInstanceIds,
  getData,
  createProject,
} from "../../api/CreateProjectAPI";

const { Option } = Select;

function CreateProject() {
  const userContext = useContext(UserContext);

  const { id } = useParams();
  let navigate = useNavigate();

  const [domains, setDomains] = useState(null);
  const [types, setTypes] = useState(null);
  const [datasetType, setDatasetType] = useState(null);
  const [columnFields, setColumnFields] = useState(null);
  const [instanceIds, setInstanceIds] = useState(null);
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  //Form related state variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [samplingMode, setSamplingMode] = useState(null);
  const [random, setRandom] = useState(5);
  const [batchSize, setBatchSize] = useState(null);
  const [batchNumber, setBatchNumber] = useState(null);
  const [samplingParameters, setSamplingParameters] = useState(null);
  const [selectedInstances, setSelectedInstances] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [selectedAnnotatorsNum, setSelectedAnnotatorsNum] = useState(1);

  //Table related state variables (do we need states here?)
  const [columns, setColumns] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [pagination, setPagination] = useState({});
  const DEFAULT_PAGE_SIZE = 5;

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
            if (
              res[domain]["project_types"][project_type].project_mode ===
              "Annotation"
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

  useEffect(() => {
    setSelectedType(null);
    setSamplingParameters(null);
    setConfirmed(false);
    setTableData(null);
  }, [selectedDomain]);

  useEffect(() => {
    setInstanceIds(null);
    setSamplingParameters(null);
    setConfirmed(false);
    setTableData(false);
  }, [selectedType]);

  const handleDomainChange = (value) => {
    setSelectedDomain(value);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    let tempColumns = [];
    for (const column in columnFields[value]) {
      tempColumns.push({
        title: columnFields[value][column],
        dataIndex: columnFields[value][column],
        key: columnFields[value][column],
        ellipsis: true,

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
      showLoader();
      getData(selectedInstances, datasetType[selectedType], 1, DEFAULT_PAGE_SIZE).then((res) => {
        pagination.total = res.count;
        pagination.current = 1;
        pagination.pageSize = DEFAULT_PAGE_SIZE;
        setPagination(pagination);
        // let key = 1;
        // for (const data in res.results) {
        //   res[data].key = key;
        //   key++;
        // }
        setTableData(res.results);
        let key = 1;
        for (const data in tableData){
          tableData[data]["key"] = key;
          key++;
        }
        hideLoader();
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

  let abc=localStorage.setItem("selectboxvalue" ,samplingMode);

  const handleCreateProject = () => {
    showLoader();
    createProject({
      title: title,
      description: description,
      created_by: +userContext.user.id,
      is_archived: false,
      is_published: false,
      users: [userContext.user?.id],
      workspace_id: id,
      organization_id: userContext.user.organization.id,
      filter_string: "string",
      sampling_mode: samplingMode,
      sampling_parameters_json: samplingParameters,
      project_type: selectedType,
      dataset_id: selectedInstances,
      label_config: "string",
      variable_parameters: {},
      project_mode: "Annotation",
      required_annotators_per_task: selectedAnnotatorsNum,
    })
      .then((data) => {
        hideLoader();
        navigate(`/projects/${data.id}`, { replace: true });
      })
      .catch(() => {
        hideLoader();
        message.error("Error creating project");
      });
  };

  function handleTableChange() {
    showLoader();
    getData(selectedInstances, datasetType[selectedType], pagination.current, pagination.pageSize).then((res) => {
      pagination.total = res.count;
      setPagination(pagination);
      setTableData(res.results);
      hideLoader();
    });
  }

  return (
    <Row style={{ width: "100%", height: "100%" }}>
      <Col span={2} />
      <Col
        span={20}
        style={{
          width: "100%",
          rowGap: "0px",
          marginBottom: "30px",
        }}
      >
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
        {instanceIds && (
          <>
            <h1 className="margin-top-heading">
              Select sources to fetch data from:
            </h1>
            <Select
              disabled={confirmed}
              style={{ width: "100%" }}
              onChange={handleInstanceSelect}
              mode="multiple"
              allowClear
              placeholder="Select Sources"
            >
              {Object.keys(instanceIds).map((instance) => {
                return (
                  <Option key={instance} value={instance}>
                    {instanceIds[instance]}
                  </Option>
                );
              })}
            </Select>
            {selectedInstances.length > 0 && (
              <>
                <Button disabled={confirmed} onClick={handleGetData}>
                  Confirm Selections
                </Button>
                <Button disabled={!confirmed} onClick={handleChangeInstances}>
                  Change Sources
                </Button>
              </>
            )}
          </>
        )}
        {selectedType && columns && tableData && selectedInstances.length > 0 && (
          <>
            <h1 className="margin-top-heading">Dataset Rows:</h1>
            <Table 
              dataSource={tableData} 
              columns={columns} 
              pagination={{
                total: pagination.total,
                pageSize: pagination.pageSize,
                showSizeChanger: pagination.total > DEFAULT_PAGE_SIZE,
                onChange: (page, pageSize) => {
                  pagination.current = page;
                  pagination.pageSize = pageSize;
                },
              }}
              onChange={handleTableChange}
            />
          </>
        )}
        {selectedType && columns && tableData && selectedInstances.length > 0 && (
          <>
            <h1 className="margin-top-heading">Select Sampling Type:</h1>
            <Select
              placeholder="Select Sampling Type"
              onChange={handleSamplingChange}
            >
              <Option value="r">Random</Option>
              <Option value="f">Full</Option>
              <Option value="b">Batch</Option>
            </Select>
          </>
        )}

        {samplingMode === "r" && (
          <>
            <h3>Sampling Percentage:</h3>
            <InputNumber value={random} onChange={handleRandomChange} />
          </>
        )}
        {samplingMode === "b" && (
          <>
            <h3>Enter Batch size:</h3>
            <InputNumber
              placeholder="Batch Size"
              value={batchSize}
              onChange={handleBatchSizeChange}
            />
            <h3>Enter Batch Number:</h3>
            <InputNumber
              placeholder="Batch Number"
              value={batchNumber}
              onChange={handleBatchNumberChange}
            />
          </>
        )}
        {samplingParameters && (
          <>
            <h1 className="margin-top-heading">Annotators Per Task :</h1>
            <Input
              value={selectedAnnotatorsNum}
              defaultValue={"1"}
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
      <Col span={2} />
      {loader}
    </Row>
  );
}

export default CreateProject;
