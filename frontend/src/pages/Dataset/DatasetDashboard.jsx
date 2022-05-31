import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Title from "antd/lib/typography/Title";
import { Col, Row, Card, Table, Button, Checkbox, Popover } from "antd";
import useFullPageLoader from "../../hooks/useFullPageLoader";
import { getData } from "../../api/CreateProjectAPI";
import { snakeToTitleCase } from "../../utils/stringConversions";

function DatasetDashboard() {
  const { dataset_id } = useParams();
  const [dataset, setDataset] = useState();
  const [columns, setColumns] = useState([]);
  const [checkOptions, setCheckOptions] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [trigger, setTrigger] = useState(1);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const excludeKeys = [
    "parent_data_id",
    "metadata_json",
    "instance_id_id",
    "datasetbase_ptr_id",
    "key",
  ];

  useEffect(() => {
    if (dataset_id) {
      showLoader();
      getData(dataset_id, "TranslationPair").then((res) => {
        let key = 1;
        for (const data in res) {
          res[data].key = key;
          key++;
        }
        setDataset(res);
        hideLoader();
      });
    }
  }, []);

  useEffect(() => {
    if (dataset && dataset.length > 0) {
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
                style={{ float: "right" }}
              >
                Filter Columns
              </Button>
            </Popover>
            
            {trigger && <Table
              columns={columns.filter((column) => !column.hidden)}
              dataSource={dataset}
              pagination={false}
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
