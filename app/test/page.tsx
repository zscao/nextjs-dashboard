import { loadPage } from "./loadPage";

export default async function Test({searchParams}: {searchParams: { [key: string]: string | string[] | undefined }}) {

  const url = searchParams['url'];

  let html = '';
  if(typeof url === 'string') {
    html = await loadPage(url);
  }
  return (
    <main>
      <h1>Test Loading Html Content</h1>
      <div>LOADING {url}</div>

      <textarea id="html" rows={20} cols={100} value={html} readOnly />
    </main>
  )
}