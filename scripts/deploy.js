// deploy.js

async function main() {
  // Load the contract and the provider
  const [signer] = await ethers.getSigners();
  console.log("Deploying contract with account:", signer.address);

  const FactoryNFT = await ethers.getContractFactory("FactoryNFT");
  const factoryNFT = await FactoryNFT.deploy(); //deploying the contract

  await factoryNFT.deployed(); // waiting for the contract to be deployed

  console.log("FactoryNFT deployed to:", factoryNFT.address); // Returning the contract address
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
