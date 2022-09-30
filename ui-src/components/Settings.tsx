import React, { useEffect } from "react"

const Settings = ({user}:{user: any}) => {
  
  return(
    <div className="flex flex-col h-full w-full p-5">
      <p className="type type--bold mb-5">Settings</p>

      <div className="flex flex-col w-full space-y-1 mb-10">
        <p className="type">Logged in as: {user?.user?.user?.email}</p>
      </div>
    
    </div>
  )

}


export default Settings