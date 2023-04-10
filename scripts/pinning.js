async function main() {
  // Place order in ethereum compatible platform, you can get the storageOrder contract instance by ethers.js or web3.js as you like
  // For more information please refer to allow "https://docs.ethers.io/v5/" and "https://web3js.readthedocs.io/en/v1.7.3/"
  
  const fileCidPng = "QmUqJAgSnjnbdQ7Ea6dVtq5anMnWuwRNJWbuVRmGqDGYoS";
  const fileSizePng = 3217;

  const fileCidJson = "QmPpzZ2LTfLpH1tWCS5DFnK7fWs2WB4AwqzWqaBknyye7u";
  const fileSizeJson = 536;

  // Firstly get price in ETH with file size
  const StorageOrderABI = [
    "function getPrice(uint size) public view returns (uint price)",
    "function placeOrder(string cid, uint64 size) public payable",
    "function placeOrderWithNode(string cid, uint size, address nodeAddress) public payable",
    "event Order(address customer, address merchant, string cid, uint size, uint price)",
  ];

  // Contract on Shiden
  const StorageOrderAddress = "0x10f15729aEFB5165a90be683DC598070F91367F0"; // Shiden
  const [signer] = await ethers.getSigners();
  const provider = ethers.provider;

  // Get balance
  const balance = await provider.getBalance(signer.address);
  console.log("balance:", balance.toString());

  // Get price
  const storageOrder = new ethers.Contract(
    StorageOrderAddress,
    StorageOrderABI,
    signer
  );

  const pricePng = await storageOrder.getPrice(fileSizePng);
  console.log("pricePng:     ", pricePng.toString());

  const priceJson = await storageOrder.getPrice(fileSizeJson);
  console.log("priceJson:     ", priceJson.toString());

  // Secondly placeOrder with cid, size and price
  const txResponsePng = await storageOrder.placeOrder(fileCidPng, fileSizePng, { value: pricePng });
  const txReceiptPng = await txResponsePng.wait();
  console.log("NFT's PNG pinned successfully!");
  console.log("txReceiptPng", txReceiptPng);

  const txResponseJson = await storageOrder.placeOrder(fileCidJson, fileSizeJson, { value: priceJson });
  const txReceiptJson = await txResponseJson.wait();
  console.log("NFT's JSON pinned successfully!");
  console.log("txReceiptJson", txReceiptJson);


  // to be retreived later from the ipfs gateway
  // https://crustipfs.live/ipfs/QmP15vTxLrqhA822cm98GHieg5WKG9UhmAVDaYqzgpGWL5/27.png
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
