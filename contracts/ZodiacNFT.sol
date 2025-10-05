// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZodiacNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Mapping from user address to a boolean indicating if they have minted an NFT
    mapping(address => bool) private _hasMinted;

    // Mapping from zodiac sign string to the metadata URI
    mapping(string => string) private _zodiacTokenURIs;

    // Array of valid zodiac signs
    string[] public zodiacSigns = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];

    constructor(address initialOwner) ERC721("Astrobase Zodiac NFT", "AZN") Ownable(initialOwner) {}

    // Function to set the token URI for a specific zodiac sign (only owner can call)
    function setZodiacTokenURI(string memory sign, string memory tokenURI) public onlyOwner {
        _zodiacTokenURIs[sign] = tokenURI;
    }

    // The main minting function
    function mintZodiacNFT(address to, string memory zodiacSign) public {
        require(!_hasMinted[to], "Error: You have already minted a Zodiac NFT.");
        require(bytes(_zodiacTokenURIs[zodiacSign]).length > 0, "Error: Invalid zodiac sign or URI not set.");

        _hasMinted[to] = true;
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _zodiacTokenURIs[zodiacSign]);
    }

    // The following functions are overrides required by Solidity.
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
