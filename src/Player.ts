import { GameState } from "./types";

export class Player {
  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {

    // folding every time
    // betCallback(0);

    const myPlayer = gameState.players[gameState.in_action];
    const holeCards = myPlayer.hole_cards;

    // Example strategy: Fold unless we have at least one high card
    const highCards = ['A', 'K', 'Q', 'J'];
    const hasHighCard = holeCards?.some(card => highCards.includes(card.rank));

    if (hasHighCard) {
      // Call: match the current highest bet
      const amountToCall = gameState.current_buy_in - myPlayer.bet;
      betCallback(amountToCall);
    } else {
      // Fold
      betCallback(0);
    }

  }

  public showdown(gameState: GameState): void {

  }
};

export default Player;
