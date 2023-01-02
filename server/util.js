const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const privateKey = secp.utils.randomPrivateKey()
const publicKey = secp.getPublicKey(privateKey);
console.log(toHex(privateKey));
console.log(toHex(publicKey));