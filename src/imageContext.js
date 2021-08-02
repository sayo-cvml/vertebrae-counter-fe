import React from "react";

const sayHello = (text) => {
    console.log(text)
}

const ImageContext = React.createContext({data: ["Hello"], func: sayHello})
export default ImageContext;