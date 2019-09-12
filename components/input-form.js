import { useState } from "react"
import shortid from "shortid"

const InputForm = ({ initialValue, onChangeValue, label, id }) => {
  const [input, setInput] = useState(initialValue)

  return (
    <form
      onSubmit={ev => {
        ev.preventDefault()
        onChangeValue(input)
      }}
    >
      <label htmlFor={id}>{label}</label>
      <input id={id} value={input} onChange={ev => setInput(ev.target.value)} />
      <button type="submit">search!</button>
    </form>
  )
}

export default InputForm
