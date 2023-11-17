// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract inspo {
    struct Memo {
        string name;
        string message;
        uint timestamp;
        address from;
    }

    Memo[] memos;
    address payable owner; 

    constructor() {
        owner = payable(msg.sender);
    }

    function buyInspo(
        string calldata name,
        string calldata message
    ) external payable {
        require(msg.value > 0, "Need more money");
        owner.transfer(msg.value);
        memos.push(Memo(name, message, block.timestamp, msg.sender));
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
