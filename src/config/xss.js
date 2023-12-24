import xss from 'xss'

const whiteList = {}

for (let i in xss.whiteList) {
  whiteList[i] = [...xss.whiteList[i], 'style', 'font-family', 'class']
}

export default new xss.FilterXSS({
  whiteList
})