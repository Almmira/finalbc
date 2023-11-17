// Quiz.js
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/Quiz.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";

function Quiz() {
  const location = useLocation();
  const textFromDoctors = location.state ? location.state.text : "";
  const [questions, setQuestions] = useState([]);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [inputString, setInputString] = useState("");

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
  /*const questions = [
    {
      text: "What is the capital of America?",
      options: [
        { id: 0, text: "New York City", isCorrect: false },
        { id: 1, text: "Boston", isCorrect: false },
        { id: 2, text: "Santa Fe", isCorrect: false },
        { id: 3, text: "Washington DC", isCorrect: true },
      ],
    },
    {
      text: "What year was the Constitution of America written?",
      options: [
        { id: 0, text: "1787", isCorrect: true },
        { id: 1, text: "1776", isCorrect: false },
        { id: 2, text: "1774", isCorrect: false },
        { id: 3, text: "1826", isCorrect: false },
      ],
    },
    {
      text: "Who was the second president of the US?",
      options: [
        { id: 0, text: "John Adams", isCorrect: true },
        { id: 1, text: "Paul Revere", isCorrect: false },
        { id: 2, text: "Thomas Jefferson", isCorrect: false },
        { id: 3, text: "Benjamin Franklin", isCorrect: false },
      ],
    },
    {
      text: "What is the largest state in the US?",
      options: [
        { id: 0, text: "California", isCorrect: false },
        { id: 1, text: "Alaska", isCorrect: true },
        { id: 2, text: "Texas", isCorrect: false },
        { id: 3, text: "Montana", isCorrect: false },
      ],
    },
    {
      text: "Which of the following countries DO NOT border the US?",
      options: [
        { id: 0, text: "Canada", isCorrect: false },
        { id: 1, text: "Russia", isCorrect: true },
        { id: 2, text: "Cuba", isCorrect: true },
        { id: 3, text: "Mexico", isCorrect: false },
      ],
    },
  ];*/

  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        const signer = provider.getSigner();
        setSigner(signer);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("MetaMask is not installed");
    }
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

  function createQuiz(content) {
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const fee = ethers.utils.parseEther("0.005");

    contract
      .createQuiz(content, fee, { value: fee })
      .then((transaction) => {
        console.log(transaction);
        toast.success("transaction successful", { autoClose: 2000 });
      })
      .catch((error) => {
        // Check if the error is due to insufficient funds
        console.log(error.code);
        console.log(error);
        if (error.code === ethers.errors.INSUFFICIENT_FUNDS) {
          toast.error("Insufficient Goerli ETH for the transaction", {
            autoClose: 2000,
          });
        } else {
          // Handle other types of errors
          toast.error("Transaction failed", { autoClose: 2000 });
        }
      });
  }

  const optionClicked = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      const question = questions[index];
      if (
        question &&
        question.options &&
        question.options[answer] &&
        question.options[answer].isCorrect
      ) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  const totalScore = calculateScore();

  const saveQuiz = () => {
    const quizName = prompt("Enter a name for the saved quiz:");
    if (quizName) {
      const quiz = {
        name: quizName,
        answers,
        questions,
      };

      const savedQuizzes =
        JSON.parse(localStorage.getItem("savedQuizzes")) || [];
      savedQuizzes.push(quiz);
      localStorage.setItem("savedQuizzes", JSON.stringify(savedQuizzes));
    }
  };

  async function getAllQuizzes(provider, contractAddress, contractABI) {
    try {
      const quizContract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      const quizzes = await quizContract.getAllQuizzes();
      console.log("All Quizzes:", quizzes);
      return quizzes;
    } catch (error) {
      console.error("Error fetching all quizzes:", error);
    }
  }

  const fetchDataFromServer = async () => {
    const params = new URLSearchParams({
      difficulty: "easy",
      topic: textFromDoctors,
    }).toString();
    try {
      const response = await fetch(`http://localhost:8000/test?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setQuestions(data.questions);
      setAnswers(Array(data.questions.length).fill(null));
      console.log("Data from server:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataFromServer().then((r) => console.log(r));
  }, []);

  return (
    <div className="App">
      <h1 style={{ textAlign: "center", marginTop: 30, marginBottom: 30 }}>
        Test
      </h1>

      {questions.map((question, questionIndex) => (
        <div
          key={questionIndex}
          className="question-card"
          style={{ marginBottom: 20 }}
        >
          <h2>Question {questionIndex + 1}</h2>
          <h3 className="question-text">{question.text}</h3>

          <ul>
            {question.options.map((option, optionIndex) => {
              const isAnswered = answers[questionIndex] !== null;
              const isCorrect = option.isCorrect;
              const isSelected = answers[questionIndex] === optionIndex;

              let style = {};
              if (isAnswered) {
                style = isSelected
                  ? isCorrect
                    ? { backgroundColor: "green" }
                    : { backgroundColor: "red" }
                  : isCorrect
                  ? { backgroundColor: "green" }
                  : {};
              }

              return (
                <li
                  key={option.id}
                  style={style}
                  onClick={() => optionClicked(questionIndex, optionIndex)}
                >
                  {option.text}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <button
          onClick={() => setShowResults(true)}
          style={{ marginTop: 40, marginRight: 20 }}
        >
          Show Results
        </button>
        <button
          onClick={() =>
            createQuiz(
              JSON.stringify({ questions: questions, name: inputString })
            )
          }
        >
          Save
        </button>
      </div>

      {showResults && (
        <div className="results">
          <h2>Your Score</h2>
          <p>
            You got {totalScore} out of {questions.length} questions correct!
          </p>
        </div>
      )}

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <input
          type="text"
          value={inputString}
          onChange={(e) => setInputString(e.target.value)}
          placeholder="Enter Quiz Name"
          style={{ marginRight: 10 }}
        />
      </div>
    </div>
  );
}

export default Quiz;
