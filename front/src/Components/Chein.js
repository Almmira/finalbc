import React, { useState } from "react";
import { create } from "ipfs-http-client";

function MyDApp() {
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [file, setFile] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setConnectedAccount(accounts[0]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const logout = () => {
    setConnectedAccount(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToIPFS = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const ipfsNodeUrl = "https://ipfs.infura.io:5001/api/v0/";
    const ipfsClient = create({ url: ipfsNodeUrl });

    const fileBuffer = await file.arrayBuffer();
    const result = await ipfsClient.add(fileBuffer);

    console.log("IPFS Hash:", result.path);
    // Use result.path as needed (e.g., store or share the IPFS hash)
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        marginBottom: 50,
        marginTop: 50,
      }}
    >
      <h1 style={{ textAlign: "center" }}>Share your document</h1>

      <button onClick={connectWallet}>Connect</button>
      {connectedAccount && (
        <p style={{ color: "#dd5030" }}>Your account: {connectedAccount} </p>
      )}
      {connectedAccount ? <button onClick={logout}>Logout</button> : null}
      <h3 style={{ marginTop: 10, marginBottom: 10 }}>
        Upload Content to IPFS
      </h3>
      <input
        type="file"
        style={{ marginTop: 10, marginBottom: 10 }}
        onChange={handleFileChange}
      />
      <button onClick={uploadToIPFS}>Upload</button>
    </div>
  );
}

export default MyDApp;
