import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/strava?error=no_code', request.url))
  }

  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    })

    const data = await response.json()

    if (data.errors) {
      return NextResponse.redirect(new URL('/strava?error=auth_failed', request.url))
    }

    const params = new URLSearchParams({
      access_token: data.access_token,
      athlete_id: data.athlete.id,
      athlete_name: data.athlete.firstname + ' ' + data.athlete.lastname,
      athlete_photo: data.athlete.profile || '',
      athlete_city: data.athlete.city || '',
      athlete_country: data.athlete.country || '',
    })

    return NextResponse.redirect(new URL('/strava?connected=true&' + params.toString(), request.url))

  } catch (error) {
    console.error('Strava auth error:', error)
    return NextResponse.redirect(new URL('/strava?error=server_error', request.url))
  }
}