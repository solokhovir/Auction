const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Auction", function() {
	let accounts
	const am = 20

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
	})


	describe("Checks bidding", () => {
		it("Should make a bid", async () => {
			const bid = await contract.connect(accounts[1]).bid({
				value: ethers.utils.parseEther("15"),
			});
			await bid.wait();
		});
	})

	describe("Checks withdraw", () => {
		it("Can't withdraw money without bid", async () => {
			const tx = contract.connect(accounts[1]).withdraw();
			await expect(tx).to.be.revertedWith("Incorrect refund amount");
		});

		it("Withdraw money", async () => {
			const firstInvestment = ethers.utils.parseEther('15');
			await contract.connect(accounts[1]).bid({
				value: ethers.utils.parseEther('15'),
			});
			await contract.connect(accounts[2]).bid({
				value: ethers.utils.parseEther("9"),
			});
			const tx = await contract.connect(accounts[1]).withdraw();
			const balance = await contract.connect(accounts[1]).getBalance();
			expect(balance).to.equal(0);
			await expect(tx).to.changeEtherBalance(accounts[1], firstInvestment);
		})
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