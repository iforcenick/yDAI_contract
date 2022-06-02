export const DAIAbi = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount)",
    "function approve(address spender, uint256 amount) public returns (bool)",

    "event Transfer(address indexed from, address indexed to, uint amount)"
];
export const YDAIAbi = [
    "function deposit(address from, uint256 daiAmount, bool isFixed, uint256 period) external",
    "function decimals() public view returns (uint8)",
    "function symbol() view returns (string)",
    "function balanceOf(address account) public view returns (uint256)",
    "function withdraw(uint index)",
    "function getMetadata(address addr) external view returns (DepositMeta)"
];