import React from "react"
import { signOut } from "../lib/auth"

const NotVerified = ({setUser, setRenderLogin}:{setUser: any, setRenderLogin: any}) => {

  const regen = () => {
    signOut()
    setUser({user: null})
    setRenderLogin(true)  
  }

  return(
    <div className="w-full flex justify-center items-center border-b">
    <p className="type type--bold p-2">Email not verified.</p>
    <a onClick={regen} className="type type--bold" href="http://picon.im/account?regenerate=true" target='_blank'>Click here to verify</a>
    </div>
  )
}

export default NotVerified