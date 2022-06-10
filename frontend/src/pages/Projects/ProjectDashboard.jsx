import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { Col, Row, Card, Table, Button, Tabs, Radio, Select } from "antd";
import { Link } from "react-router-dom";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import { useNavigate, useParams } from "react-router-dom";
import { getTasks } from "../../api/ProjectDashboardAPI";
import { getProject, getProjectMembers } from "../../api/ProjectAPI";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getColumnNames,
  getDataSource,
  getVariableParams,
} from "./TasksTableContent";
import { message, Space, Input } from "antd";
import axiosInstance from "../../utils/apiInstance";
import UserContext from "../../context/User/UserContext";
import useFullPageLoader from "../../hooks/useFullPageLoader";
import { MembersTab } from "./MembersTab";
import "../../../src/App.css";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

function ProjectDashboard() {
  const pathName = window.location.pathname;
  const pageState = sessionStorage.getItem(pathName)
    ? JSON.parse(sessionStorage.getItem(pathName))
    : null;
  const defultvalue = `${moment().format("YYYY-MMM-DD")} - ${moment().format(
    "YYYY-MMM-DD"
  )}`;
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
  const [pagination, setPagination] = useState({});
  const [date, setDate] = useState("");
  const [selectedFilter, setFilter] = useState(
    pageState?.prevFilter ? pageState.prevFilter : "unlabeled"
  );
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [selectedAnnotator, setAnnotator] = useState("-1");
  const filters = [
    { label: "unlabeled", value: "unlabeled" },
    { label: "skipped", value: "skipped" },
    { label: "accepted", value: "accepted" },
    { label: "draft", value: "draft" },
  ];
  const [selectedDate, setselectedDate] = useState("");
  const [hideshow, sethideshow] = useState(false);
  const [show, setShow] = useState(false);
  const [selectstart, setselectstart] = useState("");
  const [selectend, setselectend] = useState("");
  const [apidata, setapidata] = useState("");
  const [color, setColor] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [currentTab, setTab] = useState(
    pageState?.prevTab ? pageState.prevTab : "1"
  );
  const DEFAULT_PAGE_SIZE = pageState?.prevPageSize ? pageState.prevPageSize : 10;
  const DEFAULT_PAGE_NUMBER = pageState?.prevPage ? pageState.prevPage : 1;

  const [searchFilters, setSearchFilters] = useState({});
  const searchInput = useRef(null);
  const notSearchable = ["status", "actions"];
  const [changePage, setChangePage] = useState(false);

  useEffect(() => {
    localStorage.setItem("selectedDate", JSON.stringify(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem("labellingMode", selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
    setselectedDate(defultvalue);
    setselectstart(moment().format("YYYY-MM-DD"));
    setselectend(moment().format("YYYY-MM-DD"));
  }, []);

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setselectstart(moment(start).format("YYYY-MM-DD"));
    setselectend(moment(end).format("YYYY-MM-DD"));
  };

  const hideshowdiv = () => {
    sethideshow(true);
  };

  const onDatepicker = () => {
    setShow(true);
  };

  const handleClose = () => {
    sethideshow(false);
    setShow(false);
  };
  const applyDate = () => {
    setselectedDate(
      `${moment(startDate).format("YYYY-MM-DD")} - ${moment(endDate).format(
        "YYYY-MM-DD"
      )}`
    );
    sethideshow(false);
    setShow(false);
  };

  function handleFilterChange(selectedValue) {
    showLoader();
    setFilter(selectedValue.target.value);
    getTasks(
      project_id,
      1,
      pagination.pageSize,
      selectedValue.target.value,
      Number(selectedAnnotator),
      searchFilters
    ).then((res) => {
      if (res.count === 0)
        message.info("No more tasks in this filter", [2]);
      pagination.total = res.count;
      setPagination(pagination);
      setTasks(res.results);
      hideLoader();
    });
  }

  function handleAnnotatorChange(selectedValue) {
    showLoader();
    setAnnotator(selectedValue);
    getTasks(
      project_id,
      1,
      pagination.pageSize,
      selectedFilter,
      Number(selectedValue),
      searchFilters
    ).then((res) => {
      pagination.total = res.count;
      setPagination(pagination);
      setTasks(res.results);
      hideLoader();
    });
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    showLoader();
    confirm();
    let newSearchFilters = searchFilters;
    searchFilters[dataIndex] = selectedKeys[0];
    setSearchFilters(newSearchFilters);
    getTasks(
      project_id,
      1,
      pagination.pageSize,
      selectedFilter,
      Number(selectedAnnotator),
      newSearchFilters
    ).then((res) => {
      pagination.total = res.count;
      setPagination(pagination);
      setTasks(res.results);
      hideLoader();
    });
  };

  const handleReset = (clearFilters, dataIndex, confirm) => {
    showLoader();
    let newSearchFilters = searchFilters;
    delete newSearchFilters[dataIndex];
    setSearchFilters(newSearchFilters);
    clearFilters();
    confirm();
    getTasks(
      project_id,
      1,
      pagination.pageSize,
      selectedFilter,
      Number(selectedAnnotator),
      newSearchFilters
    ).then((res) => {
      pagination.total = res.count;
      setPagination(pagination);
      setTasks(res.results);
      hideLoader();
    });
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, dataIndex, confirm)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchFilters[dataIndex] ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchFilters[dataIndex]]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const items = JSON.parse(localStorage.getItem("selectedDate"));

  console.log(items, "itemsin prent");

  useEffect(() => {
    if (project_id) {
      getProject(project_id).then((res) => {
        setProject(res);
      });
      getTasks(
        project_id,
        DEFAULT_PAGE_NUMBER,
        DEFAULT_PAGE_SIZE,
        selectedFilter,
        Number(selectedAnnotator),
        searchFilters
      ).then((res) => {
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
    if (dataSource?.length > 0) {
      showLoader();
      getColumnNames(
        dataSource[0],
        project.project_mode,
        project.project_type
      ).then((res) => {
        for (let i = 0; i < res.length; i++) {
          res[i].title = res[i].title.replaceAll("_", " ");
          if (!notSearchable.includes(res[i].dataIndex)) {
            res[i] = { ...res[i], ...getColumnSearchProps(res[i].dataIndex) };
          }
        }
        setColumns(res);
        hideLoader();
      });
    }
  }, [dataSource]);

  useEffect(() => {
    if (changePage) {
      showLoader();
      getTasks(
        project_id,
        pagination.current,
        pagination.pageSize,
        selectedFilter,
        Number(selectedAnnotator),
        searchFilters
      ).then((res) => {
        pagination.total = res.count;
        setPagination(pagination);
        setTasks(res.results);
        hideLoader();
      });
      setChangePage(false);
    }
  }, [changePage])

  const labelAllTasks = async (project_id) => {
    try {
      let urlString = `/projects/${project_id}/next/?task_status=${selectedFilter}`;
      if(searchFilters) {
        for (let key in searchFilters) {
            urlString += "&search_"+key.toLowerCase()+"="+searchFilters[key];
        }
      }
      let response = await axiosInstance.post(
        urlString,
        {
          id: project_id,
        }
      );
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

  const dateRange = {
    from_date: selectstart,
    to_date: selectend,
  };

  const onDisplayTable = async (id) => {
    try {
      let response = await axiosInstance.post(
        `/projects/${id}/get_analytics/`,
        dateRange
      );
      setResultsource(response.data);
      return;
    } catch (error) {
      message.error(error);
    }
  };
  var keys = [];
  if (resultsource?.length > 0) {
    for (var key in resultsource[0]) {
      let obj = {};
      obj["title"] = camelize(key);
      obj["dataIndex"] = key;
      obj["key"] = key;
      keys.push(obj);
    }
  }
  function camelize(str) {
    const arr = str.toString().split("_");
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    return arr.join(" ");
  }

  const onDateRange = (date) => {
    if (date === "Today") {
      sethideshow(false);
      setselectstart(moment().format("YYYY-MM-DD"));
      setselectend(moment().format("YYYY-MM-DD"));
      setselectedDate(
        `${moment().format("YYYY-MMM-DD")} - ${moment().format("YYYY-MMM-DD")}`
      );
    }
    if (date === "Yesterday") {
      sethideshow(false),
        setselectstart(moment().add(-1, "days").format("YYYY-MM-DD"));
      setselectend(moment().add(-1, "days").format("YYYY-MM-DD"));
      setselectedDate(
        `${moment().add(-1, "days").format("YYYY-MMM-DD")} - ${moment()
          .add(-1, "days")
          .format("YYYY-MMM-DD")}`
      );
    }
    if (date === "LastWeek") {
      sethideshow(false);
      setselectstart(
        moment().subtract(1, "weeks").startOf("week").format("YYYY-MM-DD")
      );
      setselectend(
        moment().subtract(1, "weeks").endOf("week").format("YYYY-MM-DD")
      );
      setselectedDate(
        `${moment()
          .subtract(1, "weeks")
          .startOf("week")
          .format("YYYY-MMM-DD")} - ${moment()
          .subtract(1, "weeks")
          .endOf("week")
          .format("YYYY-MMM-DD")}`
      );
    }
    if (date === "ThisWeek") {
      sethideshow(false);
      setselectstart(
        moment().subtract(1, "weeks").startOf("week").format("YYYY-MM-DD")
      );
      setselectend(
        moment().subtract(1, "weeks").endOf("week").format("YYYY-MM-DD")
      );
      setselectedDate(
        `${moment().startOf("week").format("YYYY-MMM-DD")} - ${moment()
          .endOf("week")
          .format("YYYY-MMM-DD")}`
      );
    }
    if (date === "ThisMonth") {
      sethideshow(false);
      setselectstart(moment().startOf("month").format("YYYY-MM-DD"));
      setselectend(moment().endOf("month").format("YYYY-MM-DD"));
      setselectedDate(
        `${moment().startOf("month").format("YYYY-MMM-DD")} - ${moment()
          .endOf("month")
          .format("YYYY-MMM-DD")}`
      );
    }
  };
  const styles = {
    backgroundColor: color,
  };

  window.onunload = function () {
    let newPageState = {
      prevPage: pagination.current,
      prevPageSize: pagination.pageSize,
      prevFilter: selectedFilter,
      prevTab: currentTab,
    };
    sessionStorage.setItem(pathName, JSON.stringify(newPageState));
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
            <Tabs defaultActiveKey={currentTab} onChange={(key) => setTab(key)}>
              <TabPane tab="Tasks" key="1">
                <Row gutter={[16, 16]}>
                  <Col span={9}>
                    {project.project_mode == "Annotation" ? (
                      <div
                        style={{
                          display: "inline-flex",
                          width: "100%",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                        }}
                      >
                        Filter by Status:
                        <Radio.Group
                          value={selectedFilter}
                          onChange={handleFilterChange}
                        >
                          {filters.map((filter, i) => (
                            <Radio.Button key={i} value={filter.value}>
                              {filter.label}
                            </Radio.Button>
                          ))}
                        </Radio.Group>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </Col>
                  <Col span={9}>
                    {(userContext.user?.role === 2 ||
                      userContext.user?.role === 3) &&
                    project.project_mode == "Annotation" ? (
                      <div
                        style={{
                          display: "inline-flex",
                          width: "100%",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        Filter by Annotators:
                        <Select
                          showSearch
                          value={selectedAnnotator}
                          placeholder="Select an annotator"
                          optionFilterProp="children"
                          onChange={handleAnnotatorChange}
                          style={{
                            flexGrow: 1,
                            marginLeft: "5%",
                            marginRight: "5%",
                          }}
                        >
                          <Select.Option value="-1">All</Select.Option>
                          {projectMembers
                            .filter((member) => member.role === 1)
                            .map((member, i) => (
                              <Select.Option key={i} value={member.id}>
                                {member.username}
                              </Select.Option>
                            ))}
                        </Select>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </Col>
                  {userContext.user?.role == 1 && (
                    <Col span={6}>
                      {project.project_mode == "Annotation" ? (
                        project.is_published ? (
                          <div
                            style={{
                              display: "inline-flex",
                              width: "100%",
                              marginBottom: "1%",
                              marginRight: "1%",
                              flexWrap: "wrap",
                            }}
                          >
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                labelAllTasks(project_id);
                              }}
                              type="primary"
                              style={{
                                width: "100%",
                                marginBottom: "1%",
                                marginRight: "1%",
                              }}
                            >
                              Start Labelling Now
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="primary"
                            style={{
                              width: "100%",
                              marginBottom: "1%",
                              marginRight: "1%",
                            }}
                          >
                            Disabled
                          </Button>
                        )
                      ) : (
                        <Button
                          type="primary"
                          style={{
                            width: "100%",
                            marginBottom: "1%",
                            marginRight: "1%",
                          }}
                        >
                          <Link to={`/add-collection-data/${project.id}`}>
                            Add New Item
                          </Link>
                        </Button>
                      )}
                    </Col>
                  )}
                </Row>
                <Table
                  pagination={{
                    total: pagination.total,
                    pageSize: pagination.pageSize,
                    showSizeChanger: pagination.total > DEFAULT_PAGE_SIZE,
                    onChange: (page, pageSize) => {
                      pagination.current = page;
                      pagination.pageSize = pageSize;
                      setChangePage(true);
                    },
                  }}
                  columns={columns}
                  dataSource={dataSource}
                />
              </TabPane>
              <TabPane tab="Members" key="2">
                <MembersTab projectMembers={projectMembers} />
              </TabPane>
              <TabPane tab=" Reports" key="3">
                <Row>
                  <Col>
                    {" "}
                    <Title level={5}>Select date range</Title>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <div style={{ margin: "10px", display: "flex" }}>
                      <div style={{ position: "relative", width: "100%" }}>
                        <div
                          className="selectedDate"
                          onClick={hideshowdiv}
                          style={{
                            borderBottom: "1px solid #000",
                            padding: "5px",
                            width: "100%",
                            textAlign: "center",
                            height: "40px",
                            fontSize: "18px",
                          }}
                          defaultValue="Today"
                        >
                          {" "}
                          {selectedDate}
                        </div>
                        {hideshow ? (
                          <div
                            style={{
                              position: "absolute",
                              top: "40px",
                              left: "5px",
                              zIndex: 8,
                              backgroundColor: "#fff",
                              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                              padding: "10px",
                              cursor: "pointer",
                              "&:hover": {
                                background: "#efefef",
                              },
                            }}
                            className="dateptions"
                          >
                            <div
                              style={{
                                float: "left",
                                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                              }}
                            >
                              <p
                                className="dateRange"
                                onClick={(e) => {
                                  onDateRange("Today");
                                }}
                              >
                                Today
                              </p>
                              <p
                                className="dateRange"
                                onClick={(e) => {
                                  onDateRange("Yesterday");
                                }}
                              >
                                Yesterday
                              </p>
                              <p
                                className="dateRange"
                                onClick={(e) => {
                                  onDateRange("ThisWeek");
                                }}
                              >
                                This Week
                              </p>
                              <p
                                className="dateRange"
                                onClick={(e) => {
                                  onDateRange("LastWeek");
                                }}
                              >
                                Last Week
                              </p>
                              <p
                                className="dateRange"
                                onClick={(e) => {
                                  onDateRange("ThisMonth");
                                }}
                              >
                                This Month
                              </p>
                              <p className="dateRange" onClick={onDatepicker}>
                                Custom Range
                              </p>
                              <button
                                style={{
                                  backgroundColor: "green",
                                  color: "white",
                                  border: "1px solid white",
                                }}
                                onClick={applyDate}
                              >
                                Apply
                              </button>
                              <button
                                style={{ border: "1px solid white" }}
                                onClick={handleClose}
                              >
                                Cancel
                              </button>
                            </div>

                            {show ? (
                              <div
                                style={{ float: "left", marginLeft: "20px" }}
                              >
                                {" "}
                                <DatePicker
                                  selected={startDate}
                                  onChange={onChange}
                                  startDate={startDate}
                                  endDate={endDate}
                                  selectsRange
                                  inline
                                />
                              </div>
                            ) : (
                              " "
                            )}
                          </div>
                        ) : (
                          " "
                        )}
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
                  style={{ margin: "80px 10px 10px 10px" }}
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
