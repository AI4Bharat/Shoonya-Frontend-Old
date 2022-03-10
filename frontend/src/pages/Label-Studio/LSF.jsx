import React, { useState, useEffect, useRef } from "react";
import LabelStudio from "@heartexlabs/label-studio";
import "@heartexlabs/label-studio/build/static/css/main.css";
const LabelStudioWrapper = (props) => {
    // we need a reference to a DOM node here so LSF knows where to render
    const rootRef = useRef();
    // this reference will be populated when LSF initialized and can be used somewhere else
    const lsfRef = useRef();
  
    const [labeltry, setLabeltry] = useState();
    const [path, setPath] = useState();
  
    // we're running an effect on component mount and rendering LSF inside rootRef node
    useEffect(() => {
      if (typeof labeltry === "undefined") {
        setLabeltry("Passaro");
      }
      if (typeof path === "undefined") {
        setPath(
          "https://htx-misc.s3.amazonaws.com/opensource/label-studio/examples/images/nick-owuor-astro-nic-visuals-wDifg5xc9Z4-unsplash.jpg"
        );
      }
      if (rootRef.current) {
        lsfRef.current = new LabelStudio(rootRef.current, {
          /* all the options according to the docs */
          config:
            `
        <View>
          <Image name="img" value="$image"></Image>
          <RectangleLabels name="tag" toName="img">
            <Label value="` +
            labeltry +
            `"></Label>
            <Label value="World"></Label>
          </RectangleLabels>
        </View>
      `,
  
          interfaces: [
            "panel",
            "update",
            "submit",
            "controls",
            "side-column",
            "annotations:menu",
            "annotations:add-new",
            "annotations:delete",
            "predictions:menu"
          ],
  
          user: {
            pk: 1,
            firstName: "Nelson",
            lastName: "Nunes"
          },
  
          task: {
            annotations: [],
            predictions: [],
            id: 1,
            data: {
              image: path
            }
          },
  
          onLabelStudioLoad: function (ls) {
            var c = ls.annotationStore.addAnnotation({
              userGenerate: true
            });
            ls.annotationStore.selectAnnotation(c.id);
          },
          onSubmitAnnotation: function (ls, annotation) {
            console.log(annotation.serializeAnnotation());
            setLabeltry("Leão");
            setPath(
              "https://i.pinimg.com/originals/1e/06/e1/1e06e107f0ca520aed316957b685ef5c.jpg"
            );
            console.log(labeltry);
          }
        });
      }
    }, [labeltry, path]);
    return <div className="label-studio-root" ref={rootRef} />;
  };

function LSF() {
  return (
    <div><LabelStudioWrapper /></div>
  )
}

export default LSF