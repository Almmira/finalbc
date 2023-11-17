const hre = require("hardhat");

async function main() {
  // Deploy the Inspo contract
  const Inspo = await hre.ethers.getContractFactory("inspo");
  const inspo = await Inspo.deploy();
  await inspo.waitForDeployment();
  console.log("Inspo deployed to:", `${inspo.target}`);

  // Deploy the QuizContract
  const QuizContract = await hre.ethers.getContractFactory("QuizContract");
  const quizContract = await QuizContract.deploy();
  await quizContract.waitForDeployment();
  console.log("QuizContract deployed to:", `${quizContract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//Deployed contract address: 0x78f3C4b9121A8e12bCD271214E2A0E61f8ed8b81 - мое

//Inspo deployed to: 0x8A2b5d935B0eb8Efa0D735C27f413E81DB2e3465
//QuizContract deployed to: 0x00E0f3E35A9d69f1f946085A40e5a91B7B9e9088

// Inspo deployed to: 0x362c65757e9D42b45d56b777c910e54668d964bf
// QuizContract deployed to: 0xcAAf504c39E5c18A91bA0f63dB93d7aAc7c7aAb0

//Inspo deployed to: 0x4463540b06c3ccCc07b032B53612207C0b0f323c
//QuizContract deployed to: 0xb2cDDd23dd7914e80c1285D92BcbB25925AB831c
