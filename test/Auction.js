const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Auction", function() {
	let accounts;

  beforeEach(async () => {
		accounts = await ethers.getSigners();
				const Auction = await ethers.getContractFactory("Auction");
				contract = await Auction.deploy("NFT", 10);
		expect(await contract.seller()).to.equal(accounts[0].address);
  });

	it("Checks deploy", async () => {
		await contract.deployed();
		expect(await contract.item()).to.eq("NFT");
		expect(await contract.highestBid()).to.eq(10);
		expect(contract.address).to.be.properAddress;
	});

	describe("Checks bidding", () => {
		it("Should revert sellers bid", async () => {
			const sellerBids = contract.connect(accounts[0]).bid({ 
				value: ethers.utils.parseEther("12") 
			});
			await expect(sellerBids).to.be.revertedWith("You can not make a bid");
		});
		it("Should make a bid", async () => {
			const bidOne = await contract.connect(accounts[1]).bid({
				value: ethers.utils.parseEther("15"),
			});
			await expect(contract.connect(accounts[2]).bid({
        value: ethers.utils.parseEther("9"),
      })).to.be.revertedWith("Too low");
		});
	})

	describe("Checks withdraw", () => {
		it("Can't withdraw money without bid", async () => {
			const tx = contract.connect(accounts[1]).withdraw();
			await expect(tx).to.be.revertedWith("Incorrect refund amount");
		});

		it("Withdraw money", async () => {
			const firstInvestment = ethers.utils.parseEther("11");
			await contract.connect(accounts[1]).bid({
			value: ethers.utils.parseEther("11"),
			});
			await contract.connect(accounts[2]).bid({
			value: ethers.utils.parseEther("15"),
			});
			const tx = await contract.connect(accounts[1]).withdraw();
			const balance = await contract.connect(accounts[1]).getBalance();
			expect(balance).to.equal(0);
			await expect(tx).to.changeEtherBalance(accounts[1], firstInvestment);
			
		})
		it("Should not withdraw money after auction ended", async () => {
			contract.connect(accounts[0]).end();
			await expect(contract.connect(accounts[1]).withdraw()).to.be.revertedWith("Auction ended");
		});
	});

	describe("Checks ending auction", () => {
		it("Shound be reverted", async () => {
			await expect(contract.connect(accounts[1]).end()).to.be.revertedWith("Not a seller");
		});

		it("Should end", async () => {
			await contract.connect(accounts[0]).end();
		})
	})

})