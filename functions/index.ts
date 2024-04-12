export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  if (url.searchParams.get('p') == 'test314') {
    return fetch('index2.html')
  }
  return new Response('error')
}