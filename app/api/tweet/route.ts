import { NextRequest, NextResponse } from "next/server";
import { postTweet, getTwitterCredentials } from "@/lib/channels/twitter";

interface TweetRequest {
  text: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TweetRequest = await request.json();
    const { text } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Tweet text is required" },
        { status: 400 }
      );
    }

    if (text.length > 280) {
      return NextResponse.json(
        { error: `Tweet too long: ${text.length}/280 characters` },
        { status: 400 }
      );
    }

    const credentials = getTwitterCredentials();
    if (!credentials) {
      return NextResponse.json(
        { error: "Twitter credentials not configured" },
        { status: 500 }
      );
    }

    const result = await postTweet(text, credentials);

    return NextResponse.json({
      success: true,
      tweet: {
        id: result.id,
        text: result.text,
        url: `https://twitter.com/i/web/status/${result.id}`,
      },
    });
  } catch (error) {
    console.error("Tweet error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
