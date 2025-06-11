// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./AIPromptRegistry.sol";

/**
 * @title PromptMarketplace
 * @dev Marketplace for buying and selling AI prompt NFTs
 * @notice This contract handles the trading of AI prompt NFTs with various payment options
 */
contract PromptMarketplace is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    using SafeERC20 for IERC20;

    // State variables
    Counters.Counter private _listingIdCounter;
    AIPromptRegistry public immutable PROMPT_REGISTRY;
    
    // Platform fee (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFee = 250;
    uint256 public constant MAX_PLATFORM_FEE = 1000; // 10% max
    address public feeRecipient;

    // Listing structure
    struct Listing {
        uint256 listingId;
        uint256 tokenId;
        address seller;
        uint256 price;
        address paymentToken; // address(0) for ETH
        bool isActive;
        uint256 createdAt;
        uint256 expiresAt;
    }

    // Offer structure
    struct Offer {
        uint256 offerId;
        uint256 tokenId;
        address buyer;
        uint256 price;
        address paymentToken;
        bool isActive;
        uint256 createdAt;
        uint256 expiresAt;
    }

    // Mappings
    mapping(uint256 => Listing) public listings; // listingId => Listing
    mapping(uint256 => uint256[]) public tokenListings; // tokenId => listingId[]
    mapping(uint256 => Offer[]) public tokenOffers; // tokenId => Offer[]
    mapping(address => bool) public acceptedPaymentTokens;
    mapping(address => uint256[]) public userListings; // seller => listingId[]
    mapping(address => uint256[]) public userOffers; // buyer => offerId[]

    // Events
    event ListingCreated(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price,
        address paymentToken
    );

    event ListingCancelled(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address indexed seller
    );

    event ListingUpdated(
        uint256 indexed listingId,
        uint256 newPrice
    );

    event PromptSold(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address indexed seller,
        address buyer,
        uint256 price,
        address paymentToken
    );

    event OfferMade(
        uint256 indexed offerId,
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price,
        address paymentToken
    );

    event OfferAccepted(
        uint256 indexed offerId,
        uint256 indexed tokenId,
        address indexed seller,
        address buyer,
        uint256 price,
        address paymentToken
    );

    event OfferCancelled(
        uint256 indexed offerId,
        uint256 indexed tokenId,
        address indexed buyer
    );

    event PaymentTokenUpdated(address token, bool accepted);
    event PlatformFeeUpdated(uint256 newFee);
    event FeeRecipientUpdated(address newRecipient);

    // Custom errors
    error InvalidTokenId();
    error NotTokenOwner();
    error TokenNotApproved();
    error ListingNotFound();
    error ListingNotActive();
    error ListingExpired();
    error InvalidPrice();
    error InvalidPaymentToken();
    error InsufficientPayment();
    error TransferFailed();
    error InvalidFee();
    error OfferNotFound();
    error OfferExpired();
    error NotOfferMaker();
    error SelfPurchase();

    /**
     * @dev Constructor
     * @param _promptRegistry Address of the AI Prompt Registry
     * @param _feeRecipient Address to receive platform fees
     */
    constructor(
        address _promptRegistry,
        address _feeRecipient
    ) {
        PROMPT_REGISTRY = AIPromptRegistry(_promptRegistry);
        feeRecipient = _feeRecipient;
        
        // Accept ETH by default (address(0))
        acceptedPaymentTokens[address(0)] = true;
    }

    /**
     * @dev Create a new listing
     * @param tokenId ID of the token to list
     * @param price Price in wei (or token units)
     * @param paymentToken Address of payment token (address(0) for ETH)
     * @param duration Duration of the listing in seconds
     */
    function createListing(
        uint256 tokenId,
        uint256 price,
        address paymentToken,
        uint256 duration
    ) external nonReentrant {
        if (PROMPT_REGISTRY.ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        if (!PROMPT_REGISTRY.isApprovedForAll(msg.sender, address(this)) && 
            PROMPT_REGISTRY.getApproved(tokenId) != address(this)) revert TokenNotApproved();
        if (price == 0) revert InvalidPrice();
        if (!acceptedPaymentTokens[paymentToken]) revert InvalidPaymentToken();

        _listingIdCounter.increment();
        uint256 listingId = _listingIdCounter.current();

        listings[listingId] = Listing({
            listingId: listingId,
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            paymentToken: paymentToken,
            isActive: true,
            createdAt: block.timestamp,
            expiresAt: block.timestamp + duration
        });

        tokenListings[tokenId].push(listingId);
        userListings[msg.sender].push(listingId);

        emit ListingCreated(listingId, tokenId, msg.sender, price, paymentToken);
    }

    /**
     * @dev Cancel a listing
     * @param listingId ID of the listing to cancel
     */
    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        if (listing.seller == address(0)) revert ListingNotFound();
        if (listing.seller != msg.sender) revert NotTokenOwner();
        if (!listing.isActive) revert ListingNotActive();

        listing.isActive = false;

        emit ListingCancelled(listingId, listing.tokenId, msg.sender);
    }

    /**
     * @dev Update listing price
     * @param listingId ID of the listing to update
     * @param newPrice New price for the listing
     */
    function updateListingPrice(uint256 listingId, uint256 newPrice) external {
        Listing storage listing = listings[listingId];
        if (listing.seller == address(0)) revert ListingNotFound();
        if (listing.seller != msg.sender) revert NotTokenOwner();
        if (!listing.isActive) revert ListingNotActive();
        if (newPrice == 0) revert InvalidPrice();

        listing.price = newPrice;

        emit ListingUpdated(listingId, newPrice);
    }

    /**
     * @dev Buy a prompt from a listing
     * @param listingId ID of the listing to purchase
     */
    function buyPrompt(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        if (listing.seller == address(0)) revert ListingNotFound();
        if (!listing.isActive) revert ListingNotActive();
        if (block.timestamp > listing.expiresAt) revert ListingExpired();
        if (listing.seller == msg.sender) revert SelfPurchase();

        uint256 totalPrice = listing.price;
        uint256 platformFeeAmount = (totalPrice * platformFee) / 10000;
        uint256 sellerAmount = totalPrice - platformFeeAmount;

        // Handle payment
        if (listing.paymentToken == address(0)) {
            // ETH payment
            if (msg.value < totalPrice) revert InsufficientPayment();
            
            // Transfer to seller
            (bool success1, ) = payable(listing.seller).call{value: sellerAmount}("");
            if (!success1) revert TransferFailed();
            
            // Transfer platform fee
            (bool success2, ) = payable(feeRecipient).call{value: platformFeeAmount}("");
            if (!success2) revert TransferFailed();
            
            // Refund excess
            if (msg.value > totalPrice) {
                (bool success3, ) = payable(msg.sender).call{value: msg.value - totalPrice}("");
                if (!success3) revert TransferFailed();
            }
        } else {
            // ERC20 payment
            IERC20 token = IERC20(listing.paymentToken);
            token.safeTransferFrom(msg.sender, listing.seller, sellerAmount);
            token.safeTransferFrom(msg.sender, feeRecipient, platformFeeAmount);
        }

        // Transfer NFT
        PROMPT_REGISTRY.safeTransferFrom(listing.seller, msg.sender, listing.tokenId);

        // Mark listing as inactive
        listing.isActive = false;

        // Record usage
        PROMPT_REGISTRY.recordUsage(listing.tokenId);

        emit PromptSold(
            listingId,
            listing.tokenId,
            listing.seller,
            msg.sender,
            totalPrice,
            listing.paymentToken
        );
    }

    /**
     * @dev Make an offer on a prompt
     * @param tokenId ID of the token to make an offer on
     * @param price Offer price
     * @param paymentToken Payment token address
     * @param duration Duration of the offer in seconds
     */
    function makeOffer(
        uint256 tokenId,
        uint256 price,
        address paymentToken,
        uint256 duration
    ) external payable nonReentrant {
        if (price == 0) revert InvalidPrice();
        if (!acceptedPaymentTokens[paymentToken]) revert InvalidPaymentToken();
        if (PROMPT_REGISTRY.ownerOf(tokenId) == msg.sender) revert SelfPurchase();

        // Lock payment for the offer
        if (paymentToken == address(0)) {
            if (msg.value < price) revert InsufficientPayment();
        } else {
            IERC20(paymentToken).safeTransferFrom(msg.sender, address(this), price);
        }

        uint256 offerId = tokenOffers[tokenId].length;
        
        tokenOffers[tokenId].push(Offer({
            offerId: offerId,
            tokenId: tokenId,
            buyer: msg.sender,
            price: price,
            paymentToken: paymentToken,
            isActive: true,
            createdAt: block.timestamp,
            expiresAt: block.timestamp + duration
        }));

        userOffers[msg.sender].push(offerId);

        emit OfferMade(offerId, tokenId, msg.sender, price, paymentToken);
    }

    /**
     * @dev Accept an offer
     * @param tokenId ID of the token
     * @param offerId ID of the offer to accept
     */
    function acceptOffer(uint256 tokenId, uint256 offerId) external nonReentrant {
        if (PROMPT_REGISTRY.ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        if (offerId >= tokenOffers[tokenId].length) revert OfferNotFound();

        Offer storage offer = tokenOffers[tokenId][offerId];
        if (!offer.isActive) revert OfferNotFound();
        if (block.timestamp > offer.expiresAt) revert OfferExpired();

        uint256 totalPrice = offer.price;
        uint256 platformFeeAmount = (totalPrice * platformFee) / 10000;
        uint256 sellerAmount = totalPrice - platformFeeAmount;

        // Transfer payments
        if (offer.paymentToken == address(0)) {
            (bool success1, ) = payable(msg.sender).call{value: sellerAmount}("");
            if (!success1) revert TransferFailed();
            
            (bool success2, ) = payable(feeRecipient).call{value: platformFeeAmount}("");
            if (!success2) revert TransferFailed();
        } else {
            IERC20 token = IERC20(offer.paymentToken);
            token.safeTransfer(msg.sender, sellerAmount);
            token.safeTransfer(feeRecipient, platformFeeAmount);
        }

        // Transfer NFT
        PROMPT_REGISTRY.safeTransferFrom(msg.sender, offer.buyer, tokenId);

        // Mark offer as inactive
        offer.isActive = false;

        // Record usage
        PROMPT_REGISTRY.recordUsage(tokenId);

        emit OfferAccepted(offerId, tokenId, msg.sender, offer.buyer, totalPrice, offer.paymentToken);
    }

    /**
     * @dev Cancel an offer
     * @param tokenId ID of the token
     * @param offerId ID of the offer to cancel
     */
    function cancelOffer(uint256 tokenId, uint256 offerId) external nonReentrant {
        if (offerId >= tokenOffers[tokenId].length) revert OfferNotFound();
        
        Offer storage offer = tokenOffers[tokenId][offerId];
        if (offer.buyer != msg.sender) revert NotOfferMaker();
        if (!offer.isActive) revert OfferNotFound();

        // Refund the locked payment
        if (offer.paymentToken == address(0)) {
            (bool success, ) = payable(msg.sender).call{value: offer.price}("");
            if (!success) revert TransferFailed();
        } else {
            IERC20(offer.paymentToken).safeTransfer(msg.sender, offer.price);
        }

        offer.isActive = false;

        emit OfferCancelled(offerId, tokenId, msg.sender);
    }

    // Admin functions

    /**
     * @dev Set platform fee (only owner)
     * @param _platformFee New platform fee in basis points
     */
    function setPlatformFee(uint256 _platformFee) external onlyOwner {
        if (_platformFee > MAX_PLATFORM_FEE) revert InvalidFee();
        platformFee = _platformFee;
        emit PlatformFeeUpdated(_platformFee);
    }

    /**
     * @dev Set fee recipient (only owner)
     * @param _feeRecipient New fee recipient address
     */
    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        feeRecipient = _feeRecipient;
        emit FeeRecipientUpdated(_feeRecipient);
    }

    /**
     * @dev Update accepted payment token (only owner)
     * @param token Token address
     * @param accepted Whether the token is accepted
     */
    function setPaymentToken(address token, bool accepted) external onlyOwner {
        acceptedPaymentTokens[token] = accepted;
        emit PaymentTokenUpdated(token, accepted);
    }

    // View functions

    /**
     * @dev Get active listings for a token
     * @param tokenId ID of the token
     * @return Array of active listing IDs
     */
    function getActiveListings(uint256 tokenId) external view returns (uint256[] memory) {
        uint256[] memory allListings = tokenListings[tokenId];
        uint256 activeCount = 0;
        
        // Count active listings
        for (uint256 i = 0; i < allListings.length; i++) {
            if (listings[allListings[i]].isActive && 
                block.timestamp <= listings[allListings[i]].expiresAt) {
                activeCount++;
            }
        }
        
        // Create array of active listings
        uint256[] memory activeListings = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allListings.length; i++) {
            if (listings[allListings[i]].isActive && 
                block.timestamp <= listings[allListings[i]].expiresAt) {
                activeListings[index] = allListings[i];
                index++;
            }
        }
        
        return activeListings;
    }

    /**
     * @dev Get active offers for a token
     * @param tokenId ID of the token
     * @return Array of active offers
     */
    function getActiveOffers(uint256 tokenId) external view returns (Offer[] memory) {
        Offer[] memory allOffers = tokenOffers[tokenId];
        uint256 activeCount = 0;
        
        // Count active offers
        for (uint256 i = 0; i < allOffers.length; i++) {
            if (allOffers[i].isActive && block.timestamp <= allOffers[i].expiresAt) {
                activeCount++;
            }
        }
        
        // Create array of active offers
        Offer[] memory activeOffers = new Offer[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allOffers.length; i++) {
            if (allOffers[i].isActive && block.timestamp <= allOffers[i].expiresAt) {
                activeOffers[index] = allOffers[i];
                index++;
            }
        }
        
        return activeOffers;
    }

    /**
     * @dev Get user's active listings
     * @param user Address of the user
     * @return Array of active listing IDs
     */
    function getUserActiveListings(address user) external view returns (uint256[] memory) {
        uint256[] memory allListings = userListings[user];
        uint256 activeCount = 0;
        
        // Count active listings
        for (uint256 i = 0; i < allListings.length; i++) {
            if (listings[allListings[i]].isActive && 
                block.timestamp <= listings[allListings[i]].expiresAt) {
                activeCount++;
            }
        }
        
        // Create array of active listings
        uint256[] memory activeListings = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allListings.length; i++) {
            if (listings[allListings[i]].isActive && 
                block.timestamp <= listings[allListings[i]].expiresAt) {
                activeListings[index] = allListings[i];
                index++;
            }
        }
        
        return activeListings;
    }
}
