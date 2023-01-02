const express = require("express");
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes,toHex } = require("ethereum-cryptography/utils");


const app = express();
const cors = require("cors");
const port = 3042;
app.use(cors());
app.use(express.json());
//5422b1321e1c4de052f5215aa7f157a3e6dc0ef2517efad30b6487fcedd3b45b
const balances = {
  "DD1D8F93303D0F0BF34FB0E99D9C02C0C4579155": 100,
  "78D22EEC0FB7BCE6380E421B84E23A333A3804AA": 50,
  "938F7B70522621322F5CD4A4F79888CA2247A53C": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] ?? 0;
  res.send({ balance });
});

app.post("/send", async(req, res) => {
  const { message, signature } = req.body;
  const {recipient, amount } = message;
  const pubKey = signatureToPubKey(message, signature);

  const sender = pubKeyToAddress(pubKey);
  console.log(sender)
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

const pubKeyToAddress = (pubKey) => {
  const hash = keccak256(pubKey.slice(1));
  return toHex(hash.slice(-20)).toUpperCase();
};

const signatureToPubKey = (message, signature) => {
  const hash = hashMessage(message);
  const fullSignatureBytes = hexToBytes(signature);
  const recoveryBit = fullSignatureBytes[0];
  const signatureBytes = fullSignatureBytes.slice(1);

  return secp.recoverPublicKey(hash, signatureBytes, recoveryBit);
};

const hashMessage = (message) => keccak256(Uint8Array.from(message));

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
