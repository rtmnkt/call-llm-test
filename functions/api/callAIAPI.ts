let env: Env
function echo(modelName: string, apiPath: string) {
  console.log(`called: modelName=${modelName}, apiPath=${apiPath}`);
}

export const onRequestPost: PagesFunction<Env> = async (context,) => {
  const { request } = context;

  env = context.env;
  const { apiType, apiProvider, systemInput, userInput } = await request.json() as { apiType: string, systemInput: string, userInput: string };

  switch (apiProvider) {
    case 'openai':
      return callChatGPTAPI(apiType, systemInput, userInput);
    // case 'chatgpt_function':
    //   return callChatGPTFunctionAPI(systemInput, userInput);
    case 'anthropic':
      return callClaude3API(apiType, systemInput, userInput);
    case 'perplexity':
      return callPerplexityAPI(apiType, systemInput, userInput);
    default:
      return new Response(JSON.stringify({ error: 'Unsupported API type' }), { status: 400 });
  }
}

async function callChatGPTAPI(model, systemInput, userInput) {
  // OpenAI APIを呼び出すロジックを実装
  // ここでは疑似コードとしています
  const path = env.CHATGPT_API_URL;
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemInput },
        { role: 'user', content: userInput },
      ],
    }),
  });
  echo(model, path);

  const data = await response.json();
  return new Response(JSON.stringify(data));
}

// unimplemented
async function callChatGPTFunctionAPI(systemInput, userInput) {
  // ChatGPT Function APIを呼び出すロジック
  return new Response(JSON.stringify(null));
}

async function callClaude3API(model, systemInput, userInput) {
  const path = 'https://api.anthropic.com/v1/messages';
  // Claude3のAPIを呼び出すロジック
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "anthropic-version": "2023-06-01",
      'X-API-Key': env.CLAUDE_API_KEY,
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 1024,
      system: systemInput,
      messages: [{ role: 'user', content: userInput }],
    }),
  });
  echo(model, path);

  const data = await response.json();
  return new Response(JSON.stringify(data));
}

async function callPerplexityAPI(model, systemInput, userInput) {
  /*
  sonar-small-chat, sonar-small-online, sonar-medium-chat, sonar-medium-online, mistral-7b-instruct, and mixtral-8x7b-instruct.
  */
  const path = 'https://api.perplexity.ai/chat/completions';
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.PERPLEXITY_API_KEY}`,
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemInput },
        { role: 'user', content: userInput },
      ],
    }),
  });
  echo(model, path);

  const data = await response.json();
  return new Response(JSON.stringify(data));
}
