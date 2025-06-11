// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/AIPromptRegistry.sol";
import "../src/PromptMarketplace.sol";
import "../src/PromptLicensing.sol";

/**
 * @title Deploy
 * @dev Deployment script for AI Prompt Marketplace contracts
 */
contract Deploy is Script {
    // Story Protocol Aeneid Testnet contract addresses
    address constant IP_ASSET_REGISTRY = 0x77319B4031e6eF1250907aa00018B8B1c67a244b;
    address constant LICENSING_MODULE = 0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f;
    address constant LICENSE_TOKEN = 0xFe3838BFb30B34170F00030B52eA4893d8aAC6bC;
    address constant ROYALTY_MODULE = 0xD2f60c40fEbccf6311f8B47c4f2Ec6b040400086;
    address constant PIL_TEMPLATE = 0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316;
    address constant SPG_NFT = 0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37; // Using SPGNFTImpl

    // Deployment configuration
    address constant FEE_RECIPIENT = 0x742d35cC6634c0532925A3B8D0c9E3e0C8B8b8F8; // Update with actual fee recipient

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts with account:", deployer);
        console.log("Account balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy AIPromptRegistry
        console.log("Deploying AIPromptRegistry...");
        AIPromptRegistry promptRegistry = new AIPromptRegistry(
            IP_ASSET_REGISTRY,
            LICENSING_MODULE,
            SPG_NFT
        );
        console.log("AIPromptRegistry deployed at:", address(promptRegistry));

        // Deploy PromptMarketplace
        console.log("Deploying PromptMarketplace...");
        PromptMarketplace marketplace = new PromptMarketplace(
            address(promptRegistry),
            FEE_RECIPIENT
        );
        console.log("PromptMarketplace deployed at:", address(marketplace));

        // Deploy PromptLicensing
        console.log("Deploying PromptLicensing...");
        PromptLicensing licensing = new PromptLicensing(
            LICENSING_MODULE,
            LICENSE_TOKEN,
            ROYALTY_MODULE,
            PIL_TEMPLATE,
            address(promptRegistry)
        );
        console.log("PromptLicensing deployed at:", address(licensing));

        vm.stopBroadcast();

        // Log deployment summary
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("AIPromptRegistry:", address(promptRegistry));
        console.log("PromptMarketplace:", address(marketplace));
        console.log("PromptLicensing:", address(licensing));
        console.log("Deployer:", deployer);
        console.log("Fee Recipient:", FEE_RECIPIENT);

        // Save deployment addresses to file
        string memory deploymentInfo = string(abi.encodePacked(
            "{\n",
            '  "AIPromptRegistry": "', vm.toString(address(promptRegistry)), '",\n',
            '  "PromptMarketplace": "', vm.toString(address(marketplace)), '",\n',
            '  "PromptLicensing": "', vm.toString(address(licensing)), '",\n',
            '  "deployer": "', vm.toString(deployer), '",\n',
            '  "feeRecipient": "', vm.toString(FEE_RECIPIENT), '",\n',
            '  "network": "', vm.toString(block.chainid), '",\n',
            '  "timestamp": "', vm.toString(block.timestamp), '"\n',
            "}"
        ));

        vm.writeFile("./deploy-out/deployment.json", deploymentInfo);
        console.log("\nDeployment info saved to ./deploy-out/deployment.json");
    }
}

/**
 * @title DeployTestnet
 * @dev Deployment script specifically for Story testnet
 */
contract DeployTestnet is Script {
    // Story Protocol Aeneid Testnet contract addresses
    address constant IP_ASSET_REGISTRY = 0x77319B4031e6eF1250907aa00018B8B1c67a244b;
    address constant LICENSING_MODULE = 0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f;
    address constant LICENSE_TOKEN = 0xFe3838BFb30B34170F00030B52eA4893d8aAC6bC;
    address constant ROYALTY_MODULE = 0xD2f60c40fEbccf6311f8B47c4f2Ec6b040400086;
    address constant PIL_TEMPLATE = 0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316;
    address constant SPG_NFT = 0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying to Story Testnet...");
        console.log("Deployer:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy contracts
        AIPromptRegistry promptRegistry = new AIPromptRegistry(
            IP_ASSET_REGISTRY,
            LICENSING_MODULE,
            SPG_NFT
        );

        PromptMarketplace marketplace = new PromptMarketplace(
            address(promptRegistry),
            deployer // Use deployer as fee recipient for testnet
        );

        PromptLicensing licensing = new PromptLicensing(
            LICENSING_MODULE,
            LICENSE_TOKEN,
            ROYALTY_MODULE,
            PIL_TEMPLATE,
            address(promptRegistry)
        );

        vm.stopBroadcast();

        console.log("Testnet deployment complete!");
        console.log("AIPromptRegistry:", address(promptRegistry));
        console.log("PromptMarketplace:", address(marketplace));
        console.log("PromptLicensing:", address(licensing));
    }
}
