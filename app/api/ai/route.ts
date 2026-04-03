import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { word } = await req.json();

    if (!word) {
      return Response.json({ error: "No word provided" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Explain this word simply in 1-2 sentences with one example.
                    Word: ${word}`,

        },
      ],
    });

    return Response.json({
      text: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("GROQ ERROR:", error);

    return Response.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}


