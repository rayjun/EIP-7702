// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/SimpleSBT.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        SimpleSBT simpleSBT = new SimpleSBT("GasDaddy SBT", "GDSBT");

        console.log("SimpleSBT deployed to:", address(simpleSBT));

        vm.stopBroadcast();
    }
}