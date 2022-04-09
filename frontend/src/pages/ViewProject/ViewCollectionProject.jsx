import React, { useState } from "react";
import { Button, Col, Form, Input, message, Row } from "antd";
import Title from "antd/lib/typography/Title";
import { useParams, useNavigate } from "react-router-dom";
import { addAnnotatorsToProject, publishProject } from "../../api/ProjectAPI";

function ViewCollectionProject() {
  const { id } = useParams();
  let navigate = useNavigate();
  const { TextArea } = Input;

  const onFinishAddAnnotator = async (values) => {
    const emails = values.emails.split(", ");

    await addAnnotatorsToProject(id, emails);
  };

  const handlePublishProject = async () => {
    await publishProject(id);
    navigate(`/projects/${id}`, { replace: true });
  };

  return (
    <Row style={{ width: "100%" }}>
      <Col span={5} />
      <Col span={12} style={{ height: "80vh" }}>
        <Title>Add Annotators To The Project</Title>
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
              <Button type="primary" onClick={handlePublishProject}>
                Publish Project
              </Button>
            </div>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

export default ViewCollectionProject;
