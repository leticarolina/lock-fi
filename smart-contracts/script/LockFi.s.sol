// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {LockFi} from "../src/LockFi.sol";

contract DeployLockFi is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy contract
        LockFi vault = new LockFi();

        // Stop broadcasting
        vm.stopBroadcast();

        // Log deployed address
        console.log("LockFi deployed at:", address(vault));
    }
}
