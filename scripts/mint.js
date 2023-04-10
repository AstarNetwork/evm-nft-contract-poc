// mint.js

async function main() {
  const tokenURI = "https://ipfs.io/ipfs/QmPpzZ2LTfLpH1tWCS5DFnK7fWs2WB4AwqzWqaBknyye7u/1.json"; // replace with the URL of your NFT metadata

  // Load the contract and the provider
  const [signer] = await ethers.getSigners();
  console.log("Minting NFT with account:", signer.address);

  const FactoryNFT = await ethers.getContractFactory("FactoryNFT");
  const contract = FactoryNFT.attach(process.env.CONTRACT);
 
  // Mint the NFT
  const txResponse = await contract.mintNFT(tokenURI);
  const txReceipt = await txResponse.wait();
  const [transferEvent] = txReceipt.events;
  const { tokenId } = transferEvent.args;
  console.log("NFT minted successfully!");
  console.log(`NFT tokenId: ${tokenId}`);

  const tokenURIonchain = await contract.tokenURI(tokenId);
  console.log('tokenURI', tokenURIonchain);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
