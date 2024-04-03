export type Card = {
  rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
  suit: 'clubs' | 'spades' | 'hearts' | 'diamonds';
};

export type PlayerInfo = {
  id: number; // Id of the player (same as the index)
  name: string; // Name specified in the tournament config
  status: 'active' | 'folded' | 'out'; // Status of the player
  version: string; // Version identifier returned by the player
  stack: number; // Amount of chips still available for the player
  bet: number; // The amount of chips the player put into the pot
  hole_cards?: Card[]; // The cards of the player, only visible for your own player or after showdown
};

export type GameState = {
  tournament_id: string; // Id of the current tournament
  game_id: string; // Id of the current sit'n'go game
  round: number; // Index of the current round within a sit'n'go
  bet_index: number; // Index of the betting opportunity within a round
  small_blind: number; // The small blind in the current round
  current_buy_in: number; // The amount of the largest current bet from any one player
  pot: number; // The size of the pot (sum of the player bets)
  minimum_raise: number; // Minimum raise amount
  dealer: number; // The index of the player on the dealer button in this round
  orbits: number; // Number of orbits completed
  in_action: number; // The index of your player, in the players array
  players: PlayerInfo[]; // An array of the players
  community_cards: Card[]; // The array of community cards
};

export interface HandRanking {
  rank: number;
}