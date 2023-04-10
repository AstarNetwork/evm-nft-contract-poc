// fund.js

async function main() {
  const { Keyring } = require("@polkadot/keyring");
  const { ApiPromise, WsProvider } = require("@polkadot/api");
  const polkadotCryptoUtils = require("@polkadot/util-crypto");

  const provider = new WsProvider("ws://localhost:9944");
  const api = new ApiPromise({ provider });

  await polkadotCryptoUtils.cryptoWaitReady();

  const keyring = new Keyring({ type: "sr25519" });
  const FROM = keyring.addFromUri("//Alice");

  const [signer] = await ethers.getSigners();

  const addressPrefix = 5;
  const TO = polkadotCryptoUtils.evmToAddress(signer.address, addressPrefix);
  const AMOUNT = 10000000000000000000n;

  await sendTransaction(api.tx.balances.transfer({ Id: TO }, AMOUNT), FROM);

  console.log("Funded EVM address from:", TO);
}

async function sendTransaction(transaction, sender) {
  const SPAWNING_TIME = 500000;

  const result = await new Promise((resolve, reject) => {
    let unsubscribe;
    let timeout;

    transaction
      .signAndSend(sender, async (result) => {
        console.log(`Current status is ${result?.status}`);

        if (result.isFinalized) {
          if (unsubscribe) {
            unsubscribe();
          }

          clearTimeout(timeout);
          resolve(true);
        }
      })
      .then((unsub) => {
        unsubscribe = unsub;
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });

    timeout = setTimeout(() => {
      reject(new Error("Transaction timeout"));
    }, SPAWNING_TIME);
  });

  return result;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
