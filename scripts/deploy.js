const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners(); //get the account to deploy the contract

  const item = "NFT";
  const highestBid = 10;

  console.log("Deploying contracts with the account:", deployer.address);

  const Auction = await ethers.getContractFactory("Auction");
  const auction = await Auction.deploy(item, highestBid);

  await auction.deployed();

  console.log(
    `Auction deployed to: ${auction.address} with item for sell: '${item}' and starting price: ${highestBid} ETH`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }
);