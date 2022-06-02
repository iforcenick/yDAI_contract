import { expect } from "chai";
import { ethers } from "hardhat";

import { daiAddress, ydaiAddress } from './_address'
import { YDAIAbi, DAIAbi } from "./_interface";

//import ydaiAbi from '../artifacts/contracts/YDAI.sol/YDAI.json'


async function main() {
  const [tmp, account] = await ethers.getSigners()
  const ydaiContract = new ethers.Contract(ydaiAddress, YDAIAbi, account)
  console.log(await ydaiContract._metadata(account.address))
};
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});