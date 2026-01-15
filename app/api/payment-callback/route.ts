import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get form data from iyzico
    const formData = await request.formData();
    const token = formData.get('token') as string;
    
    console.log('Payment callback received (POST):', { token });
    
    // Build callback URL
    const callbackUrl = `/payment/callback${token ? `?token=${token}` : ''}`;
    
    // Return HTML with meta redirect and JavaScript fallback
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="refresh" content="0; url=${callbackUrl}" />
          <script>window.location.href = '${callbackUrl}';</script>
        </head>
        <body>
          <p>Redirecting...</p>
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Payment callback error:', error);
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="refresh" content="0; url=/payment/callback?error=true" />
          <script>window.location.href = '/payment/callback?error=true';</script>
        </head>
        <body>
          <p>Redirecting...</p>
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
}

export async function GET(request: NextRequest) {
  // If GET request, just redirect to callback page
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  const redirectUrl = new URL('/payment/callback', request.url);
  if (token) {
    redirectUrl.searchParams.set('token', token);
  }
  
  return NextResponse.redirect(redirectUrl);
}
