import { GameState, PlayerInfo, Card, HandRanking } from "./types";
import axios from "axios";

export class Player {
  public betRequest(
    gameState: GameState,
    betCallback: (bet: number) => void
  ): void {
    const myPlayer = gameState.players[gameState.in_action];
    const holeCards = myPlayer?.hole_cards;

    if (!myPlayer || !holeCards || !holeCards.length) {
      betCallback(0);
      return;
    }

    // Get important game state variables
    const currentBuyIn = gameState.current_buy_in;
    const minimumRaise = gameState.minimum_raise;

    const handStrength = this.evaluateHandStrength(holeCards!);
    const position = this.getPosition(gameState);

    const opponentAggression = this.getOpponentAggression(gameState.players);
    const playerCount = gameState.players.length;

    let betAmount = 0;

    if (handStrength === "strong") {
      betAmount = currentBuyIn - myPlayer.bet + minimumRaise + (playerCount * 2);
    } else if (handStrength === "medium" && position === "late") {
      betAmount = currentBuyIn - myPlayer.bet + minimumRaise;
    } else if (handStrength === "weak" && position === "late") {
      betAmount = Math.min(currentBuyIn - myPlayer.bet, myPlayer.stack / 20);
    } else {
      betAmount = 0;
    }

    betCallback(betAmount);
  }

  public showdown(gameState: GameState): void {
    // Implement showdown logic if needed
  }

  private evaluateHandStrength(holeCards: Card[]): 'strong' | 'medium' | 'weak' {
    // Simple example: Check if hole cards contain high cards
    const highCards = ['A', 'K', 'Q', 'J'];
    const hasHighCard = holeCards.some(card => highCards.includes(card.rank));

    if (hasHighCard) {
      return 'strong';
    } else if (holeCards[0].rank === holeCards[1].rank) {
      return 'medium';
    } else {
      return 'weak';
    }
  }

  // Helper function to determine player position
  private getPosition(gameState: GameState): "early" | "middle" | "late" {
    // Example: Determine player position based on dealer position
    const dealerPosition = gameState.dealer;
    const myPosition = gameState.in_action;

    if (myPosition < dealerPosition) {
      return "early";
    } else if (myPosition === dealerPosition) {
      return "middle";
    } else {
      return "late";
    }
  }

  // Helper function to estimate opponent aggression
  private getOpponentAggression(players: PlayerInfo[]): number {
    // Example: Estimate opponent aggression based on betting patterns
    // You can implement more sophisticated opponent modeling algorithms here
    return 1; // Placeholder
  }
}

export default Player;
