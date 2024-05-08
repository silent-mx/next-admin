const baseUrl = process.env.NEXT_FETCH_BASE_URL;

export async function fetchWithBaseUrl(url: string, init?: RequestInit) {
  const requestUrl = baseUrl + url;
  // 如果init header 没有设置Accept-Language, 默认设置为zh-Hans
  const res = await fetch(requestUrl, {
    ...init,
    headers: {
      ...init?.headers,
      "Accept-Language": "zh-Hans",
    },
  });
  return res.json();
}
