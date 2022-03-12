import React, { useState, useEffect, useRef } from "react";
import { DataManager } from "@heartexlabs/datamanager";


const DataManagerWrapper = (props) => {
    const rootRef = useRef();
    const dmRef = useRef();
  
    useEffect(() => {
      
      if (rootRef.current) {

        dmRef.current = new DataManager(rootRef.current, {
            root: document.getElementById("app"),
            toolbar: "actions columns filters ordering review-button label-button loading-possum error-box | refresh view-toggle",
            apiGateway: "http://localhost:8000/dataset",
            apiVersion: 2,
            apiMockDisabled: true,
            // apiHeaders: {
            //   Authorization: `Token ${LS_ACCESS_TOKEN}`,
            // },
            interfaces: {
                groundTruth: true,
            },
            labelStudio: {
                user: {
                pk: 1,
                firstName: "James",
                lastName: "Dean",
                },
            },
            table: {
                hiddenColumns: {
                explore: ["tasks:completed_at", "tasks:data"],
                },
                visibleColumns: {
                labeling: [
                    "tasks:id",
                    "tasks:was_cancelled",
                    "tasks:data.image",
                    "tasks:data.text",
                    "annotations:id",
                    "annotations:task_id",
                ],
                },
            }
        });
      }
    });
    return <div className="datamanger-test" ref={rootRef} />;
  };

function DataManagerTest() {
    return (
      <div><DataManagerWrapper /></div>
    )
  }
  
  export default DataManagerTest