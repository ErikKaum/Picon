import React, { useState } from "react"
import { decode, encode } from "../lib/utils"

interface image {
    gallery: string,
    grid: boolean,
    height: number,
    id: string,
    model: string,
    prompt: string,
    promptid: string,
    seed: string,
    src: string,
    srcSmall: string,
    width: number,
}

const Search = ({user}: {user: any}) => {
  const [searchString, setSearchString] = useState('')
  const [images, setImages] = useState<image[]>()
  const [placeholder, setPlaceholder] = useState([1,2,3,4,5,6])
  const [loading, setLoading] = useState(false)

  const makeSearch = async() => {
    setImages([])
    setLoading(true)
    
    const userId = user?.creds?.uid ? user.creds.uid : 'undefined';
    const body = JSON.stringify({query: searchString, userId: userId})
    const res = await fetch(`http://localhost:5001/stablehelper-51218/us-central1/getLexicaQuery`, {
      method: 'POST',
      body: body
    })

    const data = await res.json()
    setImages(data?.images)
    setLoading(false)
  }
  const handleChangle = (e:any) => {
    e.preventDefault()
    setSearchString(e.target.value)
  }
  
  const addToCanvas = async (imgUrl: string, imgPrompt: string, width: number, height: number) => {
    const fullInput = imgPrompt
    const res = await fetch(imgUrl)
    await fetch('http://localhost:5001/stablehelper-51218/us-central1/getLexicaImage')
    const data = await res.blob()
  
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    
    const imgData = await decode(canvas, context, data, width, height)
    const newBytes = await encode(canvas, context, imgData)
    window.parent.postMessage({pluginMessage: {type: 'image', newBytes, fullInput, width, height}}, '*')
  }

  return(
    <div className="flex flex-col w-full p-5">
      <div className="flex flex-col space-y-2 border-b pb-2">
        <p className="type type--bold">What does this search?</p>
        <p className="type">This searches the Lexica Stable Diffusion database.
        You are welcome to use this feature even if you don't have an account.
        <br></br><br></br> Note that the modifiers <strong>are not</strong> applied in this search.
        </p>
      </div>

      <div className="flex flex-col space-y-2 pt-5 pb-2">
        <p className="type type--bold">Search for an image:</p>
        <textarea onChange={(e) => {handleChangle(e)}} rows={2} className="h-9 input__field" placeholder="A monkey flying a space ship"></textarea>
      </div>
      
      <div className="flex items-center pb-5">
        <button onClick={makeSearch} className="flex mr-2 w-1/4 justify-center items-center button button--primary">Search</button>
      </div>

      <div className="flex w-full space-x-2">
        
        <div className="flex flex-col w-1/2 space-y-1">
          {images && images.slice(0,25).map((image) => {
          return(
            <div className="flex group relative w-full h-full rounded-md">
              <img className="rounded-md" src={image?.srcSmall}></img>
              <div className="hidden absolute w-full h-full group-hover:flex flex-col z-10 rounded-md">
                <div
                  onClick={() => addToCanvas(image?.src, image?.prompt, image?.width, image?.height)}
                  className="flex hover:cursor-pointer w-full h-1/2 justify-center items-center bg-slate-50 opacity-50">
                  <p className="">Add to canvas</p>
                </div>
                <div className="flex flex-col overflow-hidden w-full p-2 h-1/2 items-center bg-transparent-50">
                  <p className="type break-words">{image?.prompt.slice(0,100) +"..."}</p>
                </div>
              </div>
            </div>
          )
          })}
          {loading && placeholder.map((item) => {
            return(
              <div className="bg-slate-50 relative animate-pulse w-40 h-40 rounded-md"></div>
            )
          })}
        </div>
        
        <div className="flex flex-col w-1/2 space-y-1">
          {images && images.slice(25,50).map((image) => {
          return(
            <div className="flex group relative w-full h-full rounded-md">
              <img className="rounded-md" src={image?.srcSmall}></img>
              <div className="hidden absolute w-full h-full group-hover:flex flex-col z-10 rounded-md">
                <div
                  onClick={() => addToCanvas(image?.src, image?.prompt, image?.width, image?.height)}
                  className="flex hover:cursor-pointer w-full h-1/2 justify-center items-center bg-slate-50 opacity-50">
                  <p className="">Add to canvas</p>
                </div>
                <div className="flex flex-col overflow-hidden w-full p-2 h-1/2 items-center bg-transparent-40">
                  <p className="type break-words">{image?.prompt.slice(0,100) +"..."}</p>
                </div>
              </div>
            </div>
          )
          })}
          {loading && placeholder.map((item) => {
          return(
            <div className="bg-slate-50 relative animate-pulse w-40 h-40 rounded-md"></div>
          )
          })}
        </div>

      </div>

    </div>
  )
}

export default Search