'use client'
import { useState } from 'react'
import Link from 'next/link'

const RACES = [
  { id: 1, name: 'Montreal Marathon 2025', date: 'Sept 28, 2025' },
  { id: 2, name: 'Laval 10K Spring', date: 'May 11, 2025' },
  { id: 3, name: 'Mont Royal Parkrun #204', date: 'Apr 19, 2025' },
]

export default function Upload() {
  const [step, setStep] = useState(1)
  const [selectedRace, setSelectedRace] = useState(null)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [uploadedCount, setUploadedCount] = useState(0)
  const [done, setDone] = useState(false)

  function handleRaceSelect(race) {
    setSelectedRace(race)
    setStep(2)
  }

  function handleFilesSelected(e) {
    const selected = Array.from(e.target.files)
    setFiles(selected)
    setPreviews(selected.map(f => URL.createObjectURL(f)))
  }

  async function handleUpload() {
    setStep(3)
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData()
      formData.append('photo', files[i])
      formData.append('raceId', selectedRace.id)
      formData.append('photoId', `photo-${Date.now()}-${i}`)
      try {
        await fetch('/api/upload', { method: 'POST', body: formData })
      } catch (error) {
        console.error('Upload error:', error)
      }
      setUploadedCount(i + 1)
    }
    setDone(true)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-8 mt-4">
        <Link href="/" className="text-gray-500 hover:text-white transition text-sm">Back</Link>
        <h1 className="text-xl font-bold tracking-tight">Stryd</h1>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {['Pick race', 'Your photos', 'Uploading'].map((label, i) => (
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
          <h2 className="text-2xl font-bold mb-2">Which race did you photograph?</h2>
          <p className="text-gray-400 mb-6 text-sm">Your photos will be added to that race so runners can find themselves.</p>
          <div className="flex flex-col gap-3">
            {RACES.map(race => (
              <button key={race.id} onClick={() => handleRaceSelect(race)} className="text-left border border-gray-800 hover:border-orange-500 bg-gray-900 hover:bg-gray-800 rounded-2xl p-4 transition group">
                <div className="font-semibold group-hover:text-orange-400 transition">{race.name}</div>
                <div className="text-sm text-gray-500 mt-1">{race.date}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">Add your photos</h2>
          <p className="text-gray-400 mb-6 text-sm">Select all the photos you took at <span className="text-white">{selectedRace.name}</span>.</p>
          <label className="block cursor-pointer">
            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition ${previews.length > 0 ? 'border-orange-500' : 'border-gray-700 hover:border-gray-500'}`}>
              {previews.length > 0 ? (
                <div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {previews.slice(0, 6).map((src, i) => (
                      <img key={i} src={src} alt="" className="w-full h-20 object-cover rounded-lg" />
                    ))}
                  </div>
                  <p className="text-sm text-orange-400 font-medium">{files.length} photo{files.length !== 1 ? 's' : ''} selected</p>
                  <p className="text-xs text-gray-500 mt-1">Tap to change selection</p>
                </div>
              ) : (
                <div>
                  <div className="text-5xl mb-3">📷</div>
                  <p className="text-sm text-gray-400">Tap to select race photos</p>
                  <p className="text-xs text-gray-600 mt-1">JPG, PNG — multiple files supported</p>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFilesSelected} />
          </label>
          {previews.length > 0 && (
            <button onClick={handleUpload} className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-full transition text-lg">
              Upload {files.length} photo{files.length !== 1 ? 's' : ''} →
            </button>
          )}
          <button onClick={() => setStep(1)} className="w-full mt-3 text-gray-600 hover:text-gray-400 text-sm transition">← Change race</button>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-12">
          {!done ? (
            <div>
              <div className="text-5xl mb-6">⬆️</div>
              <h2 className="text-2xl font-bold mb-2">Uploading...</h2>
              <p className="text-gray-400 text-sm mb-6">{uploadedCount} of {files.length} photos indexed</p>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full transition-all duration-500" style={{ width: `${files.length ? (uploadedCount / files.length) * 100 : 0}%` }} />
              </div>
            </div>
          ) : (
            <div>
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-2xl font-bold mb-2">Photos uploaded!</h2>
              <p className="text-gray-400 text-sm mb-8">{files.length} photo{files.length !== 1 ? 's' : ''} added to <span className="text-white">{selectedRace.name}</span>.</p>
              <div className="border border-green-500/30 bg-green-500/10 rounded-2xl p-4 mb-6 text-left">
                <p className="text-sm text-green-400 font-medium mb-1">Search unlocked</p>
                <p className="text-xs text-gray-400">You have uploaded photos from this race — your selfie search is now free and unlimited.</p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/search">
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-full transition">Find myself in photos →</button>
                </Link>
                <button onClick={() => { setStep(1); setFiles([]); setPreviews([]); setUploadedCount(0); setDone(false); }} className="w-full border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white font-medium py-3 rounded-full transition text-sm">
                  Upload photos from another race
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
