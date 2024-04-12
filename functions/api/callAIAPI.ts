
export async function onRequestPost(context, ) {
  const { request } = context;
  const { apiType, systemInput, userInput } = await request.json();

  switch (apiType) {
    case 'chatgpt':
      return callChatGPTAPI('gpt-3.5-turbo-0125', systemInput, userInput);
    case 'chatgpt4':
      return callChatGPTAPI('gpt-4-0125-preview', systemInput, userInput);
    // 他のAPIタイプに対するケースも同様に追加
    default:
      return new Response(JSON.stringify({ error: 'Unsupported API type' }), { status: 400 });
  }
}

async function callChatGPTAPI(model, systemInput, userInput) {
  // OpenAI APIを呼び出すロジックを実装
  // ここでは疑似コードとしています
  const response = await fetch('OpenAI APIのURL', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
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