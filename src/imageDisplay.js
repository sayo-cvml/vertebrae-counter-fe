import { useState, useEffect } from "react";
import ImageContext from "./imageContext";
import Boundingbox from "react-bounding-box";
// import data from "./data";

const ImageDisplay = () => {
  const [images, setImages] = useState([]);
  //   const detections = data.detections;
  //   const boxes = detections.map((item) => {
  //     const box = item[1];
  //     const x = box[0] - box[2] / 2;
  //     const y = box[1] - box[3] / 2;
  //     const w = box[2];
  //     const h = box[3];
  //     return [x, y, w, h];
  //   });
  const boxes = [[12, 250, 100, 100]];
  const options = {
    colors: {
      normal: "rgba(255, 255, 255, 0.2)",
      selected: "rgba(255, 0, 0, 1)",
      unselected: "rgba(0, 255, 255, 1)",
    },
    style: {
      maxWidth: "80%",
      maxHeight: "90vh",
    },
  };

  useEffect(() => {
    console.log(images);
  }, [images]);

  const handleSelect = (e) => {
    setImages([...images, ...e.target.files]);
  };
  return (
    <ImageContext.Consumer>
      {({ data, func }) => (
        <div>
          {data.map((item) => (
            <h1>{item}</h1>
          ))}
          <input type="file" onChange={handleSelect} />

          {images.map((image, index) => (
            <div key={index}>
              <h1>{image.name}</h1>

              <Boundingbox
                image={URL.createObjectURL(image)}
                boxes={boxes}
                options={options}
              />
            </div>
          ))}
        </div>
      )}
    </ImageContext.Consumer>
  );
};
export default ImageDisplay;
