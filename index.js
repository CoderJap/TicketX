import { ethers } from "./ethers-6.7.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const mintTicketButton = document.getElementById("mintTicketButton");
const upgradeTicketButton = document.getElementById("upgradeTicketButton");
const checkInButton = document.getElementById("checkInButton");
const tokenInfoButton = document.getElementById("tokenInfoButton");
const getPriceButton = document.getElementById("getPriceButton");
const withdrawButton = document.getElementById("withdrawButton");

const mintStatus = document.getElementById("mintStatus");
const upgradeStatus = document.getElementById("upgradeStatus");
const checkInStatus = document.getElementById("checkInStatus");
const tokenInfoDisplay = document.getElementById("tokenInfoDisplay");
const priceDisplay = document.getElementById("priceDisplay");
const withdrawStatus = document.getElementById("withdrawStatus");

connectButton.onclick = connect;
mintTicketButton.onclick = mintTicket;
upgradeTicketButton.onclick = upgradeTicket;
checkInButton.onclick = checkIn;
tokenInfoButton.onclick = getTicketInfo;
getPriceButton.onclick = getTicketPrice;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      connectButton.innerHTML = "Connected";
      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("Connected account:", accounts[0]);
    } catch (error) {
      console.error(error);
    }
  } else {
    connectButton.innerHTML = "Please install MetaMask";
  }
}

async function mintTicket() {
    console.log("Minting ticket...");
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        // Retrieve the current ticket price from the contract
        const price = await contract.get_current_price();
        console.log("Ticket price:", price.toString());
        
        // Mint the ticket
        const transactionResponse = await contract.mint_ticket({ value: price });
        mintStatus.innerText = "Transaction sent: " + transactionResponse.hash;
        await transactionResponse.wait(1);
        
        // Get the total supply (number of minted tokens)
        const totalSupply = await contract.totalSupply();
        // The minted token id is totalSupply - 1 (since token IDs start at 0)
        const mintedTokenId = totalSupply - 1n; // use BigInt arithmetic
        
        mintStatus.innerText = "Ticket minted successfully! Token ID: " +
          mintedTokenId.toString() +
          "\nNFT Contract Address: " + contractAddress;
      } catch (error) {
        console.error(error);
        mintStatus.innerText = "Error: " + error.message;
      }
    } else {
      mintStatus.innerText = "Please install MetaMask";
    }
  }
  
  
async function upgradeTicket() {
    // Convert token id to an integer
    const tokenId = parseInt(document.getElementById("upgradeTokenId").value);
    console.log(`Upgrading ticket with token ID ${tokenId}...`);
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        // Retrieve the upgrade fee from the contract
        const fee = await contract.get_current_price();
        console.log("Upgrade fee:", fee.toString());
        const transactionResponse = await contract.upgrade_ticket(tokenId, { value: fee });
        upgradeStatus.innerText = "Transaction sent: " + transactionResponse.hash;
        await transactionResponse.wait(1);
        upgradeStatus.innerText = "Ticket upgraded successfully!";
      } catch (error) {
        console.error(error);
        upgradeStatus.innerText = "Error: " + error.message;
      }
    } else {
      upgradeStatus.innerText = "Please install MetaMask";
    }
  }
  

async function checkIn() {
  const tokenId = document.getElementById("checkInTokenId").value;
  console.log(`Checking in ticket with token ID ${tokenId}...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.check_in(tokenId);
      checkInStatus.innerText = "Transaction sent: " + transactionResponse.hash;
      await transactionResponse.wait(1);
      checkInStatus.innerText = "Check in successful!";
    } catch (error) {
      console.error(error);
      checkInStatus.innerText = "Error: " + error.message;
    }
  } else {
    checkInStatus.innerText = "Please install MetaMask";
  }
}

async function getTicketInfo() {
  const tokenId = document.getElementById("tokenInfoId").value;
  console.log(`Fetching ticket info for token ID ${tokenId}...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const ticketURI = await contract.tokenURI(tokenId);
      tokenInfoDisplay.innerText = ticketURI;
    } catch (error) {
      console.error(error);
      tokenInfoDisplay.innerText = "Error: " + error.message;
    }
  } else {
    tokenInfoDisplay.innerText = "Please install MetaMask";
  }
}

async function getTicketPrice() {
  console.log("Fetching current ticket price...");
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    try {
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const price = await contract.get_current_price();
      priceDisplay.innerText = "Current Ticket Price: " + ethers.formatEther(price) + " ETH";
    } catch (error) {
      console.error(error);
      priceDisplay.innerText = "Error: " + error.message;
    }
  } else {
    priceDisplay.innerText = "Please install MetaMask";
  }
}

async function withdraw() {
  console.log("Withdrawing funds...");
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      withdrawStatus.innerText = "Transaction sent: " + transactionResponse.hash;
      await transactionResponse.wait(1);
      withdrawStatus.innerText = "Withdrawal successful!";
    } catch (error) {
      console.error(error);
      withdrawStatus.innerText = "Error: " + error.message;
    }
  } else {
    withdrawStatus.innerText = "Please install MetaMask";
  }
}
    