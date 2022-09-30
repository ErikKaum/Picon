import React, { useEffect, useState } from "react"
import { signOut } from "../lib/auth"

const Footer = ({user, setUser, renderLogin, setRenderLogin}:{user: any, setUser: any, renderLogin: any, setRenderLogin: any}) => {

  const [loggedIn, setLoggedIn] = useState(false);
  
  useEffect(() => {
    if (user.user !== null) {
      setLoggedIn(true) 
    }
  },[user])

  const setText = () => {
    if (loggedIn) {
      return <p>Log out</p>
    } else {
      return <p>Log in</p>
    }
  }

  const handleClick = () => {
    if (loggedIn) {
      handleSignOut()
    } else {
      handleSignIn()
    }
  }
  const handleSignOut = () => {
    signOut()
    setUser({user: null})
    setLoggedIn(false)
  }
  const handleSignIn = () => {
    setRenderLogin(true)
  }

    
  return(
    <div className="flex p-2 border-t w-full items-center justify-between">
      <div className="flex items-center space-x-2">
        {/* <a className="rounded-md type hover:transition-all delay-150 hover:bg-indigo-50 py-1 px-2" href="mailto:support@picon.im">contact</a>
        <button className="rounded-md type hover:transition-all delay-150 hover:bg-indigo-50 py-1 px-2">report a bug</button> */}
      </div>

      <button className="rounded-md type hover:transition-all delay-150 hover:bg-indigo-50 py-1 px-2" onClick={handleClick}>{setText()}</button>
    </div>

  )
}

export default Footer