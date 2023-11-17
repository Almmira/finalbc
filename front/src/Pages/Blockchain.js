import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import abi from "../contractJson/inspo.json";
import Memos from "../Components/Memos";
import { ethers } from "ethers";
import Buy from "../Components/Buy";
import ins from "../Assets/ins.png";
import "../Styles/Blockchain.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function Blockchain() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("Not connected");

  useEffect(() => {
    const template = async () => {
      const contractAddress = "0x4463540b06c3ccCc07b032B53612207C0b0f323c";
      const contractABI = abi.abi;

      try {
        const { ethereum } = window;
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        setAccount(accounts[0]);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        setState({ provider, signer, contract });
      } catch (error) {
        console.error(error);
      }
    };
    template();
  }, []);

  const handleTransactionSuccess = () => {
    toast.success("Transaction successful!");
  };

  const handleTransactionError = (error) => {
    toast.error(`Transaction failed: ${error.message}`);
  };

  const buyInspo = async (event) => {
    event.preventDefault();
    const { contract } = state;
    const name = document.querySelector("#name").value;
    const message = document.querySelector("#message").value;
    const amount = { value: ethers.utils.parseEther("0.001") };

    try {
      const transaction = await contract.buyInspo(name, message, amount);
      await transaction.wait();
      handleTransactionSuccess();
      window.location.reload();
    } catch (error) {
      handleTransactionError(error);
    }
  };

  return (
    <div>
      <Navbar />
      <img src={ins} className="img-fluid" alt=".." width="100%" />
      <p
        style={{
          marginTop: "20px",
          marginBottom: 30,
          marginLeft: "5px",
          textAlign: "center",
          color: "#dd5030",
        }}
      >
        <small>Connected Account - {account}</small>
      </p>
      <Buy state={state} buyInspo={buyInspo} />
      <Memos state={state} />
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default Blockchain;
