import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

interface RpcRequestBody {
  playerChoice: string
  lastPlayerChoice: string
  lastAiChoice: string
  lastGameResult: string
}

export async function POST(request: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY

  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not set in the environment variables.' }, { status: 500 })
  }

  try {
    const { lastPlayerChoice, lastAiChoice, playerChoice, lastGameResult } = (await request.json()) as RpcRequestBody

    console.table({ lastPlayerChoice, lastAiChoice, playerChoice, lastGameResult })

    if (!playerChoice || lastPlayerChoice === undefined || lastAiChoice === undefined || lastGameResult === undefined) {
      return NextResponse.json({ error: 'Missing body parameters in the request body.' }, { status: 400 })
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

    const prompt = `You are an AI human playing a game of advanced rock, paper, scissors. You don't yet know what player has chosen just yet, but in last game player chose '${lastPlayerChoice}' and AI choice was '${lastAiChoice}', the player did ${lastGameResult} last game. What is your move now? You may respond with anything ranging from a simple 'rock 🪨' to something absurd like 'nuclear bomb ☢️', but keep it fun and light, try to win but don't go with something overly OP or unusual if player doesn't either. Don't respond with abstract things. Don't add anything else to your response, it should just be [your_choice] [emoji]`
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })
    const aiChoice = response.text

    const resultsPrompt = `Analyze this game of advanced rock-paper-scissors.
Player chose: '${playerChoice}'
AI chose: '${aiChoice}'

Please respond with ONLY a valid JSON object in the following format:
{
  "result": "win" | "lose" | "draw",
  "message": "A super short, fun sentence about what happened. For example: 'Rock smashes scissors' or 'The black hole swallows your planet'"
}`

    const resultsResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: resultsPrompt,
    })
    const textResponse = resultsResponse.text

    let gameData: { result: string; message: string }

    try {
      const match = (textResponse || '').match(/\{[\s\S]*\}/)

      if (!match) {
        throw new Error("No valid JSON object found in the AI's response.")
      }
      const jsonString = match[0]
      gameData = JSON.parse(jsonString)
    } catch (e) {
      console.error('Failed to parse JSON from AI response. Raw text:', textResponse)
      return NextResponse.json(
        {
          aiChoice,
          gameResult: 'draw',
          resultMessage: "The AI gave a confusing answer. We'll call it a draw.",
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        aiChoice: aiChoice,
        gameResult: gameData.result,
        resultMessage: gameData.message,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        aiChoice: 'error generating AI choice',
        gameResult: 'draw',
        resultMessage: 'Possibly due to an API limit.',
      },
      { status: 500 }
    )
  }
}
