import { NextRequest, NextResponse } from 'next/server';

async function handleProxy(req: NextRequest, { params }: { params: { slug: string[] } }) {
  try {
    // If slug is defined, join it. Else it's just /api/
    const slugParams = await params;
    const slugPath = slugParams && slugParams.slug ? slugParams.slug.join('/') : '';
    const searchParams = req.nextUrl.search;
    
    // Hardcode the EC2 IP and force a trailing slash to satisfy Django
    const backendUrl = `http://44.194.104.133/api/${slugPath}/${searchParams}`;
    
    console.log("Proxying request to:", backendUrl);

    // Forward the request to the EC2 backend
    const response = await fetch(backendUrl, {
      method: req.method,
      headers: {
        'Content-Type': req.headers.get('content-type') || 'application/json',
        'Authorization': req.headers.get('authorization') || '',
      },
      // Pass the body only if it's not a GET or HEAD request
      body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined,
    });

    // Get the response data
    const data = await response.text();
    
    // Return exactly what the backend responded with
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: 'Proxy failed to connect to backend', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, ctx: any) { return handleProxy(req, ctx); }
export async function POST(req: NextRequest, ctx: any) { return handleProxy(req, ctx); }
export async function PUT(req: NextRequest, ctx: any) { return handleProxy(req, ctx); }
export async function PATCH(req: NextRequest, ctx: any) { return handleProxy(req, ctx); }
export async function DELETE(req: NextRequest, ctx: any) { return handleProxy(req, ctx); }
