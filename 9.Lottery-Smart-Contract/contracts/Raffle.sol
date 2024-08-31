// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

///////

error Raffle_NotOpen();
error Raffle__UpkeepNotNeeded(
    uint256 currentBalance,
    uint256 numPlayers,
    uint256 raffeState
);

//////

contract Raffle is VRFConsumerBaseV2, AutomationCompatibleInterface {
    //// Type Declarations
    enum RaffleState {
        OPEN,
        CALCULATING
    }

    //////

    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLine;
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS = 1;

    /// Lottery variable
    address private s_recentWinner;
    RaffleState private s_raffleState;
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;

    /////////   event

    event RaffleEnter(address indexed player);
    event RequestRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    //// Constrator

    constructor(
        address vrfCoordinator,
        uint256 entranceFee,
        bytes32 gasLine,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2(vrfCoordinator) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        i_gasLine = gasLine;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_raffleState = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    function enterRaffle() external payable {
        require(msg.value == i_entranceFee, "Incorrect Eth amount");

        if (s_raffleState != RaffleState.OPEN) {
            revert Raffle_NotOpen();
        }

        s_players.push(payable(msg.sender));
        emit RaffleEnter(msg.sender);
    }

    function getEntranceFee() external view returns (uint256) {
        return i_entranceFee;
    }

    //////   ///////////  performUpkeep

    function performUpkeep(bytes calldata /* performData */) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Raffle__UpkeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_raffleState)
            );
        }

        s_raffleState = RaffleState.CALCULATING;

        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLine,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestRaffleWinner(requestId);
    }

    ///////////  checkUpKeep

    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        bool isOpen = (RaffleState.OPEN == s_raffleState);
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = (s_players.length > 0);
        bool hasBalance = address(this).balance > 0;
        upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
    }

    ///////////

    function fulfillRandomWords(
        uint256, // requestId,//
        uint256[] memory randomWords
    ) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        s_raffleState = RaffleState.OPEN;
        s_players = new address payable[](0);
        s_lastTimeStamp = block.timestamp;
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        require(success, "Transfer failed");
        emit WinnerPicked(recentWinner);
    }

    function getPlayer(uint256 index) external view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() external view returns (address) {
        return s_recentWinner;
    }

    function getRaffleState() public view returns (RaffleState) {
        return s_raffleState;
    }

    function getNumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function getNumofPlayers() public view returns (uint256) {
        return s_players.length;
    }
    function getLatestTimeStamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }
    function getRequestConfermation() public pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }
}
