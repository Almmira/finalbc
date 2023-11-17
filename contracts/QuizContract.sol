// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract QuizContract {
    struct Quiz {
        uint256 id;
        string content;
        address owner;
        uint256 price;
        bool isDeleted; // New field to indicate if the quiz is deleted
    }

    address public contractOwner;
    Quiz[] public quizzes;
    mapping(uint256 => bool) public quizExists;
    uint256 public nextQuizId;

    event QuizCreated(
        uint256 indexed id,
        address indexed owner,
        string content
    );
    event QuizTransferred(
        uint256 indexed id,
        address indexed from,
        address indexed to,
        uint256 price
    );

    function createQuiz(
        string memory content,
        uint256 creationFee
    ) public payable {
        require(msg.value == creationFee, "Incorrect fee");

        quizzes.push(Quiz(nextQuizId, content, msg.sender, 0, false));
        quizExists[nextQuizId] = true;
        emit QuizCreated(nextQuizId, msg.sender, content);
        nextQuizId++;

        payable(contractOwner).transfer(msg.value);
    }

    function deleteQuiz(uint256 quizId) public {
        require(quizExists[quizId], "Quiz does not exist");
        require(
            msg.sender == quizzes[quizId].owner,
            "Only the owner can delete the quiz"
        );

        quizzes[quizId].isDeleted = true;
    }

    function setQuizForSale(uint256 quizId, uint256 price) public {
        require(quizExists[quizId], "Quiz does not exist");
        require(
            msg.sender == quizzes[quizId].owner,
            "Only the owner can set the quiz for sale"
        );
        quizzes[quizId].price = price;
    }

    function buyQuiz(uint256 quizId) public payable {
        require(quizExists[quizId], "Quiz does not exist");
        Quiz storage quiz = quizzes[quizId];
        require(msg.value >= quiz.price, "Not enough Ether sent");
        require(quiz.price > 0, "This quiz is not for sale");

        address seller = quiz.owner;
        quiz.owner = msg.sender;
        quiz.price = 0; // Not for sale anymore
        payable(seller).transfer(msg.value);
        emit QuizTransferred(quizId, seller, msg.sender, msg.value);
    }

    function getQuiz(
        uint256 quizId
    ) public view returns (uint256, string memory, address, uint256, bool) {
        require(quizExists[quizId], "Quiz does not exist");
        require(quizzes[quizId].isDeleted == false, "Quiz does not exist");
        Quiz memory quiz = quizzes[quizId];
        return (quiz.id, quiz.content, quiz.owner, quiz.price, quiz.isDeleted);
    }

    function getAllQuizzes()
        public
        view
        returns (
            uint256[] memory,
            string[] memory,
            address[] memory,
            uint256[] memory
        )
    {
        uint256 totalActiveQuizzes = 0;
        for (uint i = 0; i < quizzes.length; i++) {
            if (!quizzes[i].isDeleted) {
                totalActiveQuizzes++;
            }
        }

        uint256[] memory ids = new uint256[](totalActiveQuizzes);
        string[] memory contents = new string[](totalActiveQuizzes);
        address[] memory owners = new address[](totalActiveQuizzes);
        uint256[] memory prices = new uint256[](totalActiveQuizzes);

        uint256 activeIndex = 0;
        for (uint i = 0; i < quizzes.length; i++) {
            if (!quizzes[i].isDeleted) {
                Quiz storage quiz = quizzes[i];
                ids[activeIndex] = quiz.id;
                contents[activeIndex] = quiz.content;
                owners[activeIndex] = quiz.owner;
                prices[activeIndex] = quiz.price;
                activeIndex++;
            }
        }

        return (ids, contents, owners, prices);
    }

    function getQuizzesByOwner(
        address owner
    )
        public
        view
        returns (
            uint256[] memory,
            string[] memory,
            uint256[] memory,
            bool[] memory
        )
    {
        uint256 totalQuizzesByOwner = 0;

        // Count the total quizzes owned by the specified address
        for (uint i = 0; i < quizzes.length; i++) {
            if (quizzes[i].owner == owner && !quizzes[i].isDeleted) {
                totalQuizzesByOwner++;
            }
        }

        // Initialize arrays to store quiz information
        uint256[] memory ids = new uint256[](totalQuizzesByOwner);
        string[] memory contents = new string[](totalQuizzesByOwner);
        uint256[] memory prices = new uint256[](totalQuizzesByOwner);
        bool[] memory isDeletedArray = new bool[](totalQuizzesByOwner);

        uint256 quizzesByOwnerIndex = 0;

        // Populate arrays with information about quizzes owned by the specified address
        for (uint i = 0; i < quizzes.length; i++) {
            if (quizzes[i].owner == owner && !quizzes[i].isDeleted) {
                ids[quizzesByOwnerIndex] = quizzes[i].id;
                contents[quizzesByOwnerIndex] = quizzes[i].content;
                prices[quizzesByOwnerIndex] = quizzes[i].price;
                isDeletedArray[quizzesByOwnerIndex] = quizzes[i].isDeleted;
                quizzesByOwnerIndex++;
            }
        }

        return (ids, contents, prices, isDeletedArray);
    }
}
