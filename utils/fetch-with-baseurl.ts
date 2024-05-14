const baseUrl = process.env.NEXT_FETCH_BASEURL;

export async function fetchWithBaseUrl(url: string, init?: RequestInit) {
  const resquestUrl = baseUrl ? `${baseUrl}${url}` : url;

  const response = await fetch(resquestUrl, {
    ...init,
    headers: {
      ...init?.headers,
      "Accept-Language": "zh-Hans",
    },
  });

  return response.json();
}
