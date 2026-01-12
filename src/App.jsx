import React, { useState } from "react";
import { ethers } from "ethers";
import "./App.css";

export default function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");

  const shortAddress = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

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
      setBalance(ethers.formatEther(rawBalance));
      setError("");
    } catch (err) {
      console.error(err);

      if (err.code === 4001 || err.code === "ACTION_REJECTED") {
        setError(
          "You rejected the connection request. Please approve it to connect your wallet."
        );
      } else if (err.code === -32002) {
        setError(
          "A connection request is already open in MetaMask. Check the extension popup."
        );
      } else {
        setError(err.message || "Failed to connect wallet");
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    setError("");
  };

  return (
    <div className="wallet-card">
      <h1>MetaMask Wallet</h1>

      {!account ? (
        <button className="wallet-btn" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <>
          <button className="wallet-btn connected">
            {shortAddress(account)}
          </button>

          <button className="wallet-btn logout" onClick={disconnectWallet}>
            Logout
          </button>
        </>
      )}

      {balance && <p className="balance">Balance: {balance} ETH</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
