import { Button, Col, Form, Input, message, Row } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTask, updateTask } from "../api/CollectionDataAPI";
import { getDomains, getFieldTypes, getProject } from "../api/CreateProjectAPI";
// import projects from "../utils/projectData";

function AddCollectionData() {
  const { id } = useParams();
  let navigate = useNavigate();

  const [currentProject, setCurrentProject] = useState({});
  const [datasetFieldsList, setDatasetFieldsList] = useState([]);
  // const [domains, setDomains] = useState({});
  // const [projectType, setProjectType] = useState([]);
  // const [fieldList, setFieldList] = useState([]);
  // const [fieldClass, setFieldClass] = useState("");
  const [formValues, setFormValues] = useState({});
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [dataPresent, setDataPresent] = useState(false);

  const getDatasetFields = (currentProjectData) => {
    console.log(currentProjectData);
    const tempFields = [];
    let fieldClass = "";
    let flag = false;

    getDomains().then((data) => {
      console.log(data);

      Object.keys(data).forEach((key) => {
        Object.keys(data[key].project_types).forEach((project_type) => {
          if (currentProjectData.project_type === project_type) {
            const fields =
              data[key].project_types[project_type].output_dataset.fields
                .annotations;

            fieldClass =
              data[key].project_types[project_type].output_dataset.class;
            tempFields.push(...fields);
            flag = true;
            return;
          }
        });
        // console.log(tempFields, fieldClass);
        if (flag === true) {
          return;
        }
      });

      if (flag == true) {
        return getDatasetFieldTypes(tempFields, fieldClass);
      }
    });
  };

  const getDatasetFieldTypes = async (datasetFields, fieldClass) => {
    const tempData = [];

    const data = await getFieldTypes(fieldClass);
    console.log(data);

    datasetFields.forEach((inputField) => {
      const index = Object.keys(data).findIndex(
        (field) => field === inputField
      );

      console.log(index);
      if (index !== -1) {
        // console.log(data[inputField].data.name);
        const tempdata = data[inputField].data;
        // console.log(tempdata);

        // Object.keys(tempdata).forEach((val) => console.log(val));

        tempData.push({ title: inputField, type: data[inputField].name });
      }
    });

    setDatasetFieldsList([...tempData]);
  };

  const onSave = () => {
    console.log(formValues);
    if (!dataPresent) {
      createTask(formValues, id)
        .then((data) => {
          console.log(data);
          setCurrentTaskId(data.id);
          setDataPresent(true);
          message.success("Successfully Created a New Task");
        })
        .catch((error) => message.error("Unable to create a task"));
    } else {
      updateTask(formValues, id, currentTaskId)
        .then((data) =>
          message.success("Successfully Updated the Current Task")
        )
        .catch((error) => message.error("Unable to update Task"));
    }
  };

  const onSaveAddNew = () => {
    onSave();
    setDataPresent(false);
    setFormValues({});
  };

  const onSaveExit = () => {
    onSave();
    navigate(`/profile/me`);
  };

  useEffect(() => {
    setDataPresent(false);
    setCurrentTaskId(null);
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
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
              <div>
                {datasetFieldsList.length > 0 &&
                  datasetFieldsList.map((field, idx) => {
                    const type = field.type;
                    const title = field.title;
                    // console.log(
                    //   field.title.split("_").join(" ").toUpperCase()
                    // );
                    // field.title
                    //       .split("_")
                    //       .map(
                    //         (word) => word[0].toUpperCase() + word.substring(1)
                    //       )
                    //       .join(" ")

                    return (
                      <div key={idx}>
                        {(type === "TextField" ||
                          type === "CharField" ||
                          type === "DecimalField" ||
                          type === "IntegerFIeld") && (
                          <div>
                            <h3 className="margin-top-heading">
                              {title
                                .split("_")
                                .map(
                                  (word) =>
                                    word[0].toUpperCase() + word.substring(1)
                                )
                                .join(" ")}
                            </h3>
                            <Input
                              value={formValues[title]}
                              onChange={(e) =>
                                setFormValues({
                                  ...formValues,
                                  [title]: e.target.value,
                                })
                              }
                            />
                          </div>
                        )}
                        {/* <Input /> */}
                      </div>
                    );
                  })}

                <div>
                  <h1 className="margin-top-heading">Finalize Project</h1>
                  <div style={{ display: "flex" }}>
                    <Button onClick={onSave}>Save</Button>

                    <Button onClick={onSaveAddNew}>Save and Add New</Button>

                    <Button onClick={onSaveExit}>Save and Go Back</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* <>
              <h1 className="margin-top-heading">Finalize Project</h1>
              <Button style={{ marginRight: "10px" }}>Submit</Button>
              <Button danger>Cancel</Button>
            </> */}
          </Col>
        </Row>
      )}
    </>
  );
}

export default AddCollectionData;
