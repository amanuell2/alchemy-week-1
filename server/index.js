const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "047e79f79a5a3b28f83ee35440e50b8d518b6868f48dcd423b71453457d33f15c7ab2c4cad1fcd3b9a434fba91f38cabe3edbe2de601808a23d9c68ce4b1443d20": 100,
  "0418d15584995dcc620ee5fdbd009dc6ef74b1b385e18f0b3c445bab379773e4641ba013a65eef66799b9b4da964e53308c86c4dc2b6a748dbd3c56a1f91c74fc2": 50,
  "04b55fb9e70a2cd90a9a2f78d68665a32fdd6c15e10f058989b393f2664a293f93f983b986b311c2ec026f19debe084294d1ea031c021a072bb583c05f242cedc2": 75,
};

app.get("/balance/:address", (req, res) => {
  const { payload } = req.params;
  const balance = balances[address] ?? 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { payload, recipient } = req.body;
console.log(payload,recipient)
  // setInitialBalance(sender);
  // setInitialBalance(recipient);

  // if (balances[sender] < amount) {
  //   res.status(400).send({ message: "Not enough funds!" });
  // } else {
  //   balances[sender] -= amount;
  //   balances[recipient] += amount;
  //   res.send({ balance: balances[sender] });
  // }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
