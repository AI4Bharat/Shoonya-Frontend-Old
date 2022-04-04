import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

const getColumnNames = async (data, project_id) => {
    if (data) {
        let cols = Object.keys(data);
        let columns = [];
        cols.forEach((value) => {
            let el = {}
            el['key'] = value;
            el['title'] = value[0].toUpperCase() + value.substring(1);
            el['dataIndex'] = value;
            columns.push(el);
        })
        return columns;
    }
}

const getDataSource = async (data, project_id) => {
    if (data) {
        data.forEach((value) => {
            value.data['key'] = value.id;
            value.data['actions'] = (
                <Link to={`/project/${project_id}/annotate/${value.id}`}>
                    <Button type="primary">
                        Annotate
                    </Button>
                </Link>
            );
        })
        const d = data.map(t => t.data);
        return d;
    }
}

export { getColumnNames, getDataSource }