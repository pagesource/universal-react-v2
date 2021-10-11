import { useContext, useState } from "react"
import { render } from "react-dom"

export const Context = React.createContext('default')

export const ContextDemo = () => {
    const { value } = useContext(Context);
    return (<h1 data-testid='value'><div>{value}</div></h1>)
}
