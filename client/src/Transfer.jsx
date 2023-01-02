import { useState } from "react";
import server from "./server";
import { utf8ToBytes } from "ethereum-cryptography/utils"
import { keccak256 } from "ethereum-cryptography/keccak"
import { sign } from "ethereum-cryptography/secp256k1"

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const signedTransfer = await signTransfer();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        payload: signedTransfer,
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  const hashMessage = () => {
    const amountBytes = utf8ToBytes(sendAmount)
    const hashAmount = keccak256(amountBytes)
    return hashAmount;
  }

  const signTransfer = () => {
    const hashedMessage = hashMessage();
    return sign(hashedMessage, address, { recovered: true })
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
