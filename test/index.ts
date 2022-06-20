import { expect } from "chai";
import { ethers } from "hardhat";

// import { usdcAddress } from '../scripts/_address'

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {

    const MyNFT = await ethers.getContractFactory("MyNFT");
    const myNFT = await MyNFT.deploy();
    await myNFT.deployed();

    const USDC = await ethers.getContractFactory("USDC");
    const usdc = await USDC.deploy();
    await usdc.deployed();

    const Borrower = await ethers.getContractFactory("Borrower");
    const borrower = await Borrower.deploy(usdc.address, myNFT.address);
    await borrower.deployed();

    const [deployer, user1] = await ethers.getSigners()

    const mintFTTx = await usdc.mint(deployer.address, "10000")
    await mintFTTx.wait()

    const mintNFTTx = await myNFT.safeMint(5000)
    await mintNFTTx.wait()

    const borrowTx = await borrower.borrow(0, 100, { from: user1.address })
    await borrowTx.wait()
  });
});
