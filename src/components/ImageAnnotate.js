import React, { useState, useEffect } from "react";
import ReactImageAnnotate from "react-image-annotate";

// Initial data for annotated images
const initData = [
  {
    src: "",
    name: "",
    regions: [],
    annotations: [],
  },
];

const ImageAnnotate = ({
  images,
  annotations,
  updateAnnotations,
  onExit,
  setReqAnnotations,
}) => {
  const [annotatedImages, setAnnotatedImages] = useState(initData);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (images.length > 0) {
      setAnnotatedImages(
        images.map((image, index) => ({
          src: image.src,
          name: `Image ${index + 1}`,
          regions: [],
          annotations: annotations[index] || [],
        }))
      );
    }
  }, [images, annotations]);

  // Function to handle annotation change

  const handleAnnotationChange = (newAnnotations, imageIndex) => {
    const updatedAnnotations = [...annotations];
    updatedAnnotations[imageIndex] = newAnnotations;
    updateAnnotations(updatedAnnotations);
    const newArray = newAnnotations.map((annotation) => {
      const coordinates = annotation.regions.map((region, key) => ({
        id: `box_coordinates_${key}`,
        xmin: region.x,
        xmax: region.x + region.w,
        ymin: region.y,
        ymax: region.y + region.h,
      }));

      const id = `${annotatedImages[imageIndex].name}_${Math.random()}`;

      return {
        id: id,
        name: annotatedImages[imageIndex].name,
        coordinates: coordinates,
      };
    });

    setReqAnnotations((prevAnnotations) => {
      const updatedArray = [...prevAnnotations];
      updatedArray[imageIndex] = newArray;
      return updatedArray;
    });
  };

  // Function to format annotations
  const onChange = (newAnnotations, imageIndex) => {
    const formattedAnnotations = newAnnotations.map((annotation) => {
      let coordinates;
      if (annotation.type === "box") {
        coordinates = {
          xmin: annotation.x,
          ymin: annotation.y,
          xmax: annotation.x + annotation.w,
          ymax: annotation.y + annotation.h,
        };
      }
      return {
        id: annotation.id,
        coordinates: coordinates,
      };
    });
    handleAnnotationChange(formattedAnnotations, imageIndex);
  };

  // Function to handle exit action
  const handleExit = (region) => {
    setNewImages(region.images);
    onExit(newImages);
  };

  return (
    <div>
      {!!annotatedImages[0].src && (
        <ReactImageAnnotate
          labelImages
          images={annotatedImages}
          enabledTools={["create-box"]}
          onChange={onChange}
          onExit={(region) => handleExit(region)}
          hideClone={true}
          hideSettings={true}
        />
      )}
    </div>
  );
};

export default ImageAnnotate;
