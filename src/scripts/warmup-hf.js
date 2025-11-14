const HF_TOKEN = process.env.HF_TOKEN;

if (!HF_TOKEN) {
  console.warn("No HF TOKEN found. Skipping warm-up.");
  process.exit(0);
}

async function warmUp() {
  console.log("🔥 Warming up Hugging Face model...");

  const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: "Hello!" }],
      model: "google/gemma-2-2b-it",
      max_new_tokens: 1,
    }),
  });

  console.log(res.ok ? "✅ Model warmed up!" : "⚠️ Warm-up failed:", await res.text());
}

warmUp();
