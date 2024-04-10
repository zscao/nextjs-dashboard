'use server';

export async function loadPage(url: string): Promise<string> {

  try {
    const response = await fetch(url);
    if(!response.ok) {
      return "Error loading page. Status: " + response.statusText;
    }
    return await response.text();
  }
  catch (error) {
    return "Error loading page. " + error as string;
  }

}