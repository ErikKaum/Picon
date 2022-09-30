import React, { useState, useEffect } from "react"
import { base64ToArrayBuffer, encode, decode, addModifiers, modifier } from "../lib/utils";


const Prompt = ({inputPrompt, setInputPrompt, styleModifiers, user, customModifiers}: {inputPrompt: string, setInputPrompt: any, styleModifiers: modifier[] | undefined, user: any, customModifiers: modifier[] | undefined}) => {

  const [buttonText, setButtonText] = useState(<p>Generate</p>)
  const [isLoading, setLoading] = useState(false)
  const [seconds, setSeconds] = useState(0);
  const [errorMsg, setErrorMsg] = useState('')

  function reset() {
    setSeconds(0);
    setLoading(false);
  }

  const handleChangle = (e: any) => {
    e.preventDefault(e)
    setInputPrompt(e.target.value)
  }

  useEffect(() => {
    let interval : any = null;
    if (isLoading) {
      interval = setInterval(() => {
        if (seconds > 20) {
          setErrorMsg('Cold start required, this will exceptionally take 1-3min')
        }    
        setSeconds(seconds => seconds + 0.1);
      }, 100);
    } else if (!isLoading && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isLoading, seconds]);

  const checkUser = (user: any) => {
    if (user.user === null) {
      setErrorMsg('Need to be logged in to generate. Log in button is in the down right corner.')
      return false
    } else if (user.user.user.user.emailVerified === false) {
      setErrorMsg('Email needs to be verified to generate')
      return false
    } else {
      return true
    }
  }

  const generate = async() => {
    setButtonText(<div className="icon icon--spinner icon--spin"></div>)
    reset()
    setLoading(true)

    const okey = checkUser(user)
    if (!okey) {
      setButtonText(<p>Generate</p>)
      setLoading(false)    
      return
    }

    console.log(user)

    const fullInput = addModifiers(inputPrompt, styleModifiers, customModifiers)
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
      setButtonText(<p>Generate</p>)
      setLoading(false)  
    } else if (res.status === 409) {
      setErrorMsg('You have exeeded the allowed number of image generations')
    } else if (res.status === 401) {
      setErrorMsg('Error in authorizing user')
    } else if (res.status === 408) {
      setErrorMsg('Timeout, try to generate again')
    }
    setButtonText(<p>Generate</p>)
    setLoading(false)  
  }

  return(
    <div className="flex flex-col w-full p-5">
      <div className="flex h-28 flex-col space-y-2 mb-2">
        <p className="type type--bold">Write what you want to see:</p>
        <textarea onChange={(e) => {handleChangle(e)}} rows={3} className="h-full input__field" placeholder="A monkey flying a space ship" value={(inputPrompt.length > 0 ? inputPrompt : "")}></textarea>
      </div>
      
      <div className="flex items-center pb-5">
        <button onClick={generate} className="flex mr-2 w-1/4 justify-center items-center button button--primary">{buttonText}</button>
        {seconds !== 0 &&
        <p className="type">{seconds.toFixed(1)} sec</p>}
      </div>
      <p className="type">{errorMsg}</p>
    </div>
  )

}


export default Prompt