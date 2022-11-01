/**
 * Role: Check if Email exist
 * @param email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
  return filter.test(email)
}

export const toRgb = (hex) => {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    let c = hex.substring(1).split('')
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]]
    }
    c = '0x' + c.join('')
    return { rgb: { r: (c >> 16) & 255, g: (c >> 8) & 255, b: c & 255, a: 1 } }
  }
  return false
}

export const test = () => {}
