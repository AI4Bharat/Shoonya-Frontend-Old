import React, { useContext, useState, useEffect, useRef } from "react";
import LabelStudio from "@heartexlabs/label-studio";
import "@heartexlabs/label-studio/build/static/css/main.css";
import Navbar from "../../components/Layout/Navbar";
import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import { getProjectsandTasks, postAnnotations, postTasks, getNextProject, patchAnnotation } from "../../api/LSFTest";
import UserContext from "../../context/User/UserContext";
import { useParams } from "react-router-dom";

const LabelStudioWrapper = (props) => {
  // we need a reference to a DOM node here so LSF knows where to render
  const rootRef = useRef();
  // this reference will be populated when LSF initialized and can be used somewhere else
  const lsfRef = useRef();
  const [labelConfig, setLabelConfig] = useState();
  const [taskData, setTaskData] = useState(undefined);
  const userContext = useContext(UserContext);

  const { project_id, task_id } = useParams();

  // we're running an effect on component mount and rendering LSF inside rootRef node
  useEffect(() => {

    if (typeof labelConfig === "undefined" && typeof taskData === "undefined" && userContext.user) {

      getProjectsandTasks(project_id, task_id)
        .then(([labelConfig, taskData, annotations, predictions]) => {
          // both have loaded!
          setLabelConfig(labelConfig.label_config);
          setTaskData(taskData.data);
          LSFRoot(rootRef, lsfRef, userContext, project_id, taskData, labelConfig.label_config, annotations, predictions);

        })
    }
  }, [labelConfig,userContext]);
  return <div className="label-studio-root" ref={rootRef} />;
};

function LSFRoot(rootRef, lsfRef, userContext, project_id, taskData, labelConfig, annotations, predictions) {

  if (rootRef.current) {
    lsfRef.current = new LabelStudio(rootRef.current, {


      /* all the options according to the docs */
      config: labelConfig,

      interfaces: [
        "panel",
        "update",
        "submit",
        "skip",
        "controls",
        "infobar",
        "topbar",
        "instruction",
        "side-column",
        "annotations:history",
        "annotations:tabs",
        "annotations:menu",
        "annotations:current",
        // "annotations:add-new",
        "annotations:delete",
        'annotations:view-all',
        "predictions:tabs",
        "predictions:menu",
        "auto-annotation",
        "edit-history",
      ],

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
        console.log(userContext)
      },
      onSubmitAnnotation: function (ls, annotation) {
        console.log(annotation.serializeAnnotation());
        // console.log(userContext)
        postAnnotations(annotation.serializeAnnotation(), taskData.id, userContext.user.id)
        getNextProject(project_id)
        .then((res) => {
          window.location.href=`/projects/${project_id}/task/${res.id}`
        })
      },

      onSkipTask: function(){
        console.log("Skipped task");
        postTasks(taskData.id);
        console.log(taskData.id);
        getNextProject(project_id)
        .then((res) => {
          window.location.href=`/projects/${project_id}/task/${res.id}`
        })
      },

      onUpdateAnnotation: function(ls, annotation){
        console.log(annotations)
        patchAnnotation(annotation.serializeAnnotation())
      }
    });
  }
}


function LSF() {
  return (
    <div style={{ maxHeight: "100vh" }}>
      <Layout style={{ height: "100vh" }}>
        <Navbar />
        <Content
          style={{
            height: "100%",
          }}
        >
          <div style={{display: "flex", justifyContent: "left"}}>
          <button value="Back to Project" onClick={() => {
            var id = window.location.href.split("/")[4]
            window.location.href=`/projects/${id}`}}>Back to Dashboard</button>
          </div>
          <LabelStudioWrapper />
        </Content>
      </Layout>
    </div>
  );
}

export default LSF;
