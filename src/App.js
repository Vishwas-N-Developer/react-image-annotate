import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import ImageAnnotate from "./components/ImageAnnotate";
import AnnotationList from "./components/AnnotationList";

// Initial data for images
const initData = [
  {
    src: "",
    name: "",
    regions: [],
    annotations: [],
  },
];

function App() {
  const [images, setImages] = useState(initData);
  const [updatedRegions, setUpdatedRegions] = useState([]);
  const [reqAnnotations, setReqAnnotations] = useState([]);

  // Function to fetch images from the api
  const getImages = async () => {
    try {
      // Fetching endpoint from the .env file
      const response = await axios.get(process.env.REACT_APP_URL);
      const data = response.data.slice(0, 5);
      const newData = data.map((item, index) => {
        const key = `annotations_${index + 1}`;
        const annotationsString = localStorage.getItem(key);

        let annotations = [];
        if (annotationsString) {
          try {
            // Parsing stored annotations from localStorage
            annotations = JSON.parse(annotationsString);
          } catch (error) {
            console.error(`Error parsing JSON for key '${key}':`, error);
          }
        }
        return {
          id: index + 1,
          src: item.urls.regular,
          name: `Image ${index + 1}`,
          annotations: annotations,
        };
      });
      setImages(newData);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // Fetch images when the component mount
  useEffect(() => {
    getImages();
  }, []);

  // Function to update annotations
  const updateAnnotations = (updatedAnnotations) => {
    setImages((prevImages) =>
      prevImages.map((image, index) => ({
        ...image,
        annotations: updatedAnnotations[index],
      }))
    );

    // Storing updated annotations in localStorage
    updatedAnnotations.forEach((annotations, index) => {
      localStorage.setItem(
        `annotations_${index + 1}`,
        JSON.stringify(annotations)
      );
    });
  };

  // Function to handle exit action
  const onExit = (updatedAnnotations) => {
    setUpdatedRegions(updatedAnnotations);
  };

  const createCoordinatesArray = (updatedAnnotations) => {
    const newArray = updatedAnnotations.map((annotation) => {
      const coordinates = annotation.regions.map((region, key) => ({
        id: `box_coordinates_${key}`,
        xmin: region.x,
        xmax: region.x + region.w,
        ymin: region.y,
        ymax: region.y + region.h,
      }));

      const id = `${annotation.name}_${Math.random()}`;

      return {
        id: id,
        name: annotation.name,
        coordinates: coordinates,
      };
    });

    setReqAnnotations(newArray);
  };

  useEffect(() => {
    createCoordinatesArray(updatedRegions);
  }, [updatedRegions]);

  return (
    <div className="App">
      <h1>Image Annotation Tool</h1>
      {!!images[0]?.src && (
        <ImageAnnotate
          images={images.map((image) => ({ src: image?.src }))}
          annotations={reqAnnotations}
          setReqAnnotations={setReqAnnotations}
          updateAnnotations={updateAnnotations}
          onExit={onExit}
        />
      )}
      {updatedRegions.length > 0 && (
        <AnnotationList annotations={reqAnnotations} />
      )}
    </div>
  );
}

export default App;
