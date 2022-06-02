import { expect } from "chai";
import { ethers } from "hardhat";

import { daiAddress, ydaiAddress } from './_address'
import { YDAIAbi, DAIAbi } from "./_interface";

async function main() {
  const [tmp, account] = await ethers.getSigners()
  const ydaiContract = new ethers.Contract(ydaiAddress, YDAIAbi, account)
  const daiContract = new ethers.Contract(daiAddress, DAIAbi, account)
  console.log(await ydaiContract.getMetadata(account.address))
};
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});