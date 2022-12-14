// Always get modifiers first
// const getStyleModifiers = async() => {
//   const styleModifiers = await figma.clientStorage.getAsync('styleModifiers')
//   if (styleModifiers !== undefined) {
//     figma.ui.postMessage(styleModifiers)
//   }
// }

// Utility function for saving modifiers
const saveStyleModifiers = async(styleModifiers: any) => {
  await figma.clientStorage.setAsync('styleModifiers', styleModifiers)
}
const saveCustomModifiers = async(customModifiers:any) => {
  await figma.clientStorage.setAsync('customModifiers', customModifiers)
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
    figma.showUI(__html__, { visible : showUi, themeColors: true, width: 400 ,height: 600 });

    const styleModifiers = await figma.clientStorage.getAsync('styleModifiers')
    const customModifiers = await figma.clientStorage.getAsync('customModifiers')
    const user = await figma.clientStorage.getAsync('user')

    if (user === undefined && showUi === false) {
      figma.closePlugin('You are not signed in, cannot generate image')
    }    

    // the only message we post if showUi = true
    figma.ui.postMessage({user: user, styleModifiers: styleModifiers, customModifiers: customModifiers})

    if (!showUi) {
      figma.ui.postMessage({parameters: parameters, styleModifiers: styleModifiers, customModifiers: customModifiers, user: user})
      figma.ui.onmessage = async(msg) => {
        if (msg.type === 'image') {
          const rect = figma.createRectangle()
          const img = figma.createImage(msg.newBytes)
          rect.resize(512, 512)
          rect.name = msg.fullInput
          rect.fills = [{ type: 'IMAGE', imageHash: img.hash, scaleMode: 'FILL'}]
          figma.currentPage.appendChild(rect)

          figma.currentPage.selection = [rect];
          figma.viewport.scrollAndZoomIntoView([rect]);

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
        if (msg.type === 'userError') {
          console.log(msg.errorMsg)
          figma.closePlugin("Email needs to be verified to generate images")
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
        if (msg.type === "saveCustomModifiers") {
          await saveCustomModifiers(msg.customModifiers)
        }
        if (msg.type === 'image') {
          const rect = figma.createRectangle()
          const img = figma.createImage(msg.newBytes)

          if (msg.width !== undefined && msg.height !== undefined) {
            rect.resize(msg.width, msg.height)
          } else {
            rect.resize(512, 512)
          }

          rect.name = msg.fullInput
          rect.fills = [{ type: 'IMAGE', imageHash: img.hash, scaleMode: 'FILL'}]
          figma.currentPage.appendChild(rect)

          figma.currentPage.selection = [rect];
          figma.viewport.scrollAndZoomIntoView([rect]);
        }
        if (msg.type === 'signOut') {
          await deleteUser()
        }
      }
    }     
  }

  main()
})
