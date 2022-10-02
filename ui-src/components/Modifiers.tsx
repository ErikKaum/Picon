import React, { useEffect, useState } from "react"
import { modifier } from "../lib/utils"
import { getCustomModifers, saveCustomModifier } from "../lib/auth"

const Modifiers = ({user, styleModifiers, setStyleModifiers, customModifiers, setCustomModifiers, customModifiersState}: {user: any, styleModifiers: modifier[] | undefined, setStyleModifiers: any, customModifiers : modifier[] | undefined, setCustomModifiers: any, customModifiersState: modifier[] | undefined}) => {
  const [savedText, setSavedText] = useState('Save Changes')
  const [newCustomModifier, setNewCustomModifier] = useState('')

  useEffect(() => {
    const run = async() => {
      const customModifiersFromDb = await getCustomModifers(user.creds.uid)
      
      if (customModifiersState !== undefined) {
        customModifiersFromDb.forEach((dBitem) => (
          customModifiersState?.forEach((stateItem) => {
            if (dBitem.name === stateItem.name) {
              dBitem.checked = stateItem.checked
            }
          })
        ))
      } 
      setCustomModifiers(customModifiersFromDb)
    }
    run()
  },[])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    parent.postMessage({pluginMessage : {type: 'saveModifiers', styleModifiers}},'*')
    parent.postMessage({pluginMessage : {type: 'saveCustomModifiers', customModifiers}},'*')
    setSavedText('Saved')
  }

  const handleClickStyle = (e: any, name: string, checked: boolean ,index: number) => {
    const newModifier : modifier = {name: name, checked: !checked}
    setStyleModifiers([...styleModifiers!.slice(0, index), newModifier, ...styleModifiers!.slice(index+1)])
  }

  const handleClickCustom = (e: any, name: string, checked: boolean ,index: number) => {
    const newModifier : modifier = {name: name, checked: !checked}
    setCustomModifiers([...customModifiers!.slice(0, index), newModifier, ...customModifiers!.slice(index+1)])
  }


  const addModifier = async() => {
    if (newCustomModifier?.length === 0) {
      return
    }
    const toAppend : modifier = {name: newCustomModifier, checked: false}
    setCustomModifiers([...customModifiers!, toAppend])
    await saveCustomModifier(user.creds.uid, toAppend)
  }

  const handleChangle = (e: any) => {
    e.preventDefault()
    setNewCustomModifier(e.target.value)
  }

  return(
    <div className="flex flex-col h-full w-full p-5 space-y-2">
      <div className="flex flex-col space-y-3">
      <details className="type type--bold">
        <summary className="hover:cursor-pointer">Style modifiers</summary>
          <div className="grid grid-cols-3 px-2 pb-5 w-full items-center">

            {styleModifiers!.map((item:modifier, index: number) => {
              return(
                <div className="flex items-center space-x-1">
                  <input onClick={(e) => handleClickStyle(e, item.name, item.checked ,index)} id={item.name} checked={item.checked} type="checkbox" className="checkbox"></input>
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

        <div className="pb-2 flex flex-col pl-2 pt-3">
            <label className="type">Create you own modifier:</label>
            <div className="flex justify-center items-center space-x-1">
              <textarea onChange={(e) => {handleChangle(e)}} rows={1} className="h-9 input__field" placeholder="The imagination has no limit"></textarea>
              <button onClick={addModifier} className="button button--secondary">add</button>
            </div>
        </div> 

        <div className="grid grid-cols-3 px-2 pb-5 w-full items-center">

          {customModifiers && customModifiers!.map((item:modifier, index: number) => {
              return(
                <div className="flex items-center space-x-1">
                  <input onClick={(e) => handleClickCustom(e, item.name, item.checked ,index)} id={item.name} checked={item.checked} type="checkbox" className="checkbox"></input>
                  <label className="type" htmlFor={item.name}>{item.name}</label>
                </div>   
              )
            })}

        </div>
      </details>

      <button onClick={handleSubmit} className="flex w-1/3 justify-center items-center button button--secondary">{savedText}</button>
      </div>


    </div>
  )

}

export default Modifiers


