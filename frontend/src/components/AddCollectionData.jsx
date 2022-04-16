import { Button, Col, Input, message, Row, InputNumber } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTask, updateTask } from "../api/CollectionDataAPI";
import { getDomains, getFieldTypes, getProject } from "../api/CreateProjectAPI";

function AddCollectionData() {
  const { id } = useParams();
  let navigate = useNavigate();

  const [currentProject, setCurrentProject] = useState({});
  const [datasetFieldsList, setDatasetFieldsList] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [dataPresent, setDataPresent] = useState(false);

  const getDatasetFields = (currentProjectData) => {
    const tempFields = [];
    let fieldClass = "";
    let flag = false;

    getDomains().then((data) => {
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

    datasetFields.forEach((inputField) => {
      const index = Object.keys(data).findIndex(
        (field) => field === inputField
      );

      if (index !== -1) {
        tempData.push({ title: inputField, type: data[inputField].name });
        const tdata = data[inputField].data;
        const t2data = JSON.parse(tdata);
        console.log(data[inputField], tdata);
      }
    });

    setDatasetFieldsList([...tempData]);
  };

  const onSave = () => {
    if (!dataPresent) {
      createTask(formValues, id)
        .then((data) => {
          setCurrentTaskId(data.id);
          setDataPresent(true);
          message.success("Successfully Created a New Task");
        })
        .catch((err) => message.error("Unable to create a task ", err));
    } else {
      updateTask(formValues, id, currentTaskId)
        .then(() => message.success("Successfully Updated the Current Task"))
        .catch((err) => message.error(`Unable to update Task `, err));
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
      .catch((err) => message.error("Unable to fetch Project ", err));
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

                    return (
                      <div key={idx}>
                        {(type === "TextField" ||
                          type === "CharField" ||
                          type === "DecimalField") && (
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

                        {type === "IntegerFIeld" && (
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
                            <InputNumber
                              value={formValues[title]}
                              onChange={(value) =>
                                setFormValues({
                                  ...formValues,
                                  [title]: value,
                                })
                              }
                            />
                          </div>
                        )}

                        {type === "DecimalField" && (
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
                            <InputNumber
                              defaultValue="1"
                              step="0.00000000000001"
                              stringMode
                              value={formValues[title]}
                              onChange={(value) =>
                                setFormValues({
                                  ...formValues,
                                  [title]: value,
                                })
                              }
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}

                <div>
                  <h1 className="margin-top-heading">Finalize Project</h1>
                  <div style={{ display: "flex" }}>
                    <Button onClick={onSave}>Save</Button>

                    <Button onClick={onSaveAddNew}>Save and Add New</Button>

                    <Button onClick={onSaveExit}>Save and Go Back</Button>
                    <Button danger onClick={() => navigate(`/profile/me`)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
}

export default AddCollectionData;
