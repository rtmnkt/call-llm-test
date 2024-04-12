export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  if (url.searchParams.get('p') == 'test314') {
    // const res = Response.redirect('/index2.html', 301)
    // res = new Response(res.body, res);
    const res = fetch('/index2.html')
    await context.waitUntil(res)
    return new Response((await res).body)
  }
  return new Response('error')
}