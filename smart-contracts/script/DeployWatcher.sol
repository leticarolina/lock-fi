// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {Watcher} from "../src/Watcher.sol";

contract DeployLockFi is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy contract
        Watcher vault = new Watcher();

        // Stop broadcasting
        vm.stopBroadcast();

        // Log deployed address
        console.log("LockFi deployed at:", address(vault));
    }
}
