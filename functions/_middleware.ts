export const onRequest: PagesFunction<Env> = async (context) => {
    const url = new URL(context.request.url)
    console.log(url.pathname);

    // /api/ はチェックしない. それ以外は全て簡易チェックする.
    if (!url.pathname.startsWith('/api/') &&
        // (url.pathname == '/' || url.pathname == '/index.html') &&
        url.searchParams.get('p') != 'test314') {
        return new Response('error')
    }

    try {
        return await context.next();
    } catch (err) {
        return new Response(`${err.message}\n${err.stack}`, { status: 500 });
    }
}