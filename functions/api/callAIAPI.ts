let env: Env

export const onRequestPost: PagesFunction<Env> = async (context,) => {
  const { request } = context;
  env = context.env;
  const { apiType, systemInput, userInput } = await request.json() as { apiType: string, systemInput: string, userInput: string };

  switch (apiType) {
    case 'chatgpt':
      return callChatGPTAPI('gpt-3.5-turbo-0125', systemInput, userInput);
    case 'chatgpt4':
      return callChatGPTAPI('gpt-4-0125-preview', systemInput, userInput);
    case 'chatgpt_function':
      return callChatGPTFunctionAPI(systemInput, userInput);
    case 'claude_haiku':
      return callClaude3API('claude-3-haiku-20240307', systemInput, userInput);
    case 'claude_opus':
      return callClaude3API('claude-3-opus-20240229', systemInput, userInput);
    case 'sonar-small-chat':
    case 'sonar-medium-online':
    case 'codellama-70b-instruct':
      return callPerplexityAPI(apiType, systemInput, userInput);
    default:
      return new Response(JSON.stringify({ error: 'Unsupported API type' }), { status: 400 });
  }
}

async function callChatGPTAPI(model, systemInput, userInput) {
  // OpenAI APIを呼び出すロジックを実装
  // ここでは疑似コードとしています
  const response = await fetch(env.CHATGPT_API_URL, {
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

  const data = await response.json();
  return new Response(JSON.stringify(data));
}

async function callChatGPTFunctionAPI(systemInput, userInput) {
  // ChatGPT Function APIを呼び出すロジック
  // 以下は疑似コードです
  const response = await fetch('ChatGPT Function APIのURL', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-0613',
      messages: [
        {
          role: 'system',
          content: systemInput + userInput,
        },
      ],
      function_call: {
        name: 'getCurrentTime',
      },
    }),
  });

  const data = await response.json();
  return new Response(JSON.stringify(data));
}

async function callClaude3API(model, systemInput, userInput) {
  // Claude3のAPIを呼び出すロジック
  // 以下は疑似コードです
  const response = await fetch('https://api.anthropic.com/v1/messages', {
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

  const data = await response.json();
  return new Response(JSON.stringify(data));
}

async function callPerplexityAPI(model, systemInput, userInput) {
  /*
  sonar-small-chat, sonar-small-online, sonar-medium-chat, sonar-medium-online, mistral-7b-instruct, and mixtral-8x7b-instruct.
  */
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
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

  const data = await response.json();
  return new Response(JSON.stringify(data));
}
