import React from "react";

const AnnotationList = ({ annotations }) => {
  return (
    <div>
      {annotations[0]?.coordinates[0]?.id && (
        <div>
          <h2>Annotation List</h2>
          {annotations?.map((imageAnnotations, imageIndex) => (
            <div key={imageIndex}>
              <h4>{imageAnnotations.name}</h4>
              <div>
                {imageAnnotations?.coordinates?.map((annotation, key) => (
                  <div>
                    <div key={annotation.id}>
                      <h5>{`Box ${key + 1}`}</h5> xmin {annotation.xmin}
                      <br />
                      xmax {annotation.xmax}
                      <br />
                      ymin {annotation.ymin}
                      <br />
                      ymax {annotation.ymax}
                      <br />
                      {JSON.stringify(annotation.coordinates)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnotationList;
