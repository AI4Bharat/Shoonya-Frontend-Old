import React, { useContext, useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";

import { Col, Row, Button, Select, Input, InputNumber, message } from "antd";
import Title from "antd/lib/typography/Title";

import UserContext from "../../context/User/UserContext";

import { createProject } from "../../api/ProjectAPI";
import { getDomains } from "../../api/CreateProjectAPI";

const { Option } = Select;

function CreateProject() {
  const userContext = useContext(UserContext);

  const { id } = useParams();
  let navigate=useNavigate();

  const [domains, setDomains] = useState(null);
  const [types, setTypes] = useState(null);

  //Form related state variables
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [filterString, setFilterString] = useState(null);
  const [samplingMode, setSamplingMode] = useState(null);
  const [random, setRandom] = useState(5);
  const [batchSize, setBatchSize] = useState(null);
  const [batchNumber, setBatchNumber] = useState(null);
  const [samplingParameters, setSamplingParameters] = useState(null);
  const [projectType, setProjectType] = useState(null);
  const [datasetId, setDatasetId] = useState(null);

  useEffect(() => {
    const temp = {
      Translation: {
        description: "Translating sentences from source to target language",
        project_types: {
          MonolingualTranslation: {
            label_studio_jsx_file: "translation/monolingual_translation.jsx",
            input_dataset: {
              class: "SentenceText",
              fields: ["lang_id", "text"],
            },
            output_dataset: {
              class: "TranslationPair",
              save_type: "new_record",
              fields: {
                variable_parameters: ["output_lang_id"],
                copy_from_input: {
                  lang_id: "input_lang_id",
                  text: "input_text",
                },
                annotations: ["output_text"],
              },
            },
            label_studio_jsx_payload:
              '<View>\n  <Header value="Translate the given sentence into the specified language"/>\n\n  <Header value="Input Sentence"/>\n  <Text name="input_text" value="$input_text" />\n\n  <Header value="Translation Language (Output Language)" />\n  <Text name="output_lang_id" value="$output_lang_id" />\n\n  <Header value="Translation" />\n  <TextArea name="output_text" toName="input_text" showSubmitButton="true" maxSubmissions="1" editable="true" required="true"/>\n\n</View>\n',
            domain: "Translation",
          },
          TranslationEditing: {
            label_studio_jsx_file: "translation/translation_editing.jsx",
            input_dataset: {
              class: "TranslationPair",
              fields: [
                "input_lang_id",
                "input_text",
                "output_lang_id",
                "machine_translation",
              ],
            },
            output_dataset: {
              class: "TranslationPair",
              save_type: "in_place",
              fields: {
                annotations: ["output_text"],
              },
            },
            label_studio_jsx_payload:
              '<View>\n  <Header value="Verify the given translation with the machine translation and enter the correct translation"/>\n  <Header value="Input Translation"/>\n  <Text name="input_text" value="$input_text" />\n  <Header value="Output Language" />\n  <Text name="output_lang_id" value="$output_lang_id" />\n  <Header value="Machine Translation" />\n  <Text name="machine_translation" value="$machine_translation" />\n  <Header value="Output Translation" />\n  <TextArea name="output_text" toName ="input_text" showSubmitButton="true" maxSubmissions="1" editable="true" required="true"/>\n</View>\n',
            domain: "Translation",
          },
        },
      },
    };
    // getDomains().then((res)=>{
    //     for(const key in res){
    //         console.log(key);
    //     }
    // })
    const tempDomains = [];
    const tempTypes = {};
    for (const domain in temp) {
      tempDomains.push(domain);
      const tempTypesArr = [];
      for (const project_type in temp[domain]["project_types"]) {
        tempTypesArr.push(project_type);
      }
      tempTypes[domain] = tempTypesArr;
    }
    setDomains(tempDomains);
    setTypes(tempTypes);
  }, []);

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
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
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
      sampling_percentage: value,
    });
  };

  const handleBatchSizeChange = (value) => {
    setBatchSize(value);
  };

  const handleBatchNumberChange = (value) => {
    setBatchNumber(value);
  };

  const handleCreateProject=()=>{
    createProject({
      title: title,
      description: description,
      created_by: userContext.user.id,
      is_archived: false,
      is_published: false,
      users: [userContext.user.id],
      workspace_id: id,
      organization_id: userContext.user.organization_id,
      filter_string: "string",
      sampling_mode: samplingMode,
      sampling_parameters_json: samplingParameters,
      project_type: 1,
      dataset_id: [1],
    }).then((data) => {
      navigate(`/project/${data.id}`,{replace:true})
    }).catch(err=>{
      message.error("Error creating project");
    });
  }

  return (
    <Row style={{ width: "100%" }}>
      <Col span={5} />
      <Col span={5} style={{ height: "80vh" }}>
        <Title>Create a Project</Title>
        <h1>Title:</h1>
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <h1>Description:</h1>
        <Input
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <h1>Select a domain to work in:</h1>
        {domains && (
          <Select defaultValue="Select Domain" onChange={handleDomainChange}>
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
            <h1>Select a Project Type:</h1>
            <Select
              defaultValue="Select Project Type"
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
            <h1>Select Sampling Type:</h1>
            <Select
              defaultValue="Select Sampling Type"
              onChange={handleSamplingChange}
            >
              <Option value="r">Random</Option>
              <Option value="f">Fixed</Option>
              <Option value="b">Batch</Option>
            </Select>
          </>
        )}

        {samplingMode === "r" && (
          <>
            <h3>Input Batch size to sample (in percentage):</h3>
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
        {samplingParameters&&(
          <>
          <h1>Finalize Project</h1>
          <Button onClick={handleCreateProject}>
            Create Project
          </Button>
          </>
        )}
      </Col>
    </Row>
  );
}

export default CreateProject;
