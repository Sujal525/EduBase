import { ethers } from "hardhat";

async function main() {
  // Get the deployer's signer
  const [deployer] = await ethers.getSigners();

  // Print the deployer's wallet address
  const deployerAddress = await deployer.getAddress();
  console.log("🚀 Deploying contract with address:", deployerAddress);

  // Create the contract factory
  const CredentialNFT = await ethers.getContractFactory("CredentialNFT");

  // Deploy the contract and pass the deployer's address to constructor
  const contract = await CredentialNFT.deploy(deployerAddress);

  // Wait for deployment confirmation
  const deployedContract = await contract.waitForDeployment();

  // Get the deployed contract address
  const contractAddress = await deployedContract.getAddress();

  console.log("✅ CredentialNFT deployed to:", contractAddress);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
