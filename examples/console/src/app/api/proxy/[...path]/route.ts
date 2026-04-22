import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleProxy(req, path);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleProxy(req, path);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleProxy(req, path);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  return handleProxy(req, path);
}

async function handleProxy(req: NextRequest, pathSegments: string[]) {
  const apiKey = req.headers.get('x-api-key') || '';
  let endpoint = '/' + pathSegments.join('/');
  if (!endpoint.endsWith('/')) {
    endpoint += '/';
  }

  if (!apiKey) {
    return NextResponse.json({ durum: 0, aciklama: 'X-API-KEY header missing' }, { status: 400 });
  }

  // Determine target URL - If endpoint already starts with /botlar, don't prepend it again
  const targetDomain = 'https://api.armoyu.com';
  let targetUrl = '';

  if (endpoint.startsWith('/botlar/')) {
    targetUrl = `${targetDomain}${endpoint}`;
  } else {
    targetUrl = `${targetDomain}/botlar/${apiKey}${endpoint}`;
  }

  const method = req.method;
  const headers = new Headers();

  // Whitelist of headers to forward to avoid encoding issues with browser-specific headers
  const allowedHeaders = ['authorization', 'content-type', 'x-api-key', 'accept', 'user-agent', 'x-requested-with'];

  req.headers.forEach((value, key) => {
    if (allowedHeaders.includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  // Ensure X-API-KEY is set from the request or header
  if (apiKey) {
    headers.set('X-API-KEY', apiKey);
  }

  try {
    const fetchOptions: any = {
      method,
      headers,
      cache: 'no-store'
    };

    if (method !== 'GET' && method !== 'HEAD') {
      try {
        // Use clone() to ensure body can be read safely
        const bodyClone = req.clone();
        const arrayBuffer = await bodyClone.arrayBuffer();
        if (arrayBuffer.byteLength > 0) {
          fetchOptions.body = arrayBuffer;
        }
      } catch (bodyError: any) {
        console.warn(`[Proxy] Body read warning: ${bodyError.message}`);
      }
    }

    const response = await fetch(targetUrl, fetchOptions);
    const responseText = await response.text();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    return NextResponse.json(responseData, { status: response.status });
  } catch (error: any) {
    console.error(`[Proxy Error] ${method} ${targetUrl}:`, error);
    return NextResponse.json({
      durum: 0,
      aciklama: `Proxy Error: ${error.message}`,
      targetUrl,
      error: error.stack
    }, { status: 500 });
  }
}
