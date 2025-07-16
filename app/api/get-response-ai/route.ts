import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, currentRoute, previousChatId } = await req.json();

    const graphqlQuery = {
      query: `
        mutation ChatResponse($prompt: String!, $currentRoute: String!, $previousChatId: String) {
          chatResponse(prompt: $prompt, currentRoute: $currentRoute, previousChatId: $previousChatId) {
            message
            responseId
            threadId
          }
        }
      `,
      variables: {
        prompt,
        currentRoute,
        previousChatId,
      },
    };

    const response = await fetch(
      `${process.env.VITE_API_BASE_URL}/graphql`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphqlQuery),
      },
    );

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL Errors:", result.errors);
      return NextResponse.json(
        { error: "Failed to get AI response from GraphQL" },
        { status: 500 },
      );
    }

    return NextResponse.json(result.data.chatResponse);
  } catch (error) {
    console.error("Error in get-response-ai:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 },
    );
  }
}
