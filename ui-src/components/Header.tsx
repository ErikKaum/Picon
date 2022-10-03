import React from "react"


const Header = ({menu, setMenu} : {menu: number, setMenu: any}) => {
  return(
    <div className="w-full flex">
    <div className="type border-b flex w-full justify-evenly">

      <div  onClick={() => setMenu(0)} className="hover:cursor-pointer flex justify-center items-center">
        <div className={"icon icon--search " + (menu === 0 ? 'icon--blue' : '')}></div>
        <p className={(menu === 0 ? 'type--bold' : '')}>Prompt</p>
      </div>

      <div onClick={() => setMenu(1)} className="hover:cursor-pointer flex justify-center items-center">
        <div className={"icon icon--adjust " + (menu === 1 ? 'icon--blue' : '')}></div>
        <p className={(menu === 1 ? 'type--bold' : '')}>Modifiers</p>
      </div>

      <div onClick={() => setMenu(2)} className="hover:cursor-pointer flex justify-center items-center">
        <div className={"icon icon--library " + (menu === 2 ? 'icon--blue' : '')}></div>
        <p className={(menu === 2 ? 'type--bold' : '')}>Search</p>
      </div>

      <div onClick={() => setMenu(3)} className="hover:cursor-pointer flex justify-center items-center">
        <div className={"icon icon--settings " + (menu === 3 ? 'icon--blue' : '')}></div>
        <p className={(menu === 3 ? 'type--bold' : '')}>Settings</p>
      </div>


    </div>
  </div>

  )
}

export default Header