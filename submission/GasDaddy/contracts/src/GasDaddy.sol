// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ISBT {
    function mint() external;
}

// TODO need to improve and make the contract a general one for all

/**
 * @title GasDaddy
 * @dev Contract for EIP-7702 gas sponsorship
 * @notice This contract will be used as code for user EOAs via EIP-7702
 */
contract GasDaddy {
    event SBTMintSponsored(address indexed user, address indexed sbtContract, address indexed sponsor);

    /**
     * @dev Mint SBT to the calling EOA (msg.sender)
     * @param sbtContract Address of the SBT contract to mint from
     * @notice This function will be executed in the user's EOA context via EIP-7702
     */
    function mintSBT(address sbtContract) external {
        // When executed via EIP-7702:
        // - msg.sender = user's EOA address
        // - tx.origin = sponsor's EOA address
        // - gas is paid by sponsor

        ISBT(sbtContract).mint();

        emit SBTMintSponsored(msg.sender, sbtContract, tx.origin);
    }

    /**
     * @dev Get execution context for debugging
     */
    function getContext() external view returns (
        address msgSender,
        address contractThis,
        address txOrigin
    ) {
        return (msg.sender, address(this), tx.origin);
    }
}