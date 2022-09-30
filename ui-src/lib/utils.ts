export function base64ToArrayBuffer(base64: any) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
  
export async function encode(canvas : any , ctx :any, imageData : ImageData | undefined) {
    ctx.putImageData(imageData, 0, 0)
    return await new Promise((resolve, reject) => {
      canvas.toBlob((blob : Blob) => {
        const reader : FileReader = new FileReader()
        // @ts-ignore
        reader.onload = () => resolve(new Uint8Array(reader.result))
        reader.onerror = () => reject(new Error('Could not read from blob'))
        reader.readAsArrayBuffer(blob)
      })
    })
  }
  
export async function decode(canvas :any , ctx :any , bytes : any) {
    const url = URL.createObjectURL(new Blob([bytes]))
    const image = await new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject()
      img.src = url
    })
    canvas.width = 512
    canvas.height = 512
    ctx.drawImage(image, 0, 0)
    const imageData = ctx.getImageData(0, 0, 512, 512)
    return imageData
}

export interface modifier {
  name : string,
  checked: boolean
}

export function addModifiers (input: String, modifiers: modifier[] | undefined, customModifiers: modifier[] | undefined) {

  let output = input
  
  modifiers?.forEach((item) => {
    if (item.checked === true) {
      output = output + ', ' + item.name
    }
  })

  customModifiers?.forEach((item) => {
    if (item.checked === true) {
      output = output + ', ' + item.name
    }
  })

  return output
}

export const defaulModifiers : modifier[] = [
  {name: "High Resolution", checked : true},
  {name: "Animated", checked : false},
  {name: "8k", checked : false},
  {name: "Pixelated", checked : false},
  {name: "Highly detailed", checked : false},
  {name: "Cyborg", checked : false},
  {name: "Fantasy", checked : false},
  {name: "Colorful", checked : false},
  {name: "Digital painting", checked : false},
  {name: "Concept art", checked : false},
  {name: "Monet", checked : false},
  {name: "Oil Painting", checked : false},
  {name: "Brush Strokes", checked : false},
  {name: "Greg Rutkowski", checked : false},
] 


