import React, { useState, useEffect } from "react";
import { base64ToArrayBuffer, decode, encode, addModifiers, modifier, defaulModifiers } from "./lib/utils";
import { getNewToken, signOut, getVersion } from "./lib/auth";

import "figma-plugin-ds/dist/figma-plugin-ds.css";
import "./App.css"

import Header from "./components/Header";
import Settings from "./components/Settings";
import Modifiers from "./components/Modifiers";
import Prompt from "./components/Prompt";
import LogIn from "./components/LogIn";
import OldVersion from "./components/OldVersion";

const CURRENT_VERSION = 1

function App() {
  const [oldVersion, setOldVersion] = useState(false)
  const [user, setUser] = useState<any>({user: null})
  const [menu, setMenu] = useState(0)
  const [inputPrompt, setInputPrompt] = useState('');
  const [styleModifiers, setStyleModifiers] = useState<modifier[]>()

  const generate = async(input: String, inputModifiers: modifier[], user: object | any) => {
    const fullInput = addModifiers(input, inputModifiers)
    
    console.log(fullInput)

    // let's just work with any for now
    const body = { prompt: fullInput, token: user.creds.accessToken, uid: user.creds.uid}
    const res : any = await fetch('https://us-central1-stablehelper-51218.cloudfunctions.net/txt2img',{  
      method: 'POST',
      body: JSON.stringify(body)
    })
    if (res.status === 200) {
      const data = await res.json()    
      let img = data.modelOutputs[0].image_base64
      
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
    
      const imgArray = base64ToArrayBuffer(img)
      const imgData = await decode(canvas, context, imgArray)
      const newBytes = await encode(canvas, context, imgData)
      
      window.parent.postMessage({pluginMessage: {type: 'image', newBytes}}, '*')
    } else if (res.status === 409) {
      window.parent.postMessage({pluginMessage: {type: 'tooManyError'}}, '*')
    } else if (res.status === 401) {
      window.parent.postMessage({pluginMessage: {type: 'unAuthError'}}, '*')
    } else if (res.status === 408) {
      window.parent.postMessage({pluginMessage: {type: 'timeOutError'}}, '*')  
    }
  }
  
  useEffect(() => {    
    window.onmessage = async event => {
      const data = event.data.pluginMessage

      if (data.user !== undefined) {
        const newCreds = await getNewToken(data.user)
        const updatedUser = {
          ...data.user, creds : {
            accessToken : newCreds.accessToken,
            refreshToken: newCreds.refreshToken,
            uid: newCreds.uid   
          }
        }
        setUser(updatedUser)
        parent.postMessage({pluginMessage: {type: 'user', updatedUser}},'*')
      }

      if (data.styleModifiers !== undefined && data.styleModifiers.length <= defaulModifiers.length) {
        setStyleModifiers(data.styleModifiers)
      } else {
        setStyleModifiers(defaulModifiers)  
      }

      if (data.parameters !== undefined) {
        generate(data.parameters.prompt, data.styleModifiers, data.user)
      }
    }
  }, [user]);

  useEffect(() => {
    const checkVersion = async() => {
      const version: number = await getVersion()
      if (CURRENT_VERSION < version) {
        setOldVersion(true)
      }
    }
    checkVersion()
  },[])

  const handleSignOut = () => {
    signOut()
    setUser({user: null})
  }

  return (
    <>
      {user.user === null && <LogIn setUser={setUser}/>}
      {user.user !== null &&
      <main>
        {oldVersion && <OldVersion />}
        <Header menu={menu} setMenu={setMenu} />
        {menu === 0 && <Prompt inputPrompt={inputPrompt} setInputPrompt={setInputPrompt} styleModifiers={styleModifiers} user={user}/>}
        {menu === 1 && <Modifiers inputPrompt={inputPrompt} setInputPrompt={setInputPrompt} styleModifiers={styleModifiers} setStyleModifiers={setStyleModifiers}/>}
        {menu === 2 && <Settings user={user.user}/>}
        <div className="p-5">
          <button className="type button button--secondary" onClick={handleSignOut}>Log out</button>
        </div>
      </main>
      }
    </>
  );
}

export default App;