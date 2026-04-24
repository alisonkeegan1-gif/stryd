'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function StravaPage() {
  const [athlete, setAthlete] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('connected') === 'true') {
      const athleteData = {
        id: params.get('athlete_id'),
        name: params.get('athlete_name'),
        photo: params.get('athlete_photo'),
        city: params.get('athlete_city'),
        country: params.get('athlete_country'),
        access_token: params.get('access_token'),
      }
      setAthlete(athleteData)
      fetchActivities(athleteData.access_token)
      window.history.replaceState({}, '', '/strava')
    }
    if (params.get('error')) {
      setError('Could not connect to Strava. Please try again.')
    }
  }, [])

  async function fetchActivities(token) {
    setLoading(true)
    try {
      const res = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=10', {
        headers: { Authorization: 'Bearer ' + token }
      })
      const data = await res.json()
      const races = data.filter(a => a.type === 'Run' || a.sport_type === 'Run')
      setActivities(races)
    } catch (e) {
      console.error('Failed to fetch activities:', e)
    }
    setLoading(false)
  }

  function formatDistance(meters) {
    const km = (meters / 1000).toFixed(1)
    return km + 'km'
  }

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')
    return m + ':' + String(s).padStart(2, '0')
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
  const redirectUri = encodeURIComponent('http://localhost:3000/api/strava')
  const stravaAuthUrl = 'https://www.strava.com/oauth/authorize?client_id=' + clientId + '&redirect_uri=' + redirectUri + '&response_type=code&scope=activity:read_all'

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-8 mt-4">
        <Link href="/" className="text-gray-500 hover:text-white transition text-sm">Back</Link>
        <h1 className="text-xl font-bold tracking-tight">BibRun</h1>
      </div>

      {!athlete ? (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-2xl">🏃</div>
            <div>
              <h2 className="text-2xl font-bold">Connect Strava</h2>
              <p className="text-gray-400 text-sm">Sync your runs and race history</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <span className="text-xl mt-0.5">📅</span>
              <div>
                <p className="text-sm font-medium mb-1">Auto-fill race dates</p>
                <p className="text-xs text-gray-400">Your Strava runs automatically appear as race options when searching for photos.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <span className="text-xl mt-0.5">📊</span>
              <div>
                <p className="text-sm font-medium mb-1">See your stats</p>
                <p className="text-xs text-gray-400">Total distance, race count, and personal bests all in one place.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <span className="text-xl mt-0.5">👥</span>
              <div>
                <p className="text-sm font-medium mb-1">Find club teammates</p>
                <p className="text-xs text-gray-400">See which of your Strava followers are also on BibRun.</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <a href={stravaAuthUrl}>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-full transition flex items-center justify-center gap-2 text-lg">
              Connect with Strava
            </button>
          </a>
          <p className="text-center text-xs text-gray-600 mt-3">We only read your activity data. We never post on your behalf.</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6">
            {athlete.photo ? (
              <img src={athlete.photo} alt="" className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-orange-500/20 text-orange-400 font-bold text-xl flex items-center justify-center">
                {athlete.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold text-lg">{athlete.name}</p>
              <p className="text-sm text-gray-400">{athlete.city}{athlete.city && athlete.country ? ', ' : ''}{athlete.country}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">✓ Strava connected</span>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-3">Recent runs</h3>

          {loading ? (
            <div className="text-center py-8 text-gray-400 text-sm">Loading your activities...</div>
          ) : activities.length > 0 ? (
            <div className="flex flex-col gap-3">
              {activities.map(activity => (
                <div key={activity.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-sm">{activity.name}</p>
                    <span className="text-xs text-gray-500">{formatDate(activity.start_date)}</span>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Distance</p>
                      <p className="text-sm font-medium text-orange-400">{formatDistance(activity.distance)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="text-sm font-medium">{formatTime(activity.moving_time)}</p>
                    </div>
                    {activity.average_heartrate && (
                      <div>
                        <p className="text-xs text-gray-500">Avg HR</p>
                        <p className="text-sm font-medium">{Math.round(activity.average_heartrate)} bpm</p>
                      </div>
                    )}
                  </div>
                  <Link href="/search">
                    <button className="mt-3 w-full border border-orange-500/40 hover:border-orange-500 text-orange-400 text-xs font-medium py-2 rounded-full transition">
                      Find photos from this run →
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">No recent runs found.</div>
          )}
        </div>
      )}
    </main>
  )
}