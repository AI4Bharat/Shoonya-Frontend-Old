import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Col,
  Row,
  Table,
  Button,
  Select,
  Input,
} from "antd";
import Title from "antd/lib/typography/Title";
import UserContext from "../../context/User/UserContext";

import { createProject } from "../../api/ProjectAPI";
import { getDomains } from "../../api/CreateProjectAPI";

const { Option } = Select;

function CreateProject() {
  const { id } = useParams();

  const [domain, setDomain] = useState(null);
  const [types, setTypes] = useState(null);

  //Form related state variables
  const [title,setTitle]=useState(null);
  const [description,setDescription]=useState(null);
  const [filterString,setFilterString]=useState(null);
  const [samplingMode,setSamplingMode]=useState(null);
  const [samplingParameters,setSamplingParameters]=useState(null);
  const [projectType,setProjectType]=useState(null);
  const [datasetId,setDatasetId]=useState(null);

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
    setDomain(tempDomains);
    setTypes(tempTypes);
  }, []);

  const onCreateProject = (data) => {
    createProject({
      title: data.title,
      description: data.description,
      created_by: userContext.user.id,
      is_archived: false,
      is_published: false,
      users: [userContext.user.id],
      workspace_id: id,
      organization_id: useContext.user.organization_id,
      filter_string: "string",
      sampling_mode: "r",
      sampling_parameters_json: {},
      project_type: 1,
      dataset_id: [0],
    }).then(() => {
      return;
    });
  };

  const userContext = useContext(UserContext);

  return (
    <Row style={{ width: "100%" }}>
      <Col span={5} />
      <Col span={10} style={{ height: "80vh" }}>
        <Title>Create a Project</Title>
        
      </Col>
    </Row>
  );
}

export default CreateProject;
