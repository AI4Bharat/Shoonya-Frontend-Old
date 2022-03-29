import React, { useState } from "react";
import { Button, Col, Form, Input, Row } from "antd";
import Title from "antd/lib/typography/Title";
import { useParams } from "react-router-dom";
import { addAnnotatorsToProject } from "../../api/ProjectAPI";

function ViewCollectionProject() {
  const { id } = useParams();
  const { TextArea } = Input;

  const onFinishAddAnnotator = async (values) => {
    console.log(values);

    const emails = values.emails.split(", ");
    console.log(emails);

    await addAnnotatorsToProject(id, emails);
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

            <Form.Item wrapperCol={{ span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

export default ViewCollectionProject;
