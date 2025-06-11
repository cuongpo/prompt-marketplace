// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/AIPromptRegistry.sol";

contract MockIPAssetRegistry {
    mapping(uint256 => mapping(address => mapping(uint256 => address))) public ipIds;
    uint256 private counter = 1;

    function register(uint256 chainId, address tokenContract, uint256 tokenId) 
        external 
        returns (address ipId) 
    {
        ipId = address(uint160(counter));
        ipIds[chainId][tokenContract][tokenId] = ipId;
        counter++;
        return ipId;
    }
}

contract MockLicensingModule {
    // Mock implementation
}

contract MockSPGNFT {
    // Mock implementation
}

contract AIPromptRegistryTest is Test {
    AIPromptRegistry public registry;
    MockIPAssetRegistry public mockIPRegistry;
    MockLicensingModule public mockLicensing;
    MockSPGNFT public mockSPG;

    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);

    event PromptMinted(
        uint256 indexed tokenId,
        address indexed creator,
        address indexed ipId,
        string title,
        string category
    );

    event PromptRated(
        uint256 indexed tokenId,
        address indexed rater,
        uint256 rating
    );

    function setUp() public {
        // Deploy mock contracts
        mockIPRegistry = new MockIPAssetRegistry();
        mockLicensing = new MockLicensingModule();
        mockSPG = new MockSPGNFT();

        // Deploy registry
        vm.prank(owner);
        registry = new AIPromptRegistry(
            address(mockIPRegistry),
            address(mockLicensing),
            address(mockSPG)
        );

        // Fund test accounts
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }

    function testMintPrompt() public {
        string memory title = "Test Prompt";
        string memory description = "A test prompt for AI";
        string memory category = "Text Generation";
        string[] memory tags = new string[](2);
        tags[0] = "test";
        tags[1] = "ai";
        string memory tokenURI = "https://example.com/metadata/1";

        vm.prank(user1);
        vm.expectEmit(true, true, true, true);
        emit PromptMinted(1, user1, address(0x1), title, category);
        
        (uint256 tokenId, address ipId) = registry.mintPrompt(
            user1,
            title,
            description,
            category,
            tags,
            tokenURI
        );

        assertEq(tokenId, 1);
        assertEq(ipId, address(0x1));
        assertEq(registry.ownerOf(tokenId), user1);
        assertEq(registry.tokenURI(tokenId), tokenURI);

        // Check metadata
        AIPromptRegistry.PromptMetadata memory metadata = registry.getPromptMetadata(tokenId);
        assertEq(metadata.title, title);
        assertEq(metadata.description, description);
        assertEq(metadata.category, category);
        assertEq(metadata.creator, user1);
        assertTrue(metadata.isActive);
        assertEq(metadata.usageCount, 0);
        assertEq(metadata.rating, 0);
        assertEq(metadata.ratingCount, 0);
    }

    function testMintPromptWithInvalidCategory() public {
        string memory title = "Test Prompt";
        string memory description = "A test prompt for AI";
        string memory category = "Invalid Category";
        string[] memory tags = new string[](1);
        tags[0] = "test";
        string memory tokenURI = "https://example.com/metadata/1";

        vm.prank(user1);
        vm.expectRevert(AIPromptRegistry.CategoryNotExists.selector);
        registry.mintPrompt(
            user1,
            title,
            description,
            category,
            tags,
            tokenURI
        );
    }

    function testMintPromptWithEmptyTitle() public {
        string memory title = "";
        string memory description = "A test prompt for AI";
        string memory category = "Text Generation";
        string[] memory tags = new string[](1);
        tags[0] = "test";
        string memory tokenURI = "https://example.com/metadata/1";

        vm.prank(user1);
        vm.expectRevert(AIPromptRegistry.EmptyTitle.selector);
        registry.mintPrompt(
            user1,
            title,
            description,
            category,
            tags,
            tokenURI
        );
    }

    function testUpdatePrompt() public {
        // First mint a prompt
        string memory title = "Test Prompt";
        string memory description = "A test prompt for AI";
        string memory category = "Text Generation";
        string[] memory tags = new string[](1);
        tags[0] = "test";
        string memory tokenURI = "https://example.com/metadata/1";

        vm.prank(user1);
        (uint256 tokenId, ) = registry.mintPrompt(
            user1,
            title,
            description,
            category,
            tags,
            tokenURI
        );

        // Update the prompt
        string memory newTitle = "Updated Test Prompt";
        string memory newDescription = "An updated test prompt for AI";

        vm.prank(user1);
        registry.updatePrompt(tokenId, newTitle, newDescription);

        // Check updated metadata
        AIPromptRegistry.PromptMetadata memory metadata = registry.getPromptMetadata(tokenId);
        assertEq(metadata.title, newTitle);
        assertEq(metadata.description, newDescription);
    }

    function testUpdatePromptNotOwner() public {
        // First mint a prompt
        string memory title = "Test Prompt";
        string memory description = "A test prompt for AI";
        string memory category = "Text Generation";
        string[] memory tags = new string[](1);
        tags[0] = "test";
        string memory tokenURI = "https://example.com/metadata/1";

        vm.prank(user1);
        (uint256 tokenId, ) = registry.mintPrompt(
            user1,
            title,
            description,
            category,
            tags,
            tokenURI
        );

        // Try to update from different user
        vm.prank(user2);
        vm.expectRevert(AIPromptRegistry.NotPromptOwner.selector);
        registry.updatePrompt(tokenId, "New Title", "New Description");
    }

    function testRatePrompt() public {
        // First mint a prompt
        string memory title = "Test Prompt";
        string memory description = "A test prompt for AI";
        string memory category = "Text Generation";
        string[] memory tags = new string[](1);
        tags[0] = "test";
        string memory tokenURI = "https://example.com/metadata/1";

        vm.prank(user1);
        (uint256 tokenId, ) = registry.mintPrompt(
            user1,
            title,
            description,
            category,
            tags,
            tokenURI
        );

        // Rate the prompt
        vm.prank(user2);
        vm.expectEmit(true, true, false, true);
        emit PromptRated(tokenId, user2, 5);
        registry.ratePrompt(tokenId, 5);

        // Check rating
        AIPromptRegistry.PromptMetadata memory metadata = registry.getPromptMetadata(tokenId);
        assertEq(metadata.rating, 5);
        assertEq(metadata.ratingCount, 1);
        assertTrue(registry.hasRated(tokenId, user2));
    }

    function testRatePromptInvalidRating() public {
        // First mint a prompt
        string memory title = "Test Prompt";
        string memory description = "A test prompt for AI";
        string memory category = "Text Generation";
        string[] memory tags = new string[](1);
        tags[0] = "test";
        string memory tokenURI = "https://example.com/metadata/1";

        vm.prank(user1);
        (uint256 tokenId, ) = registry.mintPrompt(
            user1,
            title,
            description,
            category,
            tags,
            tokenURI
        );

        // Try to rate with invalid rating
        vm.prank(user2);
        vm.expectRevert(AIPromptRegistry.InvalidRating.selector);
        registry.ratePrompt(tokenId, 6);

        vm.prank(user2);
        vm.expectRevert(AIPromptRegistry.InvalidRating.selector);
        registry.ratePrompt(tokenId, 0);
    }

    function testRatePromptAlreadyRated() public {
        // First mint a prompt
        string memory title = "Test Prompt";
        string memory description = "A test prompt for AI";
        string memory category = "Text Generation";
        string[] memory tags = new string[](1);
        tags[0] = "test";
        string memory tokenURI = "https://example.com/metadata/1";

        vm.prank(user1);
        (uint256 tokenId, ) = registry.mintPrompt(
            user1,
            title,
            description,
            category,
            tags,
            tokenURI
        );

        // Rate the prompt
        vm.prank(user2);
        registry.ratePrompt(tokenId, 5);

        // Try to rate again
        vm.prank(user2);
        vm.expectRevert(AIPromptRegistry.AlreadyRated.selector);
        registry.ratePrompt(tokenId, 4);
    }

    function testRecordUsage() public {
        // First mint a prompt
        string memory title = "Test Prompt";
        string memory description = "A test prompt for AI";
        string memory category = "Text Generation";
        string[] memory tags = new string[](1);
        tags[0] = "test";
        string memory tokenURI = "https://example.com/metadata/1";

        vm.prank(user1);
        (uint256 tokenId, ) = registry.mintPrompt(
            user1,
            title,
            description,
            category,
            tags,
            tokenURI
        );

        // Record usage
        vm.prank(user2);
        registry.recordUsage(tokenId);

        // Check usage count
        AIPromptRegistry.PromptMetadata memory metadata = registry.getPromptMetadata(tokenId);
        assertEq(metadata.usageCount, 1);
    }

    function testTogglePromptStatus() public {
        // First mint a prompt
        string memory title = "Test Prompt";
        string memory description = "A test prompt for AI";
        string memory category = "Text Generation";
        string[] memory tags = new string[](1);
        tags[0] = "test";
        string memory tokenURI = "https://example.com/metadata/1";

        vm.prank(user1);
        (uint256 tokenId, ) = registry.mintPrompt(
            user1,
            title,
            description,
            category,
            tags,
            tokenURI
        );

        // Toggle status
        vm.prank(user1);
        registry.togglePromptStatus(tokenId);

        // Check status
        AIPromptRegistry.PromptMetadata memory metadata = registry.getPromptMetadata(tokenId);
        assertFalse(metadata.isActive);

        // Toggle back
        vm.prank(user1);
        registry.togglePromptStatus(tokenId);

        metadata = registry.getPromptMetadata(tokenId);
        assertTrue(metadata.isActive);
    }

    function testGetCreatorPrompts() public {
        // Mint multiple prompts
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.startPrank(user1);
        registry.mintPrompt(user1, "Prompt 1", "Description 1", "Text Generation", tags, "uri1");
        registry.mintPrompt(user1, "Prompt 2", "Description 2", "Image Generation", tags, "uri2");
        vm.stopPrank();

        uint256[] memory creatorPrompts = registry.getCreatorPrompts(user1);
        assertEq(creatorPrompts.length, 2);
        assertEq(creatorPrompts[0], 1);
        assertEq(creatorPrompts[1], 2);
    }

    function testAddCategory() public {
        string memory newCategory = "New Category";
        
        vm.prank(owner);
        registry.addCategory(newCategory);
        
        assertTrue(registry.categoryExists(newCategory));
    }

    function testGetCurrentTokenId() public {
        assertEq(registry.getCurrentTokenId(), 0);
        
        // Mint a prompt
        string[] memory tags = new string[](1);
        tags[0] = "test";
        
        vm.prank(user1);
        registry.mintPrompt(user1, "Test", "Description", "Text Generation", tags, "uri");
        
        assertEq(registry.getCurrentTokenId(), 1);
    }
}
