pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MyNFT.sol";
import "hardhat/console.sol";

contract Borrower is Context {
    IERC20 private usdcAddress;
    MyNFT private nft;

    uint private INTEREST_FEE = 600; // INTEREST_FEE / 1000
    uint private INTEREST_FEE_PERIOD = 1;
    uint private BORROW_PERIOD = 8;

    struct Borrow {
        address owner;
        uint borrowedTime;
        uint amount;
    }
    mapping(uint => Borrow) blist;

    constructor(IERC20 usdcAddress_, MyNFT nft_) {
        usdcAddress = usdcAddress_;
        nft = nft_;
    }
    function borrow(uint tokenId, uint amount) external {
        require(amount < nft.tokenPrice(tokenId) * 7 / 10, "Borrowable amount exceeded.");
        nft.transferFrom(_msgSender(), address(this), tokenId);
        usdcAddress.transfer(_msgSender(), amount);
        blist[tokenId] = Borrow(_msgSender(), block.timestamp, amount);
    }

    function _liquidate(uint tokenId) internal {
        uint totalRepay;
        unchecked {
            uint fee = (block.timestamp - blist[tokenId].borrowedTime) / INTEREST_FEE_PERIOD * INTEREST_FEE / 1000;
            totalRepay = blist[tokenId].amount + fee;
            console.log(totalRepay);
        }
        nft.transferFrom(address(this), _msgSender(), tokenId);
        usdcAddress.transferFrom(_msgSender(), address(this), totalRepay);
    }
    function repayLoan(uint tokenId) external {
        console.log(blist[tokenId].borrowedTime, BORROW_PERIOD, block.timestamp);
        require(blist[tokenId].owner == _msgSender(), "You are not an owner.");
        require(blist[tokenId].borrowedTime + BORROW_PERIOD >= block.timestamp, "Deadline exceeded.");
        _liquidate(tokenId);
    }
    function liquidateByAny(uint tokenId) external {
        require(blist[tokenId].borrowedTime + BORROW_PERIOD < block.timestamp, "Collateral is not locked yet.");
        _liquidate(tokenId);
    }
}