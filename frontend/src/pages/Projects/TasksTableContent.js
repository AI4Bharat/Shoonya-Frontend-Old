import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

const getColumnNames = async (data, project_type) => {
    if (data) {
        let cols = Object.keys(data);
        let columns = [];
        cols.forEach((value) => {
            if (project_type == 'Collection' && value == 'status') {
                return;
            }
            let el = {}
            el['key'] = value;
            el['title'] = value[0].toUpperCase() + value.substring(1);
            el['dataIndex'] = value;
            if (value == 'status') {
                el['filters'] = [
                    {
                        text: 'UnLabel',
                        value: 'UnLabel'
                    },
                    {
                        text: 'Label',
                        value: 'Label'
                    }
                ]
                el['onFilter'] = (value, record) => record.status == value;
            }
            columns.push(el);
        });
        return columns;
    }
}

const getDataSource = async (data, project_id, project_type) => {
    if (data) {
        data.forEach((value) => {
            value.data['key'] = value.id;
            value.data['status'] = value.task_status;

            value.data['actions'] = (
                <Link to={`/projects/${project_id}/task/${value.id}`}>
                    <Button type="primary">
                        {project_type === "Annotation" ? "Annotate" : "Edit"}
                    </Button>
                </Link>
            );
        })
        const d = data.map(t => t.data);
        return d;
    }
}

export { getColumnNames, getDataSource }