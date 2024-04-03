import "dotenv/config";
import OpenAI from "openai";
import { GameState } from "./types";

const openai = new OpenAI();

export class Player {
  public async betRequest(
    gameState: GameState,
    betCallback: (bet: number) => void
  ): Promise<void> {

    // This is an example of how you can use OpenAI to help you make decisions in the game.
    console.log("Asking OpenAI...");
    console.time("OpenAI response time");
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: getSystemPrompt(gameState) },
        { role: "user", content: "How much should I bet?" },
      ],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
    });
    console.timeEnd("OpenAI response time");
    console.log("Received response from OpenAI:");
    // Parse the response from OpenAI
    const responseData = JSON.parse(
      chatCompletion.choices[0].message.content!
    ) as { bet: number };
    console.log(responseData);

    // Return the bet to the game engine
    betCallback(responseData.bet);
  }

  public showdown(gameState: GameState): void {}
}

export default Player;

function getSystemPrompt(gameState: GameState): string {
  return `
    We are playing lean poker. We need to make a bet based on the following game state: ${JSON.stringify(
      gameState
    )}
    Always return a JSON object with one properties:
    - "bet": contains the amount you want to bet`;
    //- "reasoning": contains a string with your reasoning for the bet, should be only one sentence`;
}
