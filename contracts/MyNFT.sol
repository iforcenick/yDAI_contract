pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721("MyNFT", "nft"), ERC721Enumerable, Ownable {
    mapping(uint => uint) private _tokenPrice;

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    function safeMint(uint price) external onlyOwner {
        uint _id = totalSupply();
        _tokenPrice[_id] = price;
        _safeMint(msg.sender, _id);
    }

    function tokenPrice(uint tokenId) external view returns (uint) {
        return _tokenPrice[tokenId];
    }
}