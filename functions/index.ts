export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  if (url.searchParams.get('p') == 'test314') {
    const res = Response.redirect('/index2.html', )
    // res = new Response(res.body, res);
    return new Response('2')
  }
  return new Response('error')
}