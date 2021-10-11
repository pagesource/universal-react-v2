import { useContext, useState } from "react"
import { render } from "react-dom"
import { getContext } from "smart-context"

const SmartContextDemo = () => {
  const {
    state: { name },
    actions: { setName }
  } = useContext(getContext("nameContext"));
  return (<h1 data-testid='name'><div>{name}</div></h1>)
}
export default SmartContextDemo