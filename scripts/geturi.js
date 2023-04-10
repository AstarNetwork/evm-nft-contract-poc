async function main() {

  // The Contract interface
  const abi = [
      "function tokenURI(uint256 _tokenId) external view returns (string)",
  ];

  // the contract interface         
  const contractAddress = process.env.CONTRACT;
  const [signer] = await ethers.getSigners();

  // We connect to the Contract using a Provider, so we will only
  // have read-only access to the Contract
  let contract = new ethers.Contract(contractAddress, abi, signer);
  let currentValue = contract.tokenURI(1854);

  currentValue.then(console.log)

}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
