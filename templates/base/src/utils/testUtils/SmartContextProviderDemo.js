import { WithContextProvider } from "smart-context";
import React from "react";
const initialState = {
    name: "Smart Context"
};


const actionsConfig = {
    setName: ["name"]
};

const displayName = "nameContext";

/* Configuration */
const config = {
    initialState,
    actionsConfig,
    displayName,
    debug: true,
};

const NameContextProvider = ({ children }) => {
    return (
        <>
            {children}
        </>
    )
}
export default WithContextProvider(NameContextProvider, [config]);