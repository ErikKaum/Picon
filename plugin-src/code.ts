// Always get modifiers first
const getStyleModifiers = async() => {
  const styleModifiers = await figma.clientStorage.getAsync('styleModifiers')
  if (styleModifiers !== undefined) {
    figma.ui.postMessage(styleModifiers)
  }
}

// Utility function for saving modifiers
const saveStyleModifiers = async(styleModifiers: any) => {
  await figma.clientStorage.setAsync('styleModifiers', styleModifiers)
}
const saveUser = async(user: any) => {
  await figma.clientStorage.setAsync('user', user)
}
const deleteUser = async() => {
  await figma.clientStorage.deleteAsync('user') 
}

figma.on('run', ({ parameters }: RunEvent) => {
  
  const main = async() => {
    const showUi = parameters?.prompt === undefined ? true : false
    figma.showUI(__html__, { visible : showUi, themeColors: true, width: 375 ,height: 475 });

    const styleModifiers = await figma.clientStorage.getAsync('styleModifiers')
    const user = await figma.clientStorage.getAsync('user')

    if (user === undefined && showUi === false) {
      figma.closePlugin('You are not signed in, cannot generate image')
    }    

    // the only message we post if showUi = true
    figma.ui.postMessage({user: user, styleModifiers: styleModifiers})
    

    if (!showUi) {
      figma.ui.postMessage({parameters: parameters, styleModifiers: styleModifiers, user: user})
      figma.ui.onmessage = async(msg) => {
        if (msg.type === 'image') {
          const rect = figma.createRectangle()
          const img = figma.createImage(msg.newBytes)
          rect.resize(512, 512)
          rect.fills = [{ type: 'IMAGE', imageHash: img.hash, scaleMode: 'FILL'}]
          figma.currentPage.appendChild(rect)
          figma.closePlugin()
        }
        if (msg.type === 'tooManyError') {
          figma.closePlugin('You have exeeded the allowed number of image generations')
        }
        if (msg.type === 'unAuthError') {
          figma.closePlugin('Error in authorizing user')
        }
        if (msg.type === 'timeOutError') {
          figma.closePlugin('Timeout, try to generate again')
        }  
      }
    }
    if (showUi) {
      figma.ui.onmessage = async(msg) => {

        if (msg.type === "user") {
          if (msg.user !== undefined) {
            await saveUser(msg.user) 
          } else {
            await saveUser(msg.updatedUser)  
          }
        }
        if (msg.type === "saveModifiers") {
          await saveStyleModifiers(msg.styleModifiers)
        }      
        if (msg.type === 'image') {
          const rect = figma.createRectangle()
          const img = figma.createImage(msg.newBytes)
          rect.resize(512, 512)
          rect.fills = [{ type: 'IMAGE', imageHash: img.hash, scaleMode: 'FILL'}]
          figma.currentPage.appendChild(rect)
        }
        if (msg.type === 'signOut') {
          await deleteUser()
        }
      }
    }     
  }

  main()
})
