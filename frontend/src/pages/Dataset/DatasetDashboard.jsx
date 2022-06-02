import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Title from "antd/lib/typography/Title";
import { Col, Row, Card, Table, Button, Checkbox, Popover } from "antd";
import useFullPageLoader from "../../hooks/useFullPageLoader";
import { fetchDataitems } from "../../api/DatasetAPI";
import { snakeToTitleCase } from "../../utils/stringConversions";

function DatasetDashboard() {
  const { dataset_id } = useParams();
  const [dataset, setDataset] = useState();
  const [columns, setColumns] = useState([]);
  const [checkOptions, setCheckOptions] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [trigger, setTrigger] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const excludeKeys = [
    "parent_data_id",
    "metadata_json",
    "instance_id_id",
    "datasetbase_ptr_id",
    "key",
  ];
  const DEFAULT_PAGE_SIZE = 10;

  useEffect(() => {
    if (dataset_id) {
      showLoader();
      fetchDataitems(dataset_id, 1, DEFAULT_PAGE_SIZE).then((res) => {
        setDataset(res.results);
        pagination.total = res.count;
        pagination.current = 1;
        pagination.pageSize = DEFAULT_PAGE_SIZE;
        setPagination(pagination);
        hideLoader();
      });
    }
  }, []);

  useEffect(() => {
    if (dataset?.length > 0) {
      let tempColumns = [];
      let tempCheckOptions = [];
      Object.keys(dataset[0]).forEach((key) => {
        if (!excludeKeys.includes(key)) {
          tempColumns.push({
            title: snakeToTitleCase(key),
            dataIndex: key,
            key: key,
          });
          tempCheckOptions.push({
            label: snakeToTitleCase(key),
            value: key,
          });
        }
      });
      setColumns(tempColumns);
      setCheckOptions(tempCheckOptions);
      setCheckedList(tempCheckOptions.map((option) => option.value));
    }
  }, [dataset]);

  const changeColumns = (checkedValues) => {
    setCheckedList(checkedValues);
    columns.forEach((column) => {
      if (checkedValues.includes(column.dataIndex)) {
        column.hidden = false;
      } else {
        column.hidden = true;
      }
    });
    setTrigger(trigger + 1);
    setColumns(columns);
  };

  function handleTableChange() {
    showLoader();
    fetchDataitems(dataset_id, pagination.current, pagination.pageSize).then((res) => {
      pagination.total = res.count;
      setPagination(pagination);
      setDataset(res.results);
      hideLoader();
    });
  }

  return (
    <>
      <Row style={{ width: "100%", height: "100%" }}>
        <Col span={1} />
        <Col
          span={22}
          style={{ width: "100%", rowGap: "0px", marginBottom: "20px" }}
        >
          <Card style={{ width: "100%" }}>
            <Title>Dataset Details</Title>
            <Popover
              content={
                <Checkbox.Group
                options={checkOptions}
                value={checkedList}
                onChange={changeColumns}
                />
              }
              title="Select Columns"
              trigger="click"
            >
              <Button
                style={{ margin: "auto", display: "block" }}
              >
                Filter Columns
              </Button>
            </Popover>
            
            {trigger && <Table
              columns={columns.filter((column) => !column.hidden)}
              dataSource={dataset}
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
              style={{ width: "100%" }}
            />}
          </Card>
        </Col>
        <Col span={1} />
      </Row>
      {loader}
    </>
  );
}

export default DatasetDashboard;
