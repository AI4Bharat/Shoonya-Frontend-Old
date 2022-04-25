import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

const getColumnNames = async (data, project_mode, project_type) => {
    if (data) {
        let cols = Object.keys(data);
        // console.log(cols)
        // console.log(project_type);
        if (project_type == "TranslationEditing") {
            cols.splice(0, 0, cols.splice(4, 1)[0]);
            cols.splice(4, 1);
        }
        else if (project_type == "OCRAnnotation") {
            cols.splice(1, 1);
            cols.splice(0, 0, cols.splice(1, 1)[0]);
        }

        let columns = [];
        cols.forEach((value) => {
            if (project_mode == 'Collection' && value == 'status') {
                return;
            }
            let el = {}
            el['key'] = value;
            el['title'] = value[0].toUpperCase() + value.substring(1);
            el['dataIndex'] = value;
            if (value == 'status') {
                el['filters'] = [
                    {
                        text: 'unlabeled',
                        value: 'unlabeled'
                    },
                    {
                        text: 'labeled',
                        value: 'labeled'
                    },
                    {
                        text: 'skipped',
                        value: 'skipped'
                    },
                    {
                        text: 'accepted',
                        value: 'accepted'
                    },
                    {
                        text: 'freezed',
                        value: 'freezed'
                    },
                    {
                        text: 'rejected',
                        value: 'rejected'
                    },

                ]
                el['onFilter'] = (value, record) => record.status == value;
            }
            columns.push(el);
        });
        return columns;
    }
}

const getDataSource = async (data, project_id, project_type, is_published) => {
    if (data) {
        data.forEach((value) => {
            value.data['key'] = value.id;
            value.data['status'] = value.task_status;

            value.data['actions'] = (
                <Button type="primary">
                    {is_published ?
                        <Link to={`/projects/${project_id}/task/${value.id}`}>
                            {project_type === "Annotation" ? "Annotate" : "Edit"}
                        </Link>
                        :
                        "Disabled"
                    }
                </Button>
            );
        })
        const d = data.map(t => t.data);
        return d;
    }
}

const getVariableParams = async (project) => {
    return project.variable_parameters;
}

export { getColumnNames, getDataSource, getVariableParams }