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
import { fetchProfile } from "../../api/UserAPI";
import ModalComponent from "../../components/ModalComponent";
import axiosInstance from "../../utils/apiInstance";

function UserProfile() {
  let userContext = useContext(UserContext);
  const [isUser, setIsUser] = useState(false);
  const [user, setUser] = useState(undefined);
  const [isModalVisibleProfile, setIsModalVisibleProfile] = useState(false);
  const [isModalVisibleOrganization, setIsModalVisibleOrganization] =
    useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userUsername, setUserUsername] = useState("");
  const [organizationCreatedBy, setOrganizationCreatedBy] = useState("");
  const [organizationTitle, setOrganizationTitle] = useState("");
  const [organizationEmail, setOrganizationEmail] = useState("");
  const [organizationId, setOrganizationId] = useState("");

  const handleUserProfileEdit = () => {
    // console.log(userEmail);

    if (userEmail === "") {
      // console.log("Here");
      return alert("Enter Current User Email");
    }

    axiosInstance
      .patch("users/account/update/", {
        email: userEmail,
        first_name: userFirstName,
        last_name: userLastName,
        username: userUsername,
        phone: userPhone,
      })
      .then((res) => {
        return alert("User Successfully Updated");
      })
      .catch((err) => alert("Error : Couldn't User Information"));

    setIsModalVisibleProfile(false);
  };

  const handleOrganizationEdit = () => {
    console.log("Organization Edit");

    if (organizationId === "") {
      return alert("Unable To Fetch Organization");
    }

    axiosInstance
      .patch(`organizations/${organizationId}/`, {
        email_domain_name: organizationEmail,
        created_by: organizationCreatedBy,
        title: organizationTitle,
      })
      .then((res) => alert("Organization Successfully Updated"))
      .catch((err) => alert("Error : Couldn't Update Organization"));

    setIsModalVisibleOrganization(false);
  };

  useEffect(() => {
    if (window.location.href.split("/")[4] === "me") {
      setIsUser(true);
      setUser(userContext.user);
      // console.log(userContext.user);
    } else {
      fetchProfile(window.location.href.split("/")[4]).then((res) => {
        setUser(res);
      });
    }

    console.log(userContext.user);

    setUserEmail(userContext.user?.email || "");
    setUserFirstName(userContext.user?.first_name || "");
    setUserLastName(userContext.user?.last_name || "");
    setUserPhone(userContext.user?.phone || "");
    setUserUsername(userContext.user?.username || "");
    setOrganizationCreatedBy(userContext.user?.organization.created_by || "");
    setOrganizationEmail(
      userContext.user?.organization.email_domain_name || ""
    );
    setOrganizationTitle(userContext.user?.organization.title || "");
    setOrganizationId(userContext.user?.organization.id || "");
  }, [userContext]);

  return (
    <>
      <ModalComponent
        isOpenModal={isModalVisibleProfile}
        setIsOpenModal={setIsModalVisibleProfile}
        title={"Edit User Profile"}
        formSubmit={handleUserProfileEdit}
      >
        <Form
          name="basic"
          layout="vertical"
          initialValues={{
            firstname: userFirstName,
            lastname: userLastName,
            username: userUsername,
            phone: userPhone,
            email: userEmail,
          }}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item
              label="First Name"
              name="firstname"
              rules={[
                {
                  message: "Please input your first name!",
                },
              ]}
              className="half-input"
            >
              <Input
                onChange={(e) => {
                  setUserFirstName(e.target.value);
                }}
              />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastname"
              rules={[
                {
                  message: "Please input your last name!",
                },
              ]}
              className="half-input"
            >
              <Input onChange={(e) => setUserLastName(e.target.value)} />
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
              <Input onChange={(e) => setUserUsername(e.target.value)} />
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
              <Input onChange={(e) => setUserPhone(e.target.value)} />
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
            <Input onChange={(e) => setUserEmail(e.target.value)} />
          </Form.Item>
        </Form>
      </ModalComponent>

      <ModalComponent
        isOpenModal={isModalVisibleOrganization}
        setIsOpenModal={setIsModalVisibleOrganization}
        title={"Edit Organization"}
        formSubmit={handleOrganizationEdit}
      >
        <Form
          name="basic"
          layout="vertical"
          initialValues={{
            organizationId: organizationId,
            createdby: organizationCreatedBy,
            title: organizationTitle,
            email: organizationEmail,
          }}
          autoComplete="off"
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item
              label="Created By"
              name="createdby"
              rules={[
                {
                  message: "Please input organization creator!",
                },
              ]}
              className="half-input"
            >
              <Input
                onChange={(e) => {
                  setOrganizationCreatedBy(e.target.value);
                }}
              />
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
              <Input onChange={(e) => setOrganizationTitle(e.target.value)} />
            </Form.Item>
          </div>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                message: "Please input organization email!",
              },
            ]}
            className="full-input"
          >
            <Input onChange={(e) => setOrganizationEmail(e.target.value)} />
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
