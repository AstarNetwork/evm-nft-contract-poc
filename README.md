# EVM NFT Contract POC  

This project uses Hardhat to achieve a POC collection of NFTs on Shiden with the metadata and image stored on Crust.

First minted NFT of Shiden: [ShidenCrust Singulars #1](https://tofunft.com/nft/shiden/0x6d4965CB654B039EfF3cC86400932338790C2126/1)

## Installation

Install dependencies:

```sh
yarn install
```

## Solidity Usage

To build the contract, run:

```sh
yarn build
```

To run the test for deployment and minring, run:

```sh
yarn test
```

To verify the contract on a Shiden network, run:

```sh
yarn verify
```

## NFT Usage

To fund the test account, run:

```sh
yarn fund
```

To deploy the project, run:

```sh
yarn deploy
```

To upload the image and metadata the project, run:

```sh
yarn ipfs
```


To pin the image and metadata on the Shiden network, run:

```sh
yarn pinning
```

To mint new tokens, run:

```sh
yarn mint
```

## Dependencies

This project has the following dependencies:

```sh
@nomiclabs/hardhat-ethers
@nomiclabs/hardhat-etherscan
@nomiclabs/hardhat-waffle
chai
ethereum-waffle
ethers
hardhat
```

This project also depends on the following external packages:

```sh
@openzeppelin/contracts
@openzeppelin/hardhat-upgrades
@polkadot/api
@polkadot/keyring
@polkadot/util-crypto
canvas
dotenv
ipfs-http-client
```

## License

This project is licensed under the MIT license.
