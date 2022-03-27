import {
  Avatar,
  Col,
  Row,
  Divider,
  Card,
  Tag,
  Form,
  Input,
  Button,
  Checkbox,
  Alert,
  message,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SelectOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import UserContext from "../../context/User/UserContext";
import Paragraph from "antd/lib/typography/Paragraph";
import {
  fetchProfile,
  organizationEdit,
  userProfileEdit,
} from "../../api/UserAPI";
import ModalComponent from "../../components/ModalComponent";

function UserProfile() {
  let userContext = useContext(UserContext);
  const [isUser, setIsUser] = useState(false);
  const [user, setUser] = useState(undefined);
  const [isModalVisibleProfile, setIsModalVisibleProfile] = useState(false);
  const [isModalVisibleOrganization, setIsModalVisibleOrganization] =
    useState(false);

  const onFinishUserEdit = async (values) => {
    const data = await userProfileEdit(values);

    if (data) {
      const editUser = {
        ...user,
        first_name: data?.first_name,
        last_name: data?.last_name,
        phone: data?.phone,
        username: data?.username,
      };

      setUser(editUser);

      message.success(
        `User ${data.first_name} ${data.last_name} Successfully Updated`
      );
    }

    setIsModalVisibleProfile(false);
  };

  const onFinishOrganizationEdit = async (values) => {
    const data = await organizationEdit({
      id: user?.organization?.id,
      ...values,
    });

    if (data) {
      const editUser = {
        ...user,
      };

      editUser.organization.created_by = data.created_by;
      editUser.organization.title = data.title;
      editUser.organization.email_domain_name = data.email_domain_name;

      setUser(editUser);

      message.success(`Organization Successfully Updated`);
    }

    setIsModalVisibleOrganization(false);
  };

  useEffect(() => {
    if (window.location.href.split("/")[4] === "me") {
      setIsUser(true);
      setUser(userContext.user);
    } else {
      fetchProfile(window.location.href.split("/")[4]).then((res) => {
        setUser(res);
      });
    }
  }, [userContext]);

  return (
    <>
      <ModalComponent
        isOpenModal={isModalVisibleProfile}
        setIsOpenModal={setIsModalVisibleProfile}
        title={"Edit User Profile"}
      >
        <Form
          name="basic"
          layout="vertical"
          initialValues={{
            first_name: user?.first_name,
            last_name: user?.last_name,
            username: user?.username,
            phone: user?.phone,
            email: user?.email,
          }}
          onFinish={onFinishUserEdit}
          autoComplete="off"
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item
              label="First Name"
              name="first_name"
              rules={[
                {
                  message: "Please input your first name!",
                },
              ]}
              className="half-input"
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="last_name"
              rules={[
                {
                  message: "Please input your last name!",
                },
              ]}
              className="half-input"
            >
              <Input />
            </Form.Item>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  message: "Please input your username!",
                },
              ]}
              className="half-input"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                {
                  message: "Please input your username!",
                },
              ]}
              className="half-input"
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                message: "Please input your email!",
              },
            ]}
            className="full-input"
            required="true"
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </ModalComponent>

      <ModalComponent
        isOpenModal={isModalVisibleOrganization}
        setIsOpenModal={setIsModalVisibleOrganization}
        title={"Edit Organization"}
      >
        <Form
          name="basic"
          layout="vertical"
          initialValues={{
            created_by: user?.organization?.created_by,
            title: user?.organization?.title,
            email_domain_name: user?.organization?.email_domain_name,
          }}
          onFinish={onFinishOrganizationEdit}
          autoComplete="off"
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item
              label="Created By"
              name="created_by"
              className="half-input"
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Title"
              name="title"
              rules={[
                {
                  message: "Please input organization Title!",
                },
              ]}
              className="half-input"
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            label="Email"
            name="email_domain_name"
            rules={[
              {
                message: "Please input organization email!",
              },
            ]}
            className="full-input"
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </ModalComponent>
      {user && (
        <Row style={{ width: "100%" }}>
          <Col span={1} />

          <Col
            span={4}
            style={{
              height: "80vh",
            }}
          >
            <Card>
              <div>
                <Avatar
                  size={128}
                  icon={<UserOutlined />}
                  style={{ marginBottom: "1%", marginRight: "3%" }}
                />
                {isUser && (
                  <EditOutlined
                    style={{ float: "right", fontSize: "1.4rem" }}
                    onClick={() => {
                      setIsModalVisibleProfile(true);
                    }}
                  />
                )}
              </div>
              <Divider />
              <Title style={{ marginBottom: "0" }} level={2}>
                {user.first_name + " " + user.last_name}{" "}
              </Title>
              <Paragraph style={{ fontSize: "1.2rem", color: "gray" }}>
                AKA {user.username}
              </Paragraph>
              <Paragraph style={{ fontSize: "1.1rem" }}>
                <MailOutlined /> {user.email}
              </Paragraph>
              <Paragraph style={{ fontSize: "1.1rem" }}>
                <PhoneOutlined /> {user.phone}
              </Paragraph>
            </Card>
          </Col>
          <Col span={1} />
          <Col span={16}>
            <Card>
              <Divider
                style={{ marginTop: "0", color: "gray" }}
                orientation="left"
                plain
              >
                Organization
              </Divider>
              <Title level={2}>
                {user.organization.title}
                <Button
                  style={{ float: "right", color: "gray" }}
                  icon={<SelectOutlined />}
                  type="link"
                  onClick={() => setIsModalVisibleOrganization(true)}
                />
              </Title>
              {user.role === 3 && <Tag color="red">Admin</Tag>}
              {user.role === 2 && <Tag color="blue">Manager</Tag>}
              {user.role === 1 && <Tag color="green">Annotator</Tag>}

              <Divider style={{ color: "gray" }} orientation="left" plain>
                Performance
              </Divider>
            </Card>
          </Col>
          <Col span={1} />
        </Row>
      )}
    </>
  );
}

export default UserProfile;
