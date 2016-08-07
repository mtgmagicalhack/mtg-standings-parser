const Transforms = {

  money(str) {
    if (str === " ") {
      str = 0
    } else {
      str = parseInt(str.substr(1).replace(",", ""), 10)
    }
    return str
  },

  name(str) {
    const poy = /[(]\d+[)]\s/
    const country = /\s[/\[]\w+[/\]]/
    const split = str.split(", ")
    const first = split[1]
    const last = split[0]

    return `${first.replace(country, "")} ${last.replace(poy, "")}`
  },

  points(str) {
    return parseInt(str, 10)
  },
}

export default Transforms
