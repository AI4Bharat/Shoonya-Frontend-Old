import React, { useContext, useEffect, useState } from "react";
import { Col, Row, Card, Table, Button, Tabs, Radio, Select } from "antd";
import { Link } from "react-router-dom";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import { useNavigate, useParams } from "react-router-dom";
import { getTasks } from "../../api/ProjectDashboardAPI";
import { getProject, getProjectMembers } from "../../api/ProjectAPI";
import "react-datepicker/dist/react-datepicker.css";
import {
  getColumnNames,
  getDataSource,
} from "./TasksTableContent";
import { message } from "antd";
import axiosInstance from "../../utils/apiInstance";
import UserContext from "../../context/User/UserContext";
import useFullPageLoader from "../../hooks/useFullPageLoader";
import {MembersTab} from './MembersTab';
import "../../../src/App.css";
import { ReportsTab } from "./ReportsTab";

const { TabPane } = Tabs;

function ProjectDashboard() {
  const pathName = window.location.pathname;
  const pageState = sessionStorage.getItem(pathName) ? JSON.parse(sessionStorage.getItem(pathName)): null;
  const userContext = useContext(UserContext);
  let navigate = useNavigate();
  const { project_id } = useParams();
  const [project, setProject] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({});
  const [selectedFilter, setFilter] = useState(pageState?.prevFilter ? pageState.prevFilter : "unlabeled");
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [selectedAnnotator, setAnnotator] = useState("-1");
  const filters = [
    { label: "unlabeled", value: "unlabeled", },
    { label: "skipped", value: "skipped", },
    { label: "accepted", value: "accepted", },
    { label: "draft", value: "draft", },
  ];

  const [currentTab, setTab] = useState(pageState?.prevTab ? pageState.prevTab : "1");
  const DEFAULT_PAGE_SIZE = pageState?.prevPageSize ? pageState.prevPageSize : 10;
  const DEFAULT_PAGE_NUMBER = pageState?.prevPage ? pageState.prevPage : 1;

  useEffect(() => {
    localStorage.setItem('labellingMode', selectedFilter);
  }, [selectedFilter]);

  function handleTableChange() {
    showLoader();
    getTasks(project_id, pagination.current, pagination.pageSize, selectedFilter).then((res) => {
      pagination.total = res.count;
      setPagination(pagination);
      setTasks(res.results);
      hideLoader();
    });
  }

  function handleFilterChange(selectedValue) {
    showLoader();
    setFilter(selectedValue.target.value);
    getTasks(project_id, 1, pagination.pageSize, selectedValue.target.value, Number(selectedAnnotator)).then((res) => {
      pagination.total = res.count;
      setPagination(pagination);
      setTasks(res.results);
      hideLoader();
    });
  }

  function handleAnnotatorChange(selectedValue) {
    showLoader();
    setAnnotator(selectedValue);
    getTasks(project_id, 1, pagination.pageSize, selectedFilter, Number(selectedValue)).then((res) => {
      pagination.total = res.count;
      setPagination(pagination);
      setTasks(res.results);
      hideLoader();
    });
  }

  useEffect(() => {
    if (project_id) {
      getProject(project_id).then((res) => {
        setProject(res);
      });
      getTasks(project_id, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, selectedFilter).then((res) => {
        setTasks(res.results);
        pagination.total = res.count;
        pagination.current = DEFAULT_PAGE_NUMBER;
        pagination.pageSize = DEFAULT_PAGE_SIZE;
        setPagination(pagination);
      });
      getProjectMembers(project_id).then((res) => {
        setProjectMembers(res["users"]);
      });
    }
  }, [project_id]);

  useEffect(() => {
    if (tasks) {
      getDataSource(
        tasks,
        project_id,
        project.project_mode,
        project.is_published
      ).then((res) => {
        setDataSource(res);
      });
    }
  }, [tasks]);

  useEffect(() => {
    if (dataSource?.length > 0) {
      showLoader();
      getColumnNames(
        dataSource[0],
        project.project_mode,
        project.project_type
      ).then((res) => {
        for (let i = 0; i < res.length; i++) {
          res[i].title = res[i].title.replaceAll("_", " ");
        }
        setColumns(res);
        hideLoader();
      });
    }
  }, [dataSource]);

  const labelAllTasks = async (project_id) => {
    try {
      let response = await axiosInstance.post(`/projects/${project_id}/next/?task_status=${selectedFilter}`, {
        id: project_id,
      });
      if (response.status === 204) {
        message.info("All tasks are labeled");
      } else {
        localStorage.setItem("labelAll", true);
        navigate(`/projects/${project_id}/task/${response.data.id}`);
      }
    } catch (err) {
      if (err.response.status === 404) {
        message.info("No more tasks to label");
      } else {
        message.error("Error labelling all tasks.");
      }
    }
  };

  return (
    <>
      <Row style={{ width: "100%", height: "100%" }}>
        <Col span={1} />
        <Col
          span={22}
          style={{ width: "100%", rowGap: "0px", marginBottom: "20px" }}
        >
          <Card style={{ width: "100%" }}>
            <Title>{project.title}</Title>
            <Paragraph>
              <b>Project ID:</b> {project.id}
            </Paragraph>
            <Paragraph>
              <b>Description:</b> {project.description}
            </Paragraph>
            <Paragraph>
              <b>Project Type:</b> {project.project_mode} -{" "}
              {project.project_type}
            </Paragraph>
            <Paragraph>
              <b>Status: </b>{" "}
              {project.is_published
                ? "Published"
                : project.is_archived
                  ? "Archived"
                  : "Draft"}
            </Paragraph>
            {userContext.user?.role !== 1 && (
              <Button type="primary">
                <Link to="settings">Show Project Settings</Link>
              </Button>
            )}
            <Tabs defaultActiveKey={currentTab} onChange={(key)=>setTab(key)}>
              <TabPane tab="Tasks" key="1">
                <Row gutter={[16,16]}>
                <Col span={9}>
                {project.project_mode == "Annotation" ? (
                  <div style={{ display: "inline-flex", width: "100%", justifyContent: "space-evenly", alignItems: "center" }}>
                    Filter by Status:
                    <Radio.Group
                      value={selectedFilter}
                      onChange={handleFilterChange}
                    >
                    {filters.map((filter, i) => (
                      <Radio.Button key={i} value={filter.value}>{filter.label}</Radio.Button>
                    ))}
                    </Radio.Group>
                  </div>
                ) : (<div></div>)
                }
                </Col>
                <Col span={9}>
                {(userContext.user?.role === 2 || userContext.user?.role === 3) && project.project_mode == "Annotation" ? (
                  <div style={{ display: "inline-flex", width: "100%", justifyContent: "space-evenly", alignItems: "center", flexWrap: "wrap" }}>
                    Filter by Annotators:
                    <Select
                      showSearch
                      value={selectedAnnotator}
                      placeholder="Select an annotator"
                      optionFilterProp="children"
                      onChange={handleAnnotatorChange}
                      style={{ flexGrow: 1, marginLeft: "5%", marginRight: "5%" }}
                    >
                      <Select.Option value="-1">All</Select.Option>
                      {projectMembers.filter(member => member.role === 1).map((member, i) => (
                        <Select.Option key={i} value={member.id}>
                          {member.username}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                ) : (<div></div>)
                }
                </Col>
                {userContext.user?.role == 1 && <Col span={6}>
                {project.project_mode == "Annotation" ? (
                  project.is_published ? (
                    <div style={{ display: "inline-flex", width: "100%", marginBottom: "1%", marginRight: "1%", flexWrap: "wrap" }}>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          labelAllTasks(project_id);
                        }}
                        type="primary"
                        style={{ width: "100%", marginBottom: "1%", marginRight: "1%" }}
                      >
                        Start Labelling Now
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="primary"
                      style={{ width: "100%", marginBottom: "1%", marginRight: "1%" }}
                    >
                      Disabled
                    </Button>
                  )
                ) : (
                  <Button 
                    type="primary" 
                    style={{ width: "100%", marginBottom: "1%", marginRight: "1%" }}>
                    <Link to={`/add-collection-data/${project.id}`}>
                      Add New Item
                    </Link>
                  </Button>
                )}
                </Col>}
                </Row>
                <Table
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
                  columns={columns}
                  dataSource={dataSource}
                />
              </TabPane>
              <TabPane tab="Members" key="2">
                <MembersTab projectMembers={projectMembers} />
              </TabPane>
              <TabPane tab=" Reports" key="3">
                <ReportsTab />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
        <Col span={1} />
      </Row>
      {loader}
    </>
  );
}

export default ProjectDashboard;
