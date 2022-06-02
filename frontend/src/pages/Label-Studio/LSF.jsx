import React, { useContext, useState, useEffect, useRef } from "react";
import LabelStudio from "@heartexlabs/label-studio";
import "@heartexlabs/label-studio/build/static/css/main.css";
import { message } from "antd";
import {
  getProjectsandTasks,
  postAnnotation,
  updateTask,
  getNextProject,
  patchAnnotation,
  deleteAnnotation
} from "../../api/LSFAPI";
import UserContext from "../../context/User/UserContext";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import useFullPageLoader from "../../hooks/useFullPageLoader";

//used just in postAnnotation to support draft status update.
let task_status = "labeled";

const LabelStudioWrapper = () => {
  // we need a reference to a DOM node here so LSF knows where to render
  const rootRef = useRef();
  // this reference will be populated when LSF initialized and can be used somewhere else
  const lsfRef = useRef();
  const [labelConfig, setLabelConfig] = useState();
  const [taskData, setTaskData] = useState(undefined);
  const userContext = useContext(UserContext);
  const { project_id, task_id } = useParams();
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  function LSFRoot(
    rootRef,
    lsfRef,
    userContext,
    project_id,
    taskData,
    labelConfig,
    annotations,
    predictions
  ) {
    let load_time;
    let interfaces = [];
    if (predictions == null) predictions = [];

    // let annotationdata = annotations.length === 0? predictions: annotations
    // if(annotations.length == 0) annotations = predictions;

    if (taskData.task_status == "freezed") {
      interfaces = [
        "panel",
        // "update",
        // "submit",
        "skip",
        "controls",
        "infobar",
        "topbar",
        "instruction",
        // "side-column",
        "annotations:history",
        "annotations:tabs",
        "annotations:menu",
        "annotations:current",
        // "annotations:add-new",
        "annotations:delete",
        // "annotations:view-all",
        "predictions:tabs",
        "predictions:menu",
        // "auto-annotation",
        "edit-history",
      ];
    } else {
      interfaces = [
        "panel",
        "update",
        "submit",
        "skip",
        "controls",
        "infobar",
        "topbar",
        "instruction",
        // "side-column",
        "annotations:history",
        "annotations:tabs",
        "annotations:menu",
        "annotations:current",
        // "annotations:add-new",
        "annotations:delete",
        // "annotations:view-all",
        "predictions:tabs",
        "predictions:menu",
        // "auto-annotation",
        "edit-history",
      ];
    }

    if (rootRef.current) {
      lsfRef.current = new LabelStudio(rootRef.current, {
        /* all the options according to the docs */
        config: labelConfig,

        interfaces: interfaces,

        user: {
          pk: userContext.user.id,
          firstName: userContext.user.first_name,
          lastName: userContext.user.last_name,
        },

        task: {
          annotations: annotations,
          predictions: predictions,
          id: taskData.id,
          data: taskData.data,
        },

        onLabelStudioLoad: function (ls) {
          var c = ls.annotationStore.addAnnotation({
            userGenerate: true,
          });
          ls.annotationStore.selectAnnotation(c.id);
          load_time = new Date();
        },
        onSubmitAnnotation: function (ls, annotation) {
          showLoader();
          if (taskData.task_status != "freezed") {
            postAnnotation(
              annotation.serializeAnnotation(),
              taskData.id,
              userContext.user.id,
              load_time,
              annotation.lead_time,
              task_status
            )
          }
          else message.error("Task is freezed");

          if (localStorage.getItem("labelAll"))
            getNextProject(project_id, taskData.id).then((res) => {
              hideLoader();
              window.location.href = `/projects/${project_id}/task/${res.id}`;
            })
          else {
            hideLoader();
            window.location.reload();
          }
        },

        onSkipTask: function () {
          showLoader();
          updateTask(taskData.id).then(() => {
            getNextProject(project_id, taskData.id).then((res) => {
              hideLoader();
              window.location.href = `/projects/${project_id}/task/${res.id}`;
            });
          })
        },

        onUpdateAnnotation: function (ls, annotation) {
          if (taskData.task_status != "freezed") {
            showLoader();
            for (let i = 0; i < annotations.length; i++) {
              if (annotation.serializeAnnotation().id == annotations[i].result.id) {
                let temp = annotation.serializeAnnotation()

                for (let i = 0; i < temp.length; i++) {
                  if (temp[i].value.text) {
                    temp[i].value.text = [temp[i].value.text[0]]
                  }
                }
                patchAnnotation(
                  temp,
                  annotations[i].id,
                  load_time,
                  annotations[i].lead_time,
                  task_status
                ).then(() => {
                  hideLoader();
                  location.reload()
                });
              }
            }
          } else message.error("Task is freezed");
        },

        onDeleteAnnotation: function (ls, annotation) {
          for (let i = 0; i < annotations.length; i++) {
            if (annotation.serializeAnnotation().id == annotations[i].result.id)
              deleteAnnotation(
                annotations[i].id
              );
          }
        }
      });
    }
  }

  // we're running an effect on component mount and rendering LSF inside rootRef node
  useEffect(() => {
    showLoader();
    if (localStorage.getItem('rtl') === "true") {
      var style = document.createElement('style');
      style.innerHTML = 'input, textarea { direction: RTL; }'
      document.head.appendChild(style);
    }
    if (
      typeof labelConfig === "undefined" &&
      typeof taskData === "undefined" &&
      userContext.user
    ) {
      getProjectsandTasks(project_id, task_id).then(
        ([labelConfig, taskData, annotations, predictions]) => {
          // both have loaded!
          setLabelConfig(labelConfig.label_config);
          setTaskData(taskData.data);
          LSFRoot(
            rootRef,
            lsfRef,
            userContext,
            project_id,
            taskData,
            labelConfig.label_config,
            annotations,
            predictions
          );
          hideLoader();
        }
      );
    }
  }, [labelConfig, userContext]);

  const onDraftAnnotation = async () => {
    task_status = "draft";
    lsfRef.current.store.submitAnnotation();
  }


  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          value="Draft"
          type="danger"
          onClick={onDraftAnnotation}
          style={{minWidth: "160px", background: "white", borderColor:"green", color:"green"}}
        >
          Draft
        </Button>
      </div>
      <div className="label-studio-root" ref={rootRef}></div>
    </div>
  );
};

function LSF() {
  return (
    <div style={{ maxHeight: "100%", maxWidth: "90%" }}>
      <div style={{ maxWidth: "100%", display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "inline-flex" }}>
          <Button
            value="Back to Project"
            onClick={() => {
              localStorage.removeItem("labelAll");
              var id = window.location.href.split("/")[4];
              window.location.href = `/projects/${id}`;
            }}
          >
            Back to Project
          </Button>
        </div>
      </div>
      <LabelStudioWrapper />
    </div>
  );
}

export default LSF;
