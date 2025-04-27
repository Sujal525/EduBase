// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EduBaseMarketplace is ReentrancyGuard, Ownable {
    // Marketplace fee in percentage (e.g., 2%)
    uint256 public marketplaceFee;
    address public feeRecipient;
    
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
    }

    // Mapping from token ID to Listing
    mapping(uint256 => Listing) public listings;

    // The ERC721 token contract address (CredentialNFT contract)
    ERC721URIStorage public nftContract;

    event Listed(uint256 tokenId, address seller, uint256 price);
    event Unlisted(uint256 tokenId, address seller);
    event Bought(uint256 tokenId, address buyer, uint256 price);

    constructor(address _nftContract, address _feeRecipient, uint256 _marketplaceFee) {
        nftContract = ERC721URIStorage(_nftContract);
        feeRecipient = _feeRecipient;
        marketplaceFee = _marketplaceFee;
    }

    // List an NFT for sale
    function listNFT(uint256 tokenId, uint256 price) external nonReentrant {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner of the NFT");
        require(price > 0, "Price must be greater than zero");

        // Transfer the NFT to the contract
        nftContract.transferFrom(msg.sender, address(this), tokenId);

        // Create a listing
        listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price
        });

        emit Listed(tokenId, msg.sender, price);
    }

    // Unlist an NFT from the marketplace
    function unlistNFT(uint256 tokenId) external nonReentrant {
        require(listings[tokenId].seller == msg.sender, "Not the seller of the NFT");

        // Remove the listing
        delete listings[tokenId];

        // Transfer the NFT back to the seller
        nftContract.transferFrom(address(this), msg.sender, tokenId);

        emit Unlisted(tokenId, msg.sender);
    }

    // Buy an NFT from the marketplace
    function buyNFT(uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.seller != address(0), "NFT not listed");
        require(msg.value >= listing.price, "Insufficient funds");

        // Calculate marketplace fee
        uint256 feeAmount = (listing.price * marketplaceFee) / 100;

        // Transfer the fee to the fee recipient
        payable(feeRecipient).transfer(feeAmount);

        // Transfer the remaining amount to the seller
        payable(listing.seller).transfer(listing.price - feeAmount);

        // Transfer the NFT to the buyer
        nftContract.safeTransferFrom(address(this), msg.sender, tokenId);

        // Remove the listing
        delete listings[tokenId];

        emit Bought(tokenId, msg.sender, listing.price);
    }

    // Update the marketplace fee
    function setMarketplaceFee(uint256 _marketplaceFee) external onlyOwner {
        marketplaceFee = _marketplaceFee;
    }

    // Update the fee recipient
    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        feeRecipient = _feeRecipient;
    }
}
