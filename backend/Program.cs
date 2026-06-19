using System.ClientModel;
using Azure.AI.OpenAI;
using Azure.Identity;
using OpenAI.Chat;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddApplicationInsightsTelemetry();

// Azure OpenAI / AI Foundry — active when the app opted into the
// `ai-foundry` component. The kiosk injects AI_FOUNDRY_ENDPOINT,
// AI_DEPLOYMENT_NAME and AI_MODEL into the Container App env, and the
// per-app managed identity has `Cognitive Services User` on the shared
// AI Services account, so we authenticate with DefaultAzureCredential.
builder.Services.AddSingleton<ChatClient?>(_ =>
{
    var endpoint = Environment.GetEnvironmentVariable("AI_FOUNDRY_ENDPOINT");
    var deployment = Environment.GetEnvironmentVariable("AI_DEPLOYMENT_NAME");
    if (string.IsNullOrWhiteSpace(endpoint) || string.IsNullOrWhiteSpace(deployment))
    {
        return null;
    }
    var client = new AzureOpenAIClient(new Uri(endpoint), new DefaultAzureCredential());
    return client.GetChatClient(deployment);
});

var app = builder.Build();

app.MapGet("/", () => new { hello = "world" });

app.MapGet("/ai/health", () =>
{
    var deployment = Environment.GetEnvironmentVariable("AI_DEPLOYMENT_NAME");
    var endpoint = Environment.GetEnvironmentVariable("AI_FOUNDRY_ENDPOINT");
    return new
    {
        configured = !string.IsNullOrWhiteSpace(endpoint) && !string.IsNullOrWhiteSpace(deployment),
        deployment,
        model = Environment.GetEnvironmentVariable("AI_MODEL"),
    };
});

app.MapPost("/ai/chat", async (ChatRequest req, ChatClient? chat) =>
{
    if (chat is null)
    {
        return Results.Problem(
            detail: "AI Foundry is not configured (AI_FOUNDRY_ENDPOINT / AI_DEPLOYMENT_NAME missing).",
            statusCode: 503);
    }
    if (string.IsNullOrWhiteSpace(req.Prompt))
    {
        return Results.BadRequest(new { error = "Missing 'prompt' in request body." });
    }

    var messages = new List<ChatMessage>();
    if (!string.IsNullOrWhiteSpace(req.System)) messages.Add(new SystemChatMessage(req.System));
    messages.Add(new UserChatMessage(req.Prompt));

    var options = new ChatCompletionOptions
    {
        MaxOutputTokenCount = req.MaxTokens ?? 512,
        Temperature = req.Temperature ?? 0.2f,
    };

    ClientResult<ChatCompletion> result = await chat.CompleteChatAsync(messages, options);
    var content = result.Value.Content.Count > 0 ? result.Value.Content[0].Text : "";
    return Results.Ok(new
    {
        model = Environment.GetEnvironmentVariable("AI_MODEL"),
        content,
    });
});

app.Run();

public record ChatRequest(string Prompt, string? System, int? MaxTokens, float? Temperature);
