export const onRequest: PagesFunction<Env> = async (context) => {
  const { request } = context;
  const url = new URL(context.request.url)

  // /api/public はチェックしない. それ以外は全て簡易チェックする.
  if (!url.pathname.startsWith('/api/public')) {
    const auth = request.headers.get('Authorization') ?? '';
    if (auth == '') return new Response('Forbidden Authorization', { status: 403 })

    const hashHex = await sha256(auth);
    if (hashHex != 'adcdd46d404416efa4da09a7768c19323613fd1d0536aa2f1740583124ea9622') {
      return new Response('Forbidden', { status: 403 })
    }
  }

  try {
    return await context.next();
  } catch (err) {
    return new Response(`${err.message}\n${err.stack}`, { status: 500 });
  }
}


async function sha256(message) {
  // 文字列をUint8Arrayにエンコード
  const msgBuffer = new TextEncoder().encode(message);

  // ハッシュ化
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // ArrayBufferを16進数の文字列に変換
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}
