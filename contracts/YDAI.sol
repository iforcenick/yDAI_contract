//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YDAI is ERC20("yDAI token", "yDAI"), Ownable() {
    struct DepositMeta {
        uint256 amount;
        bool isFixed;
        uint256 depositTime;
        uint256 period;
    }

    mapping(address => DepositMeta[]) public metadata;
    uint256 private APY_PERIOD = 60;
    uint256 feeCollection = 0;

    IERC20 dai;

    constructor() {
        dai = IERC20( 0xaD6D458402F60fD3Bd25163575031ACDce07538D );
    }

    function getMetadata(address addr) external view returns (DepositMeta[] memory) {
        require(metadata[addr].length > 0, "No deposit.");
        return metadata[addr];
    }

    // Not neccessary since 18 is a default value but must keep in mind.
    function decimals() public view override returns (uint8) {
        return 18;
    }

    function _removeElement(address addr, uint index) internal {
        metadata[addr][index] = metadata[addr][metadata[addr].length - 1];
        metadata[addr].pop();
    }

    function deposit(address from, uint256 daiAmount, bool isFixed, uint256 period) external {
        dai.transferFrom(from, address(this), daiAmount);
        metadata[from].push(DepositMeta(daiAmount, isFixed, block.timestamp, period));
    }

    function balanceOf(address account) public view override returns (uint256) {
        require(metadata[account].length > 0, "No deposit.");
        DepositMeta[] memory deposits = metadata[account];
        uint256 total = 0;
        for(uint i = 0; i < deposits.length; i ++) {
            DepositMeta memory current = deposits[i];
            uint256 periodLocked = block.timestamp - current.depositTime;
            if(current.isFixed) { // This is fixed lockup deposit so 35% APY is served.
                uint256 bonusTime = periodLocked < current.period ? periodLocked : current.period;
                uint256 bonus = bonusTime / APY_PERIOD * current.amount * 35 / 100;
                total += bonus;
            } else { // This is fixed lockup deposit so 12% APY is served.
                if(periodLocked > APY_PERIOD)
                    total += current.amount * 12 / 100;
            }
            total += current.amount;
        }
        return total;
    }

    function withdraw(uint index) external {
        require(metadata[_msgSender()].length > index, "Invalid index");
        DepositMeta memory current = metadata[_msgSender()][index];
        uint total = balanceOf(_msgSender());
        require(dai.balanceOf(address(this)) >= total, "Insufficient dai deposit");

        if(current.isFixed && current.depositTime + current.period < block.timestamp) {
            // You withdrew early so 15% fee will be payed.
            uint fee = total * 15 / 100;
            feeCollection += fee;
            total -= fee;
        }
        _removeElement(_msgSender(), index);

        dai.transfer(_msgSender(), total);
    }
}
