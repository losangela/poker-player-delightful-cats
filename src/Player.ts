import { GameState, PlayerInfo, Card, HandRanking } from "./types";
import axios from "axios";

export class Player {
  public async betRequest(
    gameState: GameState,
    betCallback: (bet: number) => void
  ): Promise<void> {
    const myPlayer = gameState.players[gameState.in_action];
    const holeCards = myPlayer?.hole_cards;

    if (!myPlayer || !holeCards || !holeCards.length) {
      console.log({myPlayer, holeCards, gameState});
      betCallback(0);
      return;
    }

    // Get important game state variables
    const currentBuyIn = gameState.current_buy_in;
    const minimumRaise = gameState.minimum_raise;

    // Example strategy: Adjusted pre-flop hand ranges
    const handStrength = await this.getHandStrength(holeCards!);
    const position = this.getPosition(gameState);

    // ✨ likely no need to look at opponent aggression until there's less players in the round
    const opponentAggression = this.getOpponentAggression(gameState.players);

    // Adjustments based on hand strength, position, and opponent behavior
    let betAmount = 0;
    console.log({ handStrength, position });
    if (handStrength === "strong") {
      // If hand is strong, raise based on opponent aggression and position
      betAmount =
        currentBuyIn - myPlayer.bet + minimumRaise + opponentAggression * 10;
    } else if (handStrength === "medium" && position === "late") {
      // If hand is medium and in late position, consider a raise
      betAmount = currentBuyIn - myPlayer.bet + minimumRaise;
    } else if (handStrength === "weak" && position === "late") {
      // If hand is weak but in late position, consider calling or folding
      betAmount = Math.min(currentBuyIn - myPlayer.bet, myPlayer.stack / 20);
    } else {
      // Fold otherwise
      betAmount = 0;
    }

    betCallback(betAmount);
  }

  public showdown(gameState: GameState): void {
    // Implement showdown logic if needed
  }

  // Helper function to determine hand strength
  private async getHandRanking(holeCards: Card[]): Promise<HandRanking> {
    if (!holeCards || !holeCards.length) {
      return { rank: 0 };
    }

    return { rank: 5 };
    
    try {
      const config = {
        params: { cards: JSON.stringify(holeCards) },
      }
      console.log("💖 getHandRanking", config);
      const response = await axios.get("https://rainman.leanpoker.org/rank", config);

      return response.data;
    } catch (error) {
      throw "error at getHandRanking";
    }
  }

  private async getHandStrength(
    holeCards: Card[]
  ): Promise<"strong" | "medium" | "weak"> {
    return "medium";
    try {
      const handRanking = await this.getHandRanking(holeCards);
      console.log({handRanking});

      // Determine hand strength based on hand ranking
      if (handRanking.rank >= 5) {
        // Hands ranked 5 or higher are considered strong
        return "strong";
      } else if (handRanking.rank >= 2) {
        // Hands ranked 2 to 4 are considered medium
        return "medium";
      } else {
        // Hands ranked 0 or 1 are considered weak
        return "weak";
      }
    } catch (error) {
      console.error("🎀 error at getHandStrength");
      throw "error at getHandStrength";
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
