async function main() {
  const { create } = await import('ipfs-http-client')
  const fs = require('fs');

  const [signer] = await ethers.getSigners();
  const tokenId = await getNextTokenId(signer);
  const now = Date.now();

  const metadata = {
    name: `ShidenCrust Singulars #${tokenId}`,
    description: "This is the POC collection of NFTs on Shiden with the metadata and image stored on Crust",
    image: "",
    edition: tokenId,
    date: now,
    creator: "Greg Luneau from Astar",
    attributes: [
      { trait_type: "Smart Contract Chain", value: "Shiden.Network" },
      { trait_type: "Decentralized Cloud Storage", value: "Crust.Network" },
      { trait_type: "Virtual Machine", value: "EVM" },
    ],
  };

  console.log("metadata", metadata); 
  
  // const sig = await provider.signMessage(signer.address);
  const sig = await sign(signer.address);
  const authHeaderRaw = `eth-${signer.address}:${sig}`;
  const authHeader = Buffer.from(authHeaderRaw).toString('base64');
  const ipfsW3GW = 'https://crustipfs.xyz';

  // 1. Create IPFS instant
  const ipfs = create({
      url: `${ipfsW3GW}/api/v0`,
      headers: {
          authorization: `Basic ${authHeader}`
      }
  });

  // 2. Add files to ipfs
  const options = {
    wrapWithDirectory: true
  }

  const imageFileDetails = {
    path: tokenId + ".png",
    content: await image()
  }

  fs.writeFileSync('tmp/' + tokenId + '.png', imageFileDetails.content);

  const cidImage = await ipfs.add(imageFileDetails, options);
  metadata.image = "ipfs://" + cidImage.cid.toString() + "/" + imageFileDetails.path;
  console.log("cidImage:", cidImage);

  // 3. Get file status from ipfs
  const fileStatImage = await ipfs.files.stat("/ipfs/" + cidImage.cid.toString() + "/" + imageFileDetails.path);
  console.log("fileStatImage:", fileStatImage);

  const metadataFileDetails = {
    path: tokenId + ".json",
    content: JSON.stringify(metadata)
  }

  const cidMetadata = await ipfs.add(metadataFileDetails, options);
  console.log("cidMetadata:", cidMetadata);

  // 3. Get file status from ipfs
  const metadatafileStat = await ipfs.files.stat("/ipfs/" + cidMetadata.cid.toString() + "/" + metadataFileDetails.path);
  console.log("metadatafileStat:", metadatafileStat);

}

async function image() {
  const { createCanvas } = require('canvas');
  const fs = require('fs');

  // Set the size of the image
  const width = 200;
  const height = 200;

  // Create a new canvas
  const canvas = createCanvas(width, height);

  // Get the 2D rendering context of the canvas
  const ctx = canvas.getContext('2d');

  // Set the background color to a random color
  ctx.fillStyle = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
  ctx.fillRect(0, 0, width, height);

  // Draw random colored squares, triangles, and circles
  const shapes = ['square', 'triangle', 'circle'];
  for (let i = 0; i < 10; i++) {
    // Generate a random shape and color
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    
    // Generate random coordinates and size for the shape
    const x = Math.floor(Math.random() * (width - 50));
    const y = Math.floor(Math.random() * (height - 50));
    const size = Math.floor(Math.random() * 50) + 10;
    
    // Draw the shape with the random color
    ctx.fillStyle = color;
    if (shape === 'square') {
      ctx.fillRect(x, y, size, size);
    } else if (shape === 'triangle') {
      ctx.beginPath();
      ctx.moveTo(x + size / 2, y);
      ctx.lineTo(x + size, y + size);
      ctx.lineTo(x, y + size);
      ctx.closePath();
      ctx.fill();
    } else if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  // Convert the canvas to a PNG buffer
  const buffer = canvas.toBuffer('image/png');
  return buffer;
}

async function getNextTokenId(signer) {
  const contractAddress = process.env.CONTRACT;
  const abi = [ "function currentTokenId() view returns (uint256)" ];
  const contract = new ethers.Contract(contractAddress, abi, signer);

  const currentTokenId = await contract.currentTokenId();
  return currentTokenId.add(1).toNumber();
}

async function sign(address) {
  return hre.network.provider.send(
    "eth_sign",
    [address, ethers.utils.hexlify(ethers.utils.toUtf8Bytes(address))]
  )
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
