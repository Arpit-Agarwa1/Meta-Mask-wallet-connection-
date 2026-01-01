import React, { useState } from "react";
import { ethers } from "ethers";

export default function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    try {
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        setError("Please install MetaMask extension!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      const accounts = await provider.send("eth_requestAccounts", []);
      const selectedAccount = accounts[0];

      setAccount(selectedAccount);

      const rawBalance = await provider.getBalance(selectedAccount);
      const ethBalance = ethers.formatEther(rawBalance);
      setBalance(ethBalance);
      setError("");
    } catch (err) {
      console.error(err);

      // Handle MetaMask / ethers error codes
      if (err.code === 4001 || err.code === "ACTION_REJECTED") {
        // 4001 = userRejectedRequest (MetaMask), ACTION_REJECTED = ethers wrapper
        setError(
          "You rejected the connection request. Please approve it to connect your wallet."
        );
      } else if (err.code === -32002) {
        // Request already pending
        setError(
          "A connection request is already open in MetaMask. Check the extension popup."
        );
      } else {
        setError(err.message || "Failed to connect wallet");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={connectWallet}>Connect Wallet</button>

      {account && <p>Connected account: {account}</p>}

      {balance && <p>Balance: {balance} ETH</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
