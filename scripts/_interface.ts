import jsonYDAIAbi from '../artifacts/contracts/YDAI.sol/YDAI.json'
import { Interface, FormatTypes } from "ethers/lib/utils";

export const DAIAbi = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount)",
    "function approve(address spender, uint256 amount) public returns (bool)",

    "event Transfer(address indexed from, address indexed to, uint amount)"
];
const ydaiFace = new Interface(JSON.stringify(jsonYDAIAbi.abi));
ydaiFace.format(FormatTypes.full);
export const YDAIAbi = ydaiFace