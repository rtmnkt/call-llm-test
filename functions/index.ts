export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  if (url.searchParams.get('p') == 'test314') {
    let res = await fetch('/index2.html');
    res = new Response(res.body, res);
    return res
  }
  return new Response('error')
}