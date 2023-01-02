import { useState } from "react";
import server from "./server";
import { sha256 } from "ethereum-cryptography/sha256"
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils"
import { keccak256 } from "ethereum-cryptography/keccak"
import {sign} from "ethereum-cryptography/secp256k1"

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const message = {
      amount :parseInt(sendAmount),
      recipient
    }

    const signature = await _sign(message);

    const transaction = {
      message,
      signature,
    };

    try {
      const {
        data: { balance },
      } = await server.post(`send`, 
        transaction
      );
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

    const hashMessage = (message) => keccak256(Uint8Array.from(message));

    const _sign = async (message) => {
      const privateKey = address;
      const hash = hashMessage(message);
      const [signature, recoveryBit] = await sign(hash, privateKey, {
        recovered: true,
      });

      const fullSignature = new Uint8Array([recoveryBit, ...signature]);
      return toHex(fullSignature);
    };

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
