export function encrypt(text, key){
    return [...text].map((x, i) => 
    (x.codePointAt() ^ key.charCodeAt(i % key.length) % 255)
     .toString(16)
     .padStart(2,"0")
   ).join('')
}
export function decrypt(text, key){
    let result = String.fromCharCode(...text.match(/.{1,2}/g)
     .map((e,i) => 
       parseInt(e, 16) ^ key.charCodeAt(i % key.length) % 255)
     )
    return result != "-" ? result : null
}
export const decrypt_json = (json) => {
  var json_date = json[Object.keys(json)[0]]
  delete json[Object.keys(json)[0]]
  const decrypt_node = (key, json) => {
    if(typeof json === "string"){
      var decrypted_string = decrypt(json, key)
      var decrypted_result = isNaN(1*(decrypted_string)) ? decrypted_string : 1*(decrypted_string) 
      return decrypted_string
    } else {
      var is_array = Array.isArray(json)
      var decrypted_node
      if(is_array){
        decrypted_node = []
        json.forEach((node) => {
          let decrypted_object
          if(typeof node === "object"){
            decrypted_object = {}
            Object.keys(node).forEach((subnode) => {
              let key = decrypt(subnode, json_date)
              decrypted_object[key] = decrypt_node(subnode, node[subnode])
            })
          } else {
            if(typeof node == "string"){
              decrypted_object = decrypt_node(json_date, node)
            }
          }
          decrypted_node.push(decrypted_object)
        })
      } else {
        decrypted_node = {}
        Object.keys(json).forEach((node) => {
          let key = decrypt(node, json_date)
          decrypted_node[key] = decrypt_node(node, json[node])
        })
      }
      return decrypted_node
    }
  }
  let result = {}
  result = decrypt_node("", json)
  result.date = json_date
  return result
}
export const calculate_CRC1 = (data) => {
    let checksum = 0;
    if(typeof data === "string"){
        // Iterate through each character in the string
        for (let i = 0; i < data.length; i++) {
          // Add the ASCII value of 
          // the character to the checksum
          checksum += data.charCodeAt(i);
        }
        // Ensure the checksum is within 
        //the range of 0-255 by using modulo
        return checksum % 256;
    } else {
        if(typeof data === "array"){
          data.forEach((item) => {
            checksum += calculate_CRC1(item)
          })
        } else if (typeof data === "object"){
          Object.keys(data).forEach((item) => {
            checksum += calculate_CRC1(item)
          })
        }
        return checksum
      }
}
export const calculate_CRC = (data) => {
    const polynomial = 0xEDB88320;
    let crc = 0xFFFFFFFF;

    // Iterate through each character in the data
    for (let i = 0; i < data.length; i++) {
        // XOR the current character 
        // with the current CRC value
        crc ^= data.charCodeAt(i);

        // Perform bitwise operations 
        // to calculate the new CRC value
        for (let j = 0; j < 8; j++) {
            crc = (crc >>> 1) ^ (crc & 1 ? polynomial : 0);
        }
    }

    // Perform a final XOR operation and return the CRC value
    return crc ^ 0xFFFFFFFF;
}
