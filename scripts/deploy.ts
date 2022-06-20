// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

import { usdcAddress } from '../scripts/_address'


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
    const MyNFT = await ethers.getContractFactory("MyNFT");
    const myNFT = await MyNFT.deploy();
    await myNFT.deployed();

    const USDC = await ethers.getContractFactory("USDC");
    const usdc = await USDC.deploy();
    await usdc.deployed();

    const Borrower = await ethers.getContractFactory("Borrower");
    const borrower = await Borrower.deploy(usdc.address, myNFT.address);
    await borrower.deployed();

    const [user0, user1] = await ethers.getSigners()

    const mintFTTx = await usdc.mint(borrower.address, 10000)
    await mintFTTx.wait()

    const mintNFTTx = await myNFT.safeMint(5000)
    await mintNFTTx.wait()
    await (await myNFT.transferFrom(user0.address, user1.address, 0)).wait()

    await (await myNFT.connect(user1).approve(borrower.address, 0)).wait()

    console.log(await myNFT.connect(user1).balanceOf(user1.address))

    const borrowTx = await borrower.connect(user1).borrow(0, 100)
    await borrowTx.wait()

    setTimeout(async () => {
      await (await usdc.connect(user1).approve(borrower.address, 105)).wait()
      const repayTx = await borrower.connect(user1).repayLoan(0)
      await repayTx.wait()

      console.log(await myNFT.connect(borrower.provider).balanceOf(borrower.address))
    }, 5000)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
