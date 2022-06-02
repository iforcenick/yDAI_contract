import { expect } from "chai";
import { ethers } from "hardhat";


import { daiAddress, ydaiAddress } from '../scripts/_address'
import { YDAIAbi, DAIAbi } from "../scripts/_interface";


describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const [tmp, account] = await ethers.getSigners()
    const ydaiContract = new ethers.Contract(ydaiAddress, YDAIAbi, account)

    // let daiFace = new ethers.utils.Interface(ABI);
    // const encoded = daiFace.encodeFunctionData("approve", [ ydai.address, 5 ])
    const daiContract = new ethers.Contract(daiAddress, DAIAbi, account)
    expect("DAI").to.equal(await daiContract.symbol())

    console.log(await daiContract.approve(ydaiAddress, 1))
    const tx = await ydaiContract.deposit(account.address, 1, false, 0, { gasLimit: 1000000 })
    await tx.wait()
    expect(18).to.equal(await daiContract.balanceOf(account.address))

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
