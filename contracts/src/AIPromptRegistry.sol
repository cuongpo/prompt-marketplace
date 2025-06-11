// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@storyprotocol/core/interfaces/registries/IIPAssetRegistry.sol";
import "@storyprotocol/core/interfaces/modules/licensing/ILicensingModule.sol";
import "@storyprotocol/periphery/interfaces/ISPGNFT.sol";

/**
 * @title AIPromptRegistry
 * @dev Smart contract for registering AI prompts as IP Assets on Story Protocol
 * @notice This contract allows users to mint NFTs representing AI prompts and register them as IP Assets
 */
contract AIPromptRegistry is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // State variables
    Counters.Counter private _tokenIdCounter;
    IIPAssetRegistry public immutable IP_ASSET_REGISTRY;
    ILicensingModule public immutable LICENSING_MODULE;
    ISPGNFT public immutable SPG_NFT;

    // Prompt metadata structure
    struct PromptMetadata {
        string title;
        string description;
        string category;
        string[] tags;
        uint256 createdAt;
        address creator;
        bool isActive;
        uint256 usageCount;
        uint256 rating;
        uint256 ratingCount;
    }

    // Mappings
    mapping(uint256 => PromptMetadata) public promptMetadata;
    mapping(uint256 => address) public promptToIpId; // tokenId => ipId
    mapping(address => uint256[]) public creatorPrompts;
    mapping(string => bool) public categoryExists;
    mapping(uint256 => mapping(address => bool)) public hasRated;

    // Events
    event PromptMinted(
        uint256 indexed tokenId,
        address indexed creator,
        address indexed ipId,
        string title,
        string category
    );
    
    event PromptUpdated(
        uint256 indexed tokenId,
        string title,
        string description
    );
    
    event PromptRated(
        uint256 indexed tokenId,
        address indexed rater,
        uint256 rating
    );
    
    event PromptUsed(
        uint256 indexed tokenId,
        address indexed user
    );

    event CategoryAdded(string category);

    // Custom errors
    error InvalidTokenId();
    error NotPromptOwner();
    error PromptNotActive();
    error InvalidRating();
    error AlreadyRated();
    error CategoryNotExists();
    error EmptyTitle();
    error EmptyDescription();

    /**
     * @dev Constructor
     * @param _ipAssetRegistry Address of the IP Asset Registry
     * @param _licensingModule Address of the Licensing Module
     * @param _spgNft Address of the SPG NFT contract
     */
    constructor(
        address _ipAssetRegistry,
        address _licensingModule,
        address _spgNft
    ) ERC721("AI Prompt NFT", "AIPROMPT") {
        IP_ASSET_REGISTRY = IIPAssetRegistry(_ipAssetRegistry);
        LICENSING_MODULE = ILicensingModule(_licensingModule);
        SPG_NFT = ISPGNFT(_spgNft);
        
        // Add default categories
        _addCategory("Text Generation");
        _addCategory("Image Generation");
        _addCategory("Code Generation");
        _addCategory("Creative Writing");
        _addCategory("Business");
        _addCategory("Education");
        _addCategory("Entertainment");
        _addCategory("Other");
    }

    /**
     * @dev Mint a new AI prompt NFT and register it as an IP Asset
     * @param to Address to mint the NFT to
     * @param title Title of the prompt
     * @param description Description of the prompt
     * @param category Category of the prompt
     * @param tags Array of tags for the prompt
     * @param _tokenURI URI for the token metadata
     * @return tokenId The ID of the minted token
     * @return ipId The address of the registered IP Asset
     */
    function mintPrompt(
        address to,
        string memory title,
        string memory description,
        string memory category,
        string[] memory tags,
        string memory _tokenURI
    ) external nonReentrant returns (uint256 tokenId, address ipId) {
        if (bytes(title).length == 0) revert EmptyTitle();
        if (bytes(description).length == 0) revert EmptyDescription();
        if (!categoryExists[category]) revert CategoryNotExists();

        // Increment token ID
        _tokenIdCounter.increment();
        tokenId = _tokenIdCounter.current();

        // Mint NFT
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        // Register as IP Asset
        ipId = IP_ASSET_REGISTRY.register(block.chainid, address(this), tokenId);

        // Store prompt metadata
        promptMetadata[tokenId] = PromptMetadata({
            title: title,
            description: description,
            category: category,
            tags: tags,
            createdAt: block.timestamp,
            creator: to,
            isActive: true,
            usageCount: 0,
            rating: 0,
            ratingCount: 0
        });

        // Update mappings
        promptToIpId[tokenId] = ipId;
        creatorPrompts[to].push(tokenId);

        emit PromptMinted(tokenId, to, ipId, title, category);
    }

    /**
     * @dev Update prompt metadata (only by owner)
     * @param tokenId ID of the token to update
     * @param title New title
     * @param description New description
     */
    function updatePrompt(
        uint256 tokenId,
        string memory title,
        string memory description
    ) external {
        if (!_exists(tokenId)) revert InvalidTokenId();
        if (ownerOf(tokenId) != msg.sender) revert NotPromptOwner();
        if (bytes(title).length == 0) revert EmptyTitle();
        if (bytes(description).length == 0) revert EmptyDescription();

        promptMetadata[tokenId].title = title;
        promptMetadata[tokenId].description = description;

        emit PromptUpdated(tokenId, title, description);
    }

    /**
     * @dev Rate a prompt (1-5 stars)
     * @param tokenId ID of the token to rate
     * @param rating Rating value (1-5)
     */
    function ratePrompt(uint256 tokenId, uint256 rating) external {
        if (!_exists(tokenId)) revert InvalidTokenId();
        if (!promptMetadata[tokenId].isActive) revert PromptNotActive();
        if (rating < 1 || rating > 5) revert InvalidRating();
        if (hasRated[tokenId][msg.sender]) revert AlreadyRated();

        PromptMetadata storage prompt = promptMetadata[tokenId];
        
        // Update rating
        uint256 totalRating = prompt.rating * prompt.ratingCount + rating;
        prompt.ratingCount++;
        prompt.rating = totalRating / prompt.ratingCount;
        
        hasRated[tokenId][msg.sender] = true;

        emit PromptRated(tokenId, msg.sender, rating);
    }

    /**
     * @dev Record prompt usage
     * @param tokenId ID of the token being used
     */
    function recordUsage(uint256 tokenId) external {
        if (!_exists(tokenId)) revert InvalidTokenId();
        if (!promptMetadata[tokenId].isActive) revert PromptNotActive();

        promptMetadata[tokenId].usageCount++;

        emit PromptUsed(tokenId, msg.sender);
    }

    /**
     * @dev Add a new category (only owner)
     * @param category Category name to add
     */
    function addCategory(string memory category) external onlyOwner {
        _addCategory(category);
    }

    /**
     * @dev Internal function to add category
     * @param category Category name to add
     */
    function _addCategory(string memory category) internal {
        categoryExists[category] = true;
        emit CategoryAdded(category);
    }

    /**
     * @dev Toggle prompt active status (only owner of the prompt)
     * @param tokenId ID of the token to toggle
     */
    function togglePromptStatus(uint256 tokenId) external {
        if (!_exists(tokenId)) revert InvalidTokenId();
        if (ownerOf(tokenId) != msg.sender) revert NotPromptOwner();

        promptMetadata[tokenId].isActive = !promptMetadata[tokenId].isActive;
    }

    /**
     * @dev Get prompt metadata
     * @param tokenId ID of the token
     * @return Prompt metadata struct
     */
    function getPromptMetadata(uint256 tokenId) external view returns (PromptMetadata memory) {
        if (!_exists(tokenId)) revert InvalidTokenId();
        return promptMetadata[tokenId];
    }

    /**
     * @dev Get prompts created by a specific address
     * @param creator Address of the creator
     * @return Array of token IDs
     */
    function getCreatorPrompts(address creator) external view returns (uint256[] memory) {
        return creatorPrompts[creator];
    }

    /**
     * @dev Get IP Asset address for a token
     * @param tokenId ID of the token
     * @return IP Asset address
     */
    function getIpId(uint256 tokenId) external view returns (address) {
        if (!_exists(tokenId)) revert InvalidTokenId();
        return promptToIpId[tokenId];
    }

    /**
     * @dev Get current token ID counter
     * @return Current token ID
     */
    function getCurrentTokenId() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    // Override functions for ERC721URIStorage
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}
