async function main() {
  // Define file CIDs and sizes
  const files = [
    { cid: "QmUqJAgSnjnbdQ7Ea6dVtq5anMnWuwRNJWbuVRmGqDGYoS", size: 3217 },
    { cid: "QmPpzZ2LTfLpH1tWCS5DFnK7fWs2WB4AwqzWqaBknyye7u", size: 536 },
  ];

  // Define StorageOrder contract ABI
  const StorageOrderABI = [
    "function getPrice(uint size) public view returns (uint price)",
    "function placeOrder(string cid, uint64 size) public payable",
    "function placeOrderWithNode(string cid, uint size, address nodeAddress) public payable",
    "event Order(address customer, address merchant, string cid, uint size, uint price)",
  ];

  // Define StorageOrder contract address for Shiden network
  const StorageOrderAddress = "0x10f15729aEFB5165a90be683DC598070F91367F0";

  // Get signer and provider
  const [signer] = await ethers.getSigners();
  const provider = ethers.provider;

  // Get balance
  const balance = await provider.getBalance(signer.address);
  console.log("balance:", ethers.utils.formatEther(balance), "SDN");

  // Get prices and place orders for each file
  for(const file of files) {
    const storageOrder = new ethers.Contract(
      StorageOrderAddress,
      StorageOrderABI,
      signer
    );

    const price = await storageOrder.getPrice(file.size);
    console.log(`Price for file CID ${file.cid} with size ${file.size}: ${ethers.utils.formatEther(price)} SDN`);
    const txResponse = await storageOrder.placeOrder(file.cid, file.size, { value: price });
    const txReceipt = await txResponse.wait();
    console.log(`File CID ${file.cid} with size ${file.size} pinned successfully!`);
    console.log(`Transaction hash: ${txReceipt.transactionHash}`);
  }

  // to be retreived later from the ipfs gateway
  // https://crustipfs.live/ipfs/QmP15vTxLrqhA822cm98GHieg5WKG9UhmAVDaYqzgpGWL5/27.png
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
