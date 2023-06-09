const { expect } = require("chai");

describe("Mint Function", function () {
  it("The contract as able to mint a function", async function () {
    const metadata = "https://ipfs.io/ipfs/QmPpzZ2LTfLpH1tWCS5DFnK7fWs2WB4AwqzWqaBknyye7u/1.json"

    const FactoryContract = await ethers.getContractFactory("FactoryNFT");

    const factoryContract = await FactoryContract.deploy();

    const transaction = await factoryContract.mintNFT(metadata);
    const tx = await transaction.wait()

    const event = tx.events[0];
    const value = event.args[2];
    const tokenId = value.toNumber();

    const tokenURI = await factoryContract.tokenURI(tokenId)
  
    expect(tokenURI).to.be.equal(metadata);
  });
});