// Saved.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/Saved.css";
import uvedomlenie from "./uvedomlenie";
import { ethers } from "ethers";

function Saved() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [inputString, setInputString] = useState("");
  const [count, setCount] = useState(0);

  const contractABI = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "content",
          type: "string",
        },
      ],
      name: "QuizCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "QuizTransferred",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "quizId",
          type: "uint256",
        },
      ],
      name: "buyQuiz",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "contractOwner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "content",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "creationFee",
          type: "uint256",
        },
      ],
      name: "createQuiz",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "quizId",
          type: "uint256",
        },
      ],
      name: "deleteQuiz",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllQuizzes",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
        {
          internalType: "string[]",
          name: "",
          type: "string[]",
        },
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "quizId",
          type: "uint256",
        },
      ],
      name: "getQuiz",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "",
          type: "string",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "getQuizzesByOwner",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
        {
          internalType: "string[]",
          name: "",
          type: "string[]",
        },
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
        {
          internalType: "bool[]",
          name: "",
          type: "bool[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "nextQuizId",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "quizExists",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "quizzes",
      outputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "content",
          type: "string",
        },
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "isDeleted",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "quizId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "setQuizForSale",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const contractAddress = "0xb2cDDd23dd7914e80c1285D92BcbB25925AB831c";

  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [quizName, setQuizName] = useState("");
  const [activeQuiz, setActiveQuiz] = useState(null);

  const navigate = useNavigate();

  const toggleQuiz = (quizName) => {
    if (activeQuiz === quizName) {
      setActiveQuiz(null);
    } else {
      setActiveQuiz(quizName);
    }
  };

  const handleQuiz = (questions) => {
    console.log(savedQuizzes);
    navigate("/Quizz2", { state: { questions: questions } });
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const signer = provider.getSigner();
      setSigner(signer);

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      setContract(contract);
    }
  }, []);

  useEffect(() => {
    async function fetchQuizzes() {
      if (provider) {
        try {
          const quizzes = await getAllQuizzesByOwner(
            provider,
            contractAddress,
            contractABI
          );
          if (quizzes) {
            setSavedQuizzes(quizzes);
          }
        } catch (error) {
          console.error("Error fetching quizzes:", error);
        }
      }
    }

    fetchQuizzes();
  }, [provider, count]); // Add other dependencies if necessary

  async function getAllQuizzes(provider, contractAddress, contractABI) {
    try {
      const quizContract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      let ids = (await quizContract.getAllQuizzes())[0];
      let quizzes = (await quizContract.getAllQuizzes())[1];
      const quizList = [];
      try {
        for (let i = 0; i < quizzes.length; i++) {
          quizList.push(JSON.parse(quizzes[i]));
          quizList[i].id = ids[i];
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
      console.log("All Quizzes:", quizList);
      return quizList;
    } catch (error) {
      console.error("Error fetching all quizzes:", error);
    }
  }

  async function getAllQuizzesByOwner(provider, contractAddress, contractABI) {
    try {
      const quizContract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      const ownerAddress = await signer.getAddress();
      console.log(ownerAddress);
      // const quizzesData = await quizContract.getQuizzesByOwner(ownerAddress);

      let ids = (await quizContract.getQuizzesByOwner(ownerAddress))[0];
      let quizzes = (await quizContract.getQuizzesByOwner(ownerAddress))[1];
      const quizList = [];
      try {
        for (let i = 0; i < quizzes.length; i++) {
          quizList.push(JSON.parse(quizzes[i]));
          quizList[i].id = ids[i];
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
      console.log("All Quizzes:", quizList);
      return quizList;
    } catch (error) {
      console.error("Error fetching all quizzes:", error);
    }
  }

  async function deleteQuiz(quizId) {
    if (!signer || !contract) {
      console.error("Signer or contract not set");
      return;
    }

    try {
      const transaction = await contract.deleteQuiz(quizId);
      await transaction.wait();
      console.log(`Quiz ${quizId} deleted successfully`);
      toast.success(`Quiz ${quizId} deleted successfully`);
      setCount(count + 1);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Error deleting quiz");
    }
  }

  return (
    <div>
      <button
        className="text-appointment-btn"
        style={{
          color: "#ffff",
          marginTop: 40,
          marginLeft: 100,
        }}
        type="button"
        onClick={() => {
          window.location.href = "https://metamask.io/";
        }}
      >
        What do I need to connect?
      </button>
      <h1 style={{ marginTop: 30, textAlign: "center" }}>Saved Quizzes:</h1>

      <div
        style={{
          margin: "30px 50px 60px",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gridAutoRows: "200px",
        }}
      >
        {savedQuizzes.map((quiz, index) => (
          <div key={index} className="quiz-card">
            <div
              style={{
                textAlign: "center",
              }}
            >
              <h1 style={{ marginTop: 30, marginBottom: 30 }}>{quiz.name}</h1>
              <button
                style={{ marginRight: 10, marginBottom: 20 }}
                onClick={() => handleQuiz(quiz.questions)}
              >
                Take the test
              </button>
              <button onClick={() => deleteQuiz(quiz.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Saved;
