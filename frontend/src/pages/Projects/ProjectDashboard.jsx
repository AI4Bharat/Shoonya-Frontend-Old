import React, { useContext, useEffect, useState, useCallback } from "react";
import { Col, Row, Card, Table, Button, Tabs, Checkbox } from "antd";
import { Link } from "react-router-dom";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import { useNavigate, useParams } from "react-router-dom";
import { getTasks } from "../../api/ProjectDashboardAPI";
import { getProject, getProjectMembers } from "../../api/ProjectAPI";
import moment from "moment";
import {
  getColumnNames,
  getDataSource,
  getVariableParams,
} from "./TasksTableContent";
import { message } from "antd";
import axiosInstance from "../../utils/apiInstance";
import UserContext from "../../context/User/UserContext";
import useFullPageLoader from "../../hooks/useFullPageLoader";
import {MembersTab} from './MembersTab';
import "../../../src/App.css";

const { TabPane } = Tabs;

function ProjectDashboard() {
  const userContext = useContext(UserContext);
  let navigate = useNavigate();
  const { project_id } = useParams();
  const [project, setProject] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [resultsource, setResultsource] = useState([]);
  const [variableParams, setVariableParams] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [date, setDate] = useState("");
  const initFilters = ["skipped", "accepted", "unlabeled"];
  const [selectedFilters, setFilters] = useState(initFilters);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const filters = [
    { label: "unlabeled", value: "unlabeled", },
    { label: "skipped", value: "skipped", },
    { label: "accepted", value: "accepted", },
  ];
  const [selectedDate, setselectedDate] = useState("");
  const [hideshow, sethideshow] = useState(false);
  const [selectstart, setselectstart] = useState("");
  const [selectend, setselectend] = useState("");
  const [apidata, setapidata] = useState("");
  const [color, setColor] = useState("");
  const DEFAULT_PAGE_SIZE = 10;

  useEffect(() => {
    localStorage.setItem('selectedDate', JSON.stringify(selectedDate));
  }, [selectedDate]);

  const hideshowdiv = () => {
    sethideshow(true)
  }

  function handleTableChange() {
    showLoader();
    getTasks(project_id, pagination.current, pagination.pageSize, selectedFilters).then((res) => {
      pagination.total = res.count;
      setPagination(pagination);
      setTasks(res.results);
      hideLoader();
    });
  }

  function handleFilterChange(checkedValue) {
    if (checkedValue.length === 0) checkedValue = initFilters;
    setFilters(checkedValue);
    getTasks(project_id, 1, pagination.pageSize, checkedValue).then((res) => {
      pagination.total = res.count;
      setPagination(pagination);
      setTasks(res.results);
      hideLoader();
    });
  }

  const items = JSON.parse(localStorage.getItem('selectedDate'));

  console.log(items, "itemsin prent")


  useEffect(() => {
    if (project_id) {
      getProject(project_id).then((res) => {
        setProject(res);
      });
      getTasks(project_id, 1, DEFAULT_PAGE_SIZE, selectedFilters).then((res) => {
        setTasks(res.results);
        pagination.total = res.count;
        pagination.current = 1;
        pagination.pageSize = DEFAULT_PAGE_SIZE;
        setPagination(pagination);
      });
      getProjectMembers(project_id).then((res) => {
        setProjectMembers(res["users"]);
      });
    }
  }, [project_id]);

  useEffect(() => {
    if (project) {
      getVariableParams(project).then((res) => {
        setVariableParams(res);
      });
    }
  }, [project]);

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
    if (dataSource) {
      getColumnNames(
        dataSource[0],
        project.project_mode,
        project.project_type
      ).then((res) => {
        for (let i = 0; i < res.length; i++) {
          res[i].title = res[i].title.replaceAll("_", " ");
        }
        setColumns(res);
      });
    }
    setLoading(false);
  }, [dataSource]);

  const labelAllTasks = async (project_id) => {
    try {
      let response = await axiosInstance.post(`/projects/${project_id}/next/`, {
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

  if (isLoading) {
    return <div>Loading...</div>;
  }


  const dateRange = {
    from_date: selectstart,
    to_date: selectend,
  }

  const onDisplayTable = async (id) => {
    try {
      let response = await axiosInstance.post(`/projects/${id}/get_analytics/`, dateRange);
      console.log(response)
      setResultsource(response.data)
      console.log(response.data, "data")
      return;
    } catch (error) {
      message.error(error);
    }

  };
  var keys = [];
  if (resultsource?.length > 0) {
    for (var key in resultsource[0]) {
      let obj = {}
      obj['title'] = camelize(key)
      obj['dataIndex'] = key
      obj['key'] = key
      keys.push(obj);
    }

  }
  console.log(keys)
  function camelize(str) {
    const arr = str.toString().split("_");
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    return arr.join(" ");

  }
  
  const onDateRange = (date) => {
    if (date === "Today") {
      sethideshow(false)
      setselectstart(moment().format("YYYY-MM-DD"))
      setselectend(moment().format("YYYY-MM-DD"))
      setselectedDate(`${moment().format("YYYY-MMM-DD")} - ${moment().format("YYYY-MMM-DD")}`)

    } if (date === "Yesterday") {
      sethideshow(false), setselectstart(moment().add(-1, "days").format("YYYY-MM-DD"))
      setselectend(moment().add(-1, "days").format("YYYY-MM-DD"))
      setselectedDate(`${moment().add(-1, "days").format("YYYY-MMM-DD")} - ${moment().add(-1, "days").format("YYYY-MMM-DD")}`)

     
    } if (date === "LastWeek") {
      sethideshow(false)
      setselectstart(moment().subtract(1, "weeks").startOf("week").format("YYYY-MM-DD"))
      setselectend(moment().subtract(1, "weeks").endOf("week").format("YYYY-MM-DD"))
      setselectedDate(`${moment().subtract(1, "weeks").startOf("week").format("YYYY-MMM-DD")} - ${moment().subtract(1, "weeks").endOf("week").format("YYYY-MMM-DD")}`)
    }
    if (date === "ThisWeek") {
      sethideshow(false)
      setselectstart(moment().subtract(1, "weeks").startOf("week").format("YYYY-MM-DD"))
      setselectend(moment().subtract(1, "weeks").endOf("week").format("YYYY-MM-DD"))
      setselectedDate(`${moment().startOf("week").format("YYYY-MMM-DD")} - ${moment().endOf("week").format("YYYY-MMM-DD")}`)
    }
    if (date === "Thismonth") {
      sethideshow(false)
      setselectstart(moment().startOf("month").format("YYYY-MM-DD"))
      setselectend(moment().endOf("month").format("YYYY-MM-DD"))
      setselectedDate(`${moment().startOf("month").format("YYYY-MMM-DD")} - ${moment().endOf("month").format("YYYY-MMM-DD")}`)
    }
  }
  const styles = {
    
  backgroundColor  : color
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
            <Tabs>
              <TabPane tab="Tasks" key="1">
                {project.project_mode == "Annotation" ? (
                  project.is_published ? (
                    <div style={{ display: "inline-flex", width: "49%", marginBottom: "1%", marginRight: "1%" }}>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          labelAllTasks(project_id);
                        }}
                        type="primary"
                        style={{ width: "100%" }}
                      >
                        Start Labelling Now
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="primary"
                      style={{ width: "49%", marginBottom: "1%", marginRight: "1%" }}
                    >
                      Disabled
                    </Button>
                  )
                ) : (
                  <Button type="primary">
                    <Link to={`/add-collection-data/${project.id}`}>
                      Add New Item
                    </Link>
                  </Button>
                )}
                {project.project_mode == "Annotation" ? (
                  <div style={{ display: "inline-flex", width: "50%", justifyContent: "space-evenly" }}>
                    Filter by:
                    <Checkbox.Group
                      options={filters}
                      value={selectedFilters}
                      onChange={handleFilterChange}
                    />
                  </div>
                ) : (<div></div>)
                }
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
                <Row>
                  <Col>  <Title level={5}>Select date range</Title></Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <div style={{ margin: "10px", display: "flex" }}>
                      <div style={{ position: 'relative', width: "80%" }}>
                        <div className="selectedDate" onClick={hideshowdiv}  style={{ borderBottom: '1px solid #000', padding: '5px', width: "100%", textAlign: "center", height: '40px', fontSize: "18px",   }}> {selectedDate}</div>
                        {hideshow ?
                          <div style={{ position: 'absolute', top: '40px', left: '5px', zIndex: 8, backgroundColor: "#fff", boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', padding: '10px', cursor: "pointer","&:hover": { background: "#efefef"
                          } }} className="dateptions">
                            <p  className="dateRange"   onClick={(e) => { onDateRange("Today") }}>Today</p>
                            <p   className="dateRange"   onClick={(e) => { onDateRange("Yesterday") }}>Yesterday</p>
                           <p   className="dateRange"   onClick={(e) => { onDateRange("ThisWeek") }}>ThisWeek</p>
                            <p   className="dateRange"  onClick={(e) => { onDateRange("LastWeek") }}>LastWeek</p>
                            <p   className="dateRange"   onClick={(e) => { onDateRange("ThisMonth") }}>ThisMonth</p>
                          </div>
                          : ' '}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>

                    <Button
                      onClick={() => onDisplayTable(project_id)}
                      type="primary"
                      style={{ width: "15%", margin: "20px 10px 10px 10px" }}
                    >
                      Submit
                    </Button>
                  </Col>
                </Row>
                {/* <Row>
                  <Col >
                    <Title level={3} style={{ margin: "50px 10px 10px 10px" }}  >
                      PROJECT REPORT
                    </Title>
                  </Col>
                </Row> */}
                <Table 
                  columns={keys}
                  dataSource={resultsource}
                />
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
