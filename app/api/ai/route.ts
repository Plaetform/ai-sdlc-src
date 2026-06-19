/**
 * Azure OpenAI / AI Foundry route.
 *
 * Active when the app opted into the `ai-foundry` component. The kiosk
 * injects AI_FOUNDRY_ENDPOINT, AI_DEPLOYMENT_NAME and AI_MODEL into the
 * Container App env, and the per-app managed identity has the
 * `Cognitive Services User` role on the shared AI Services account — so
 * we use Managed Identity (DefaultAzureCredential), never an API key.
 *
 *   GET  /api/ai            → status + configured deployment/model
 *   POST /api/ai  { prompt, system?, maxTokens?, temperature? }
 */
import { DefaultAzureCredential } from "@azure/identity";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SCOPE = "https://cognitiveservices.azure.com/.default";
const API_VERSION = "2024-10-21";

const credential = new DefaultAzureCredential();

function config() {
  const endpoint = process.env.AI_FOUNDRY_ENDPOINT;
  const deployment = process.env.AI_DEPLOYMENT_NAME;
  const model = process.env.AI_MODEL ?? deployment ?? null;
  return { endpoint, deployment, model, configured: Boolean(endpoint && deployment) };
}

export async function GET() {
  const { configured, deployment, model } = config();
  return NextResponse.json({ configured, deployment, model });
}

export async function POST(req: Request) {
  const { endpoint, deployment, model, configured } = config();
  if (!configured) {
    return NextResponse.json(
      { error: "AI Foundry is not configured (AI_FOUNDRY_ENDPOINT / AI_DEPLOYMENT_NAME missing)." },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const prompt: string | undefined = body?.prompt;
  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Missing 'prompt' (string) in request body." }, { status: 400 });
  }
  const system: string | undefined = typeof body?.system === "string" ? body.system : undefined;
  const maxTokens: number = Number.isFinite(body?.maxTokens) ? body.maxTokens : 512;
  const temperature: number = Number.isFinite(body?.temperature) ? body.temperature : 0.2;

  const token = await credential.getToken(SCOPE);
  if (!token) {
    return NextResponse.json({ error: "Failed to acquire managed identity token." }, { status: 500 });
  }

  const messages: { role: string; content: string }[] = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });

  const url = `${endpoint!.replace(/\/$/, "")}/openai/deployments/${deployment}/chat/completions?api-version=${API_VERSION}`;
  const upstream = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json",
    },
    // GPT-5-class deployments (gpt-5.4-nano/mini) reject `max_tokens` and
    // require `max_completion_tokens`.
    body: JSON.stringify({ messages, max_completion_tokens: maxTokens, temperature }),
  });

  if (!upstream.ok) {
    const detail = await upstream.text();
    return NextResponse.json(
      { error: "Upstream Azure OpenAI call failed.", status: upstream.status, detail },
      { status: 502 },
    );
  }

  const data = await upstream.json();
  const content: string = data?.choices?.[0]?.message?.content ?? "";
  return NextResponse.json({ model, content });
}
