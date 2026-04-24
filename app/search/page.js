'use client'
import { useState } from 'react'
import Link from 'next/link'

const RACES = [
  { id: 1, name: 'Montreal Marathon 2025', date: 'Sept 28, 2025', photos: 142 },
  { id: 2, name: 'Laval 10K Spring', date: 'May 11, 2025', photos: 87 },
  { id: 3, name: 'Mont Royal Parkrun #204', date: 'Apr 19, 2025', photos: 34 },
]

export default function Search() {
  const [step, setStep] = useState(1)
  const [selectedRace, setSelectedRace] = useState(null)
  const [selfie, setSelfie] = useState(null)
  const [selfiePreview, setSelfiePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])

  function handleRaceSelect(race) {
    setSelectedRace(race)
    setStep(2)
  }

  function handleSelfieUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setSelfie(file)
    setSelfiePreview(URL.createObjectURL(file))
  }

  async function handleSearch() {
    setLoading(true)
    setStep(3)
    try {
      const formData = new FormData()
      formData.append('selfie', selfie)
      formData.append('raceId', selectedRace.id)
      const response = await fetch('/api/search', { method: 'POST', body: formData })
      const data = await response.json()
      if (data.success && data.matches.length > 0) {
        setResults(data.matches)
      } else {
        setResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-8 mt-4">
        <Link href="/" className="text-gray-500 hover:text-white transition text-sm">Back</Link>
        <h1 className="text-xl font-bold tracking-tight">Stryd</h1>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {['Pick race', 'Your selfie', 'Results'].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 text-xs font-medium transition ${step === i+1 ? 'text-orange-400' : step > i+1 ? 'text-green-400' : 'text-gray-600'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border transition ${step === i+1 ? 'border-orange-400 text-orange-400' : step > i+1 ? 'border-green-400 bg-green-400 text-gray-950' : 'border-gray-700 text-gray-700'}`}>
                {step > i+1 ? '✓' : i+1}
              </div>
              {label}
            </div>
            {i < 2 && <div className={`h-px w-6 transition ${step > i+1 ? 'bg-green-400' : 'bg-gray-700'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">Which race?</h2>
          <p className="text-gray-400 mb-6 text-sm">Pick the race you ran and we will search its photo pool.</p>
          <div className="flex flex-col gap-3">
            {RACES.map(race => (
              <button key={race.id} onClick={() => handleRaceSelect(race)} className="text-left border border-gray-800 hover:border-orange-500 bg-gray-900 hover:bg-gray-800 rounded-2xl p-4 transition group">
                <div className="font-semibold group-hover:text-orange-400 transition">{race.name}</div>
                <div className="text-sm text-gray-500 mt-1 flex justify-between">
                  <span>{race.date}</span>
                  <span>{race.photos} photos</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">Take a selfie</h2>
          <p className="text-gray-400 mb-6 text-sm">We will use it to find you in photos from <span className="text-white">{selectedRace.name}</span>. Your selfie is never stored.</p>
          <label className="block cursor-pointer">
            <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition ${selfiePreview ? 'border-orange-500' : 'border-gray-700 hover:border-gray-500'}`}>
              {selfiePreview ? (
                <img src={selfiePreview} alt="Your selfie" className="w-32 h-32 rounded-full object-cover mx-auto mb-3" />
              ) : (
                <div className="text-5xl mb-3">🤳</div>
              )}
              <p className="text-sm text-gray-400">{selfiePreview ? 'Looking good — tap to change' : 'Tap to take or upload a selfie'}</p>
            </div>
            <input type="file" accept="image/*" capture="user" className="hidden" onChange={handleSelfieUpload} />
          </label>
          {selfiePreview && (
            <button onClick={handleSearch} className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-full transition text-lg">
              Find my photos →
            </button>
          )}
          <button onClick={() => setStep(1)} className="w-full mt-3 text-gray-600 hover:text-gray-400 text-sm transition">← Change race</button>
        </div>
      )}

      {step === 3 && (
        <div>
          {loading ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4 animate-spin inline-block">⟳</div>
              <p className="text-gray-400">Searching {selectedRace.name}...</p>
              <p className="text-gray-600 text-sm mt-2">Scanning {selectedRace.photos} photos</p>
            </div>
          ) : (
            <div>
              {results.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold mb-1">Found {results.length} photo{results.length !== 1 ? 's' : ''}</h2>
                  <p className="text-gray-400 text-sm mb-6">From <span className="text-white">{selectedRace.name}</span></p>
                  <div className="flex flex-col gap-4">
                    {results.map(photo => (
                      <div key={photo.faceId} className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900">
                        <img src={photo.photoUrl} alt="Race photo" className="w-full h-56 object-cover" />
                        <div className="p-3 flex justify-between items-center">
                          <div>
                            <p className="text-xs text-gray-500">Community photo</p>
                            <p className="text-xs text-green-400 mt-0.5">{photo.confidence}% match</p>
                          </div>
                          <a href={photo.photoUrl} download target="_blank" rel="noreferrer">
                            <button className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition">Download</button>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🔍</div>
                  <h2 className="text-2xl font-bold mb-2">No matches found</h2>
                  <p className="text-gray-400 text-sm mb-6">No photos matched your selfie in this race yet. Try uploading some photos first!</p>
                  <Link href="/upload">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition">Upload race photos</button>
                  </Link>
                </div>
              )}
              <div className="mt-6 border border-orange-500/30 bg-orange-500/10 rounded-2xl p-4">
                <p className="text-sm text-orange-300 font-medium mb-1">Unlock all results</p>
                <p className="text-xs text-gray-400">Upload your own photos from this race to get unlimited free downloads.</p>
                <Link href="/upload">
                  <button className="mt-3 w-full border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white text-sm font-medium py-2 rounded-full transition">Upload photos from this race</button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
