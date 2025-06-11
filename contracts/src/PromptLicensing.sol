// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@storyprotocol/core/interfaces/modules/licensing/ILicensingModule.sol";
import "@storyprotocol/core/interfaces/ILicenseToken.sol";
import "@storyprotocol/core/interfaces/modules/royalty/IRoyaltyModule.sol";
import "@storyprotocol/core/interfaces/modules/licensing/IPILicenseTemplate.sol";
import "./AIPromptRegistry.sol";

/**
 * @title PromptLicensing
 * @dev Handles licensing of AI prompts using Story Protocol's licensing system
 * @notice This contract manages license terms, minting license tokens, and revenue sharing
 */
contract PromptLicensing is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Story Protocol contracts
    ILicensingModule public immutable LICENSING_MODULE;
    ILicenseToken public immutable LICENSE_TOKEN;
    IRoyaltyModule public immutable ROYALTY_MODULE;
    IPILicenseTemplate public immutable PIL_TEMPLATE;
    AIPromptRegistry public immutable PROMPT_REGISTRY;

    // License types
    enum LicenseType {
        PERSONAL_USE,      // Personal use only
        COMMERCIAL_USE,    // Commercial use allowed
        DERIVATIVE_WORK,   // Can create derivatives
        EXCLUSIVE_USE      // Exclusive licensing
    }

    // License terms structure
    struct LicenseTerms {
        LicenseType licenseType;
        uint256 price;
        address paymentToken;
        uint256 royaltyPercentage; // In basis points (e.g., 1000 = 10%)
        bool transferable;
        bool commercialUse;
        bool derivativeWorks;
        uint256 maxUsages; // 0 = unlimited
        uint256 duration; // 0 = perpetual
        string customTerms;
    }

    // License purchase record
    struct LicensePurchase {
        uint256 tokenId;
        address licensee;
        uint256 licenseTermsId;
        uint256 purchaseTime;
        uint256 expiryTime;
        uint256 usageCount;
        bool isActive;
    }

    // Mappings
    mapping(uint256 => mapping(uint256 => LicenseTerms)) public tokenLicenseTerms; // tokenId => termsId => LicenseTerms
    mapping(uint256 => uint256) public tokenLicenseTermsCount; // tokenId => count of license terms
    mapping(uint256 => LicensePurchase[]) public tokenLicenses; // tokenId => LicensePurchase[]
    mapping(address => uint256[]) public userLicenses; // user => tokenIds with licenses
    mapping(uint256 => mapping(address => uint256[])) public userTokenLicenses; // tokenId => user => license indices

    // Revenue tracking
    mapping(uint256 => uint256) public tokenRevenue; // tokenId => total revenue
    mapping(address => uint256) public creatorRevenue; // creator => total revenue

    // Events
    event LicenseTermsCreated(
        uint256 indexed tokenId,
        uint256 indexed termsId,
        LicenseType licenseType,
        uint256 price
    );

    event LicensePurchased(
        uint256 indexed tokenId,
        address indexed licensee,
        uint256 indexed termsId,
        uint256 price,
        uint256 licenseId
    );

    event LicenseUsed(
        uint256 indexed tokenId,
        address indexed licensee,
        uint256 indexed licenseId
    );

    event RoyaltyPaid(
        uint256 indexed tokenId,
        address indexed payer,
        uint256 amount
    );

    event RevenueWithdrawn(
        address indexed creator,
        uint256 amount
    );

    // Custom errors
    error InvalidTokenId();
    error NotTokenOwner();
    error InvalidLicenseTerms();
    error LicenseNotFound();
    error LicenseExpired();
    error LicenseUsageLimitReached();
    error InsufficientPayment();
    error TransferFailed();
    error InvalidRoyaltyPercentage();
    error NoRevenue();

    /**
     * @dev Constructor
     * @param _licensingModule Address of the Licensing Module
     * @param _licenseToken Address of the License Token contract
     * @param _royaltyModule Address of the Royalty Module
     * @param _pilTemplate Address of the PIL Template
     * @param _promptRegistry Address of the AI Prompt Registry
     */
    constructor(
        address _licensingModule,
        address _licenseToken,
        address _royaltyModule,
        address _pilTemplate,
        address _promptRegistry
    ) {
        LICENSING_MODULE = ILicensingModule(_licensingModule);
        LICENSE_TOKEN = ILicenseToken(_licenseToken);
        ROYALTY_MODULE = IRoyaltyModule(_royaltyModule);
        PIL_TEMPLATE = IPILicenseTemplate(_pilTemplate);
        PROMPT_REGISTRY = AIPromptRegistry(_promptRegistry);
    }

    /**
     * @dev Create license terms for a prompt
     * @param tokenId ID of the prompt token
     * @param licenseType Type of license
     * @param price Price for the license
     * @param paymentToken Payment token address (address(0) for ETH)
     * @param royaltyPercentage Royalty percentage in basis points
     * @param transferable Whether the license is transferable
     * @param commercialUse Whether commercial use is allowed
     * @param derivativeWorks Whether derivative works are allowed
     * @param maxUsages Maximum number of usages (0 = unlimited)
     * @param duration Duration of the license in seconds (0 = perpetual)
     * @param customTerms Custom terms string
     */
    function createLicenseTerms(
        uint256 tokenId,
        LicenseType licenseType,
        uint256 price,
        address paymentToken,
        uint256 royaltyPercentage,
        bool transferable,
        bool commercialUse,
        bool derivativeWorks,
        uint256 maxUsages,
        uint256 duration,
        string memory customTerms
    ) external {
        if (PROMPT_REGISTRY.ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        if (royaltyPercentage > 10000) revert InvalidRoyaltyPercentage(); // Max 100%

        uint256 termsId = tokenLicenseTermsCount[tokenId];
        
        tokenLicenseTerms[tokenId][termsId] = LicenseTerms({
            licenseType: licenseType,
            price: price,
            paymentToken: paymentToken,
            royaltyPercentage: royaltyPercentage,
            transferable: transferable,
            commercialUse: commercialUse,
            derivativeWorks: derivativeWorks,
            maxUsages: maxUsages,
            duration: duration,
            customTerms: customTerms
        });

        tokenLicenseTermsCount[tokenId]++;

        emit LicenseTermsCreated(tokenId, termsId, licenseType, price);
    }

    /**
     * @dev Purchase a license for a prompt
     * @param tokenId ID of the prompt token
     * @param termsId ID of the license terms
     */
    function purchaseLicense(uint256 tokenId, uint256 termsId) external payable nonReentrant {
        if (termsId >= tokenLicenseTermsCount[tokenId]) revert InvalidLicenseTerms();
        
        LicenseTerms memory terms = tokenLicenseTerms[tokenId][termsId];
        address tokenOwner = PROMPT_REGISTRY.ownerOf(tokenId);
        
        // Handle payment
        if (terms.paymentToken == address(0)) {
            // ETH payment
            if (msg.value < terms.price) revert InsufficientPayment();
            
            // Calculate royalty
            uint256 royaltyAmount = (terms.price * terms.royaltyPercentage) / 10000;
            uint256 ownerAmount = terms.price - royaltyAmount;
            
            // Transfer to token owner
            (bool success1, ) = payable(tokenOwner).call{value: ownerAmount}("");
            if (!success1) revert TransferFailed();
            
            // Handle royalty (if any)
            if (royaltyAmount > 0) {
                // For now, send to contract for later distribution
                // In a full implementation, this would integrate with Story Protocol's royalty system
            }
            
            // Refund excess
            if (msg.value > terms.price) {
                (bool success2, ) = payable(msg.sender).call{value: msg.value - terms.price}("");
                if (!success2) revert TransferFailed();
            }
        } else {
            // ERC20 payment
            IERC20 token = IERC20(terms.paymentToken);
            uint256 royaltyAmount = (terms.price * terms.royaltyPercentage) / 10000;
            uint256 ownerAmount = terms.price - royaltyAmount;
            
            token.safeTransferFrom(msg.sender, tokenOwner, ownerAmount);
            if (royaltyAmount > 0) {
                token.safeTransferFrom(msg.sender, address(this), royaltyAmount);
            }
        }

        // Create license purchase record
        uint256 expiryTime = terms.duration == 0 ? 0 : block.timestamp + terms.duration;
        uint256 licenseId = tokenLicenses[tokenId].length;
        
        tokenLicenses[tokenId].push(LicensePurchase({
            tokenId: tokenId,
            licensee: msg.sender,
            licenseTermsId: termsId,
            purchaseTime: block.timestamp,
            expiryTime: expiryTime,
            usageCount: 0,
            isActive: true
        }));

        // Update user licenses
        userLicenses[msg.sender].push(tokenId);
        userTokenLicenses[tokenId][msg.sender].push(licenseId);

        // Update revenue tracking
        tokenRevenue[tokenId] += terms.price;
        creatorRevenue[tokenOwner] += terms.price;

        emit LicensePurchased(tokenId, msg.sender, termsId, terms.price, licenseId);
    }

    /**
     * @dev Use a license (increment usage count)
     * @param tokenId ID of the prompt token
     * @param licenseId ID of the license
     */
    function useLicense(uint256 tokenId, uint256 licenseId) external {
        if (licenseId >= tokenLicenses[tokenId].length) revert LicenseNotFound();
        
        LicensePurchase storage license = tokenLicenses[tokenId][licenseId];
        if (license.licensee != msg.sender) revert LicenseNotFound();
        if (!license.isActive) revert LicenseNotFound();
        
        // Check expiry
        if (license.expiryTime != 0 && block.timestamp > license.expiryTime) {
            license.isActive = false;
            revert LicenseExpired();
        }
        
        // Check usage limit
        LicenseTerms memory terms = tokenLicenseTerms[tokenId][license.licenseTermsId];
        if (terms.maxUsages != 0 && license.usageCount >= terms.maxUsages) {
            license.isActive = false;
            revert LicenseUsageLimitReached();
        }
        
        license.usageCount++;
        
        // Record usage in the prompt registry
        PROMPT_REGISTRY.recordUsage(tokenId);
        
        emit LicenseUsed(tokenId, msg.sender, licenseId);
    }

    /**
     * @dev Check if a user has a valid license for a token
     * @param tokenId ID of the prompt token
     * @param user Address of the user
     * @return hasLicense Whether the user has a valid license
     * @return licenseId ID of the valid license (if any)
     */
    function hasValidLicense(uint256 tokenId, address user) 
        external 
        view 
        returns (bool hasLicense, uint256 licenseId) 
    {
        uint256[] memory userLicenseIds = userTokenLicenses[tokenId][user];
        
        for (uint256 i = 0; i < userLicenseIds.length; i++) {
            LicensePurchase memory license = tokenLicenses[tokenId][userLicenseIds[i]];
            
            if (license.isActive) {
                // Check expiry
                if (license.expiryTime == 0 || block.timestamp <= license.expiryTime) {
                    // Check usage limit
                    LicenseTerms memory terms = tokenLicenseTerms[tokenId][license.licenseTermsId];
                    if (terms.maxUsages == 0 || license.usageCount < terms.maxUsages) {
                        return (true, userLicenseIds[i]);
                    }
                }
            }
        }
        
        return (false, 0);
    }

    /**
     * @dev Get license terms for a token
     * @param tokenId ID of the prompt token
     * @param termsId ID of the license terms
     * @return License terms struct
     */
    function getLicenseTerms(uint256 tokenId, uint256 termsId) 
        external 
        view 
        returns (LicenseTerms memory) 
    {
        if (termsId >= tokenLicenseTermsCount[tokenId]) revert InvalidLicenseTerms();
        return tokenLicenseTerms[tokenId][termsId];
    }

    /**
     * @dev Get all license terms for a token
     * @param tokenId ID of the prompt token
     * @return Array of license terms
     */
    function getAllLicenseTerms(uint256 tokenId) 
        external 
        view 
        returns (LicenseTerms[] memory) 
    {
        uint256 count = tokenLicenseTermsCount[tokenId];
        LicenseTerms[] memory terms = new LicenseTerms[](count);
        
        for (uint256 i = 0; i < count; i++) {
            terms[i] = tokenLicenseTerms[tokenId][i];
        }
        
        return terms;
    }

    /**
     * @dev Get user's licenses for a token
     * @param tokenId ID of the prompt token
     * @param user Address of the user
     * @return Array of license purchases
     */
    function getUserLicenses(uint256 tokenId, address user) 
        external 
        view 
        returns (LicensePurchase[] memory) 
    {
        uint256[] memory licenseIds = userTokenLicenses[tokenId][user];
        LicensePurchase[] memory licenses = new LicensePurchase[](licenseIds.length);
        
        for (uint256 i = 0; i < licenseIds.length; i++) {
            licenses[i] = tokenLicenses[tokenId][licenseIds[i]];
        }
        
        return licenses;
    }

    /**
     * @dev Get total revenue for a token
     * @param tokenId ID of the prompt token
     * @return Total revenue generated
     */
    function getTokenRevenue(uint256 tokenId) external view returns (uint256) {
        return tokenRevenue[tokenId];
    }

    /**
     * @dev Get creator's total revenue
     * @param creator Address of the creator
     * @return Total revenue earned
     */
    function getCreatorRevenue(address creator) external view returns (uint256) {
        return creatorRevenue[creator];
    }

    /**
     * @dev Withdraw accumulated revenue (for future royalty distribution)
     * @param amount Amount to withdraw
     */
    function withdrawRevenue(uint256 amount) external nonReentrant {
        if (creatorRevenue[msg.sender] < amount) revert NoRevenue();
        
        creatorRevenue[msg.sender] -= amount;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) revert TransferFailed();
        
        emit RevenueWithdrawn(msg.sender, amount);
    }
}
