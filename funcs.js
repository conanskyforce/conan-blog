// record some design pattern, fun functions...


const btoa = (str) => Buffer.from(str, 'binary').toString('base64')
const atob = (str) => Buffer.from(str, 'base64').toString('utf-8')

btoa('conan')
//"Y29uYW4="
atob("Y29uYW4=")
//'conan'