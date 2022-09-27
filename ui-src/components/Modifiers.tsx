import React, { useState } from "react"

interface modifier {
  name : string,
  checked: boolean
}

const Modifiers = ({inputPrompt, setInputPrompt, styleModifiers, setStyleModifiers}: {inputPrompt: string, setInputPrompt: any, styleModifiers: modifier[] | undefined, setStyleModifiers: any}) => {
  const [savedText, setSavedText] = useState('Save Changes')

  const handleSubmit = (e: any) => {
    e.preventDefault()
    parent.postMessage({pluginMessage : {type: 'saveModifiers', styleModifiers}},'*')
    setSavedText('Saved')
  }
  
  const handleClick = (e: any, name: string, checked: boolean ,index: number) => {
    const newModifier : modifier = {name: name, checked: !checked}
    setStyleModifiers([...styleModifiers!.slice(0, index), newModifier, ...styleModifiers!.slice(index+1)])
  }

  return(
    <div className="flex flex-col h-full w-full p-5 space-y-2">
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col space-y-3">
      <details className="type type--bold">
        <summary className="hover:cursor-pointer">Style modifiers</summary>
          <div className="grid grid-cols-3 px-2 pb-5 w-full h-full items-center">

            {styleModifiers!.map((item:modifier, index: number) => {
              return(
                <div className="flex items-center space-x-1">
                  <input onClick={(e) => handleClick(e, item.name, item.checked ,index)} id={item.name} checked={item.checked} type="checkbox" className="checkbox"></input>
                  <label className="type" htmlFor={item.name}>{item.name}</label>
                </div>   
              )
            })}
            
          </div>
      </details>

      {/* <details className="type type--bold">
        <summary>Image modifiers</summary>
      </details> */}

      <details className="type type--bold">
        <summary className="hover:cursor-pointer">Custom modifiers</summary>
        <div className="grid grid-cols-3 px-2 pb-5 w-full h-full items-center">
          <div className="flex items-center">
            <p className="type">coming soon...</p>
          </div>
        </div>
      </details>

      <input className="flex w-1/3 justify-center items-center button button--secondary" type="submit" value={savedText}></input>
      </form>


    </div>
  )

}

export default Modifiers


