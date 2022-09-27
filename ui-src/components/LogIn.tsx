import React, { useState } from "react"
import { signIn } from "../lib/auth"
import picon from '../assets/picon.png' 

const LogIn = ({setUser}: {setUser: any}) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(<p>Log in</p>)
  const [createLoading, setCreateLoading] = useState(<p>Create account</p>)
  const [errorMessage, setError] = useState<String | undefined>('')
  
  const checkInput = () => {
    if (email.length === 0 || password.length === 0) {
        setError('Email or password not set')
        setLoginLoading(<p>Log in</p>)
        setCreateLoading(<p>Create account</p>)
        throw new Error('email or password not set')
    }
  }

  const handleLogin = async() => {
    setLoginLoading(<div className="icon icon--spinner icon--spin"></div>)
    checkInput()

    try {
      const res = await signIn(email, password)
      const user = {user : JSON.parse(JSON.stringify(res))}
      const updatedUser = {
        user: user,
        creds : {
          accessToken : user.user.user.stsTokenManager.accessToken,
          refreshToken: user.user.user.stsTokenManager.refreshToken,
          uid: user.user.user.uid   
        }
      }
      window.parent.postMessage({pluginMessage: {type: 'user', updatedUser}}, '*')
      setUser(updatedUser)
    } catch(e) {
      setError(e?.toString())
    }
    
    setLoginLoading(<p>Log in</p>)
  }
  const handleCreateAccount = () => {
    window.open('http://www.picon.im/login', '_blank')
  }

  const handleChangleEmail = (e: any) => {
    e.preventDefault(e)
    setEmail(e.target.value)
  }

  const handleChanglePassw = (e: any) => {
    e.preventDefault(e)
    setPassword(e.target.value)
  }
    
  return(
    <div className="flex flex-col items-center h-full w-full p-5">
      
      <h1 className="type type--xlarge type--bold mb-2">Welcome to Picon</h1>
      <img className="mb-5" src={picon} width={100} height={100}></img>

      <form className="flex flex-col w-full">
        <label className="type type--bold">email:</label>
        <input onChange={(e) => handleChangleEmail(e)} className="input__field"></input>

        <label className="type type--bold">password:</label>
        <input type="password" onChange={(e) => handleChanglePassw(e)} className="input__field"></input>
      </form>

      <button onClick={handleLogin} className="button button--primary mb-5">{loginLoading}</button>
    
      <h2 className="type type--large type--bold">Or create new account</h2>
      <button onClick={handleCreateAccount} className="button button--secondary mb-5">{createLoading}</button>
      
      <p className="type text-red-600">{errorMessage}</p>
    </div>
  )
}

export default LogIn