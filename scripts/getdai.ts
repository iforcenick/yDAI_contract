import { expect } from "chai";
import { ethers } from "hardhat";

import { daiAddress, ydaiAddress } from './_address'
import { YDAIAbi, DAIAbi } from "./_interface";
import { calcDAI } from './util'


async function main() {
    const [tmp, account] = await ethers.getSigners()
    const ydaiContract = new ethers.Contract(ydaiAddress, YDAIAbi, account)

    // let daiFace = new ethers.utils.Interface(ABI);
    // const encoded = daiFace.encodeFunctionData("approve", [ ydai.address, 5 ])
    const daiContract = new ethers.Contract(daiAddress, DAIAbi, account)

    console.log(await daiContract.approve(ydaiAddress, calcDAI(1)))
    const tx = await ydaiContract.deposit(account.address, calcDAI(1), false, 0, { gasLimit: 1000000 })
    console.log("Transaction pending");
    await tx.wait()
    console.log("Transaction mined.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
  