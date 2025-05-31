// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EnhancedDelegation {
    struct ExecutionContext {
        address msgSender;        // Who sent this transaction (sponsor)
        address contractAddress;  // Contract address where the code is running (user EOA)
        address txOrigin;         // Original transaction initiator
        uint256 blockNumber;      // Current block number
        uint256 gasLeft;          // Remaining gas
        uint256 value;            // ETH amount sent
        string functionName;      // Name of the function being executed
    }

    // Store historical execution records
    mapping(uint256 => ExecutionContext) public executionHistory;
    uint256 public executionCount;

    // Event logging
    event ExecutionDetails(
        uint256 indexed executionId,
        address indexed msgSender,
        address indexed contractAddress,
        address txOrigin,
        string functionName,
        uint256 blockNumber,
        uint256 gasUsed,
        uint256 value
    );

    event EIP7702Context(
        address sponsor,      // Gas payer
        address userEOA,      // User EOA (contract execution address)
        bool isSponsoredTx    // Whether this is a sponsored transaction
    );

    // Initialize function
    function initialize() external payable {
        _recordExecution("initialize");
        emit ExecutionDetails(
            executionCount,
            msg.sender,
            address(this),
            tx.origin,
            "initialize",
            block.number,
            gasleft(),
            msg.value
        );
    }

    // Ping function
    function ping() external payable {
        _recordExecution("ping");
        emit ExecutionDetails(
            executionCount,
            msg.sender,
            address(this),
            tx.origin,
            "ping",
            block.number,
            gasleft(),
            msg.value
        );
    }

    // Advanced function: Show detailed EIP-7702 context
    function showEIP7702Context() external payable returns (ExecutionContext memory) {
        _recordExecution("showEIP7702Context");

        ExecutionContext memory context = executionHistory[executionCount];

        // Check if this is a sponsored transaction (sponsor != userEOA)
        bool isSponsoredTx = msg.sender != address(this);

        emit EIP7702Context(
            msg.sender,      // Sponsor (gas payer)
            address(this),   // User EOA (contract execution address)
            isSponsoredTx
        );

        emit ExecutionDetails(
            executionCount,
            msg.sender,
            address(this),
            tx.origin,
            "showEIP7702Context",
            block.number,
            gasleft(),
            msg.value
        );

        return context;
    }

    // Batch operation test
    function batchOperation(string[] calldata operations) external payable {
        _recordExecution("batchOperation");

        for (uint i = 0; i < operations.length; i++) {
            emit ExecutionDetails(
                executionCount,
                msg.sender,
                address(this),
                tx.origin,
                string(abi.encodePacked("batch_", operations[i])),
                block.number,
                gasleft(),
                msg.value
            );
        }
    }

    // Internal function: Record execution context
    function _recordExecution(string memory functionName) internal {
        executionCount++;

        executionHistory[executionCount] = ExecutionContext({
            msgSender: msg.sender,
            contractAddress: address(this),
            txOrigin: tx.origin,
            blockNumber: block.number,
            gasLeft: gasleft(),
            value: msg.value,
            functionName: functionName
        });
    }

    // Query function: Get execution history
    function getExecutionHistory(uint256 executionId) external view returns (ExecutionContext memory) {
        require(executionId <= executionCount, "Invalid execution ID");
        return executionHistory[executionId];
    }

    // Query function: Get latest execution record
    function getLatestExecution() external view returns (ExecutionContext memory) {
        require(executionCount > 0, "No executions recorded");
        return executionHistory[executionCount];
    }

    // Debug function: Compare different addresses
    function debugAddresses() external view returns (
        address msgSender,
        address contractThis,
        address txOrigin,
        bool isSponsoredTransaction
    ) {
        return (
            msg.sender,
            address(this),
            tx.origin,
            msg.sender != address(this)  // If not equal, it's a sponsored transaction
        );
    }

    // Receive ETH
    receive() external payable {
        _recordExecution("receive");
        emit ExecutionDetails(
            executionCount,
            msg.sender,
            address(this),
            tx.origin,
            "receive",
            block.number,
            gasleft(),
            msg.value
        );
    }
}