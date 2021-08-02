import React, { useContext } from "react";
import ImageDisplay from "./imageDisplay";
import ImageContext from "./imageContext";

const App = () => {
  const state = useContext(ImageContext);
  return (
    <ImageContext.Provider value={state}>
      <ImageDisplay />
      <div>Hello</div>
    </ImageContext.Provider>
  );
};

export default App;
