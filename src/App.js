import React, { useContext, useEffect } from "react";
import ImageDisplay from "./imageDisplay";
import ImageContext from "./imageContext";

const App = () => {
  const state = useContext(ImageContext);

  useEffect(() => {}, []);

  return (
    <ImageContext.Provider value={state}>
      <ImageDisplay />
    </ImageContext.Provider>
  );
};

export default App;
