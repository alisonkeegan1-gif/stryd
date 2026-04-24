'use client'
import { useState } from 'react'
import Link from 'next/link'

const RACES = [
  { id: 1, name: 'Montreal Marathon 2025', date: 'Sept 28, 2025', distance: '42.2km', transferFee: 'CAD 25' },
  { id: 2, name: 'Laval 10K Spring', date: 'May 11, 2025', distance: '10km', transferFee: 'CAD 10' },
  { id: 3, name: 'Mont Royal Parkrun #204', date: 'Apr 19, 2025', distance: '5km', transferFee: 'Free' },
  { id: 4, name: 'Ottawa Race Weekend', date: 'May 25, 2025', distance: '21.1km', transferFee: 'CAD 15' },
  { id: 5, name: 'Toronto Waterfront Marathon', date: 'Oct 19, 2025', distance: '42.2km', transferFee: 'CAD 30' },
]

const SAMPLE_LISTINGS = [
  { id: 1, race: 'Montreal Marathon 2025', distance: '42.2km', date: 'Sept 28, 2025', transferFee: 'CAD 25', bibNumber: '4821', gender: 'F', size: 'M', seller: 'Sarah M.', sellerRating: 5, reason: 'Injury', verified: true, posted: '2h ago' },
  { id: 2, race: 'Ottawa Race Weekend', distance: '21.1km', date: 'May 25, 2025', transferFee: 'CAD 15', bibNumber: '1203', gender: 'M', size: 'L', seller: 'James K.', sellerRating: 4, reason: 'Schedule conflict', verified: true, posted: '5h ago' },
  { id: 3, race: 'Toronto Waterfront Marathon', distance: '42.2km', date: 'Oct 19, 2025', transferFee: 'CAD 30', bibNumber: '7734', gender: 'F', size: 'S', seller: 'Priya S.', sellerRating: 5, reason: 'Moving abroad', verified: false, posted: '1d ago' },
  { id: 4, race: 'Laval 10K Spring', distance: '10km', date: 'May 11, 2025', transferFee: 'CAD 10', bibNumber: '0392', gender: 'M', size: 'M', seller: 'Marc T.', sellerRating: 5, reason: 'Work travel', verified: true, posted: '2d ago' },
]

export default function Bibs() {
  const [tab, setTab] = useState('browse')
  const [listings, setListings] = useState(SAMPLE_LISTINGS)
  const [filterDistance, setFilterDistance] = useState('all')
  const [contactedListings, setContactedListings] = useState([])
  const [newListing, setNewListing] = useState({ race: '', bibNumber: '', gender: 'M', size: 'M', reason: '', transferConfirmed: false })
  const [submitted, setSubmitted] = useState(false)

  const distances = ['all', '5km', '10km', '21.1km', '42.2km']
  const filtered = filterDistance === 'all' ? listings : listings.filter(l => l.distance === filterDistance)

  function handleContact(id) {
    setContactedListings([...contactedListings, id])
  }

  function handleSubmitListing() {
    if (!newListing.race || !newListing.bibNumber || !newListing.reason || !newListing.transferConfirmed) return
    const race = RACES.find(r => r.name === newListing.race)
    const listing = {
      id: Date.now(),
      race: newListing.race,
      distance: race ? race.distance : '',
      date: race ? race.date : '',
      transferFee: race ? race.transferFee : 'Check race website',
      bibNumber: newListing.bibNumber,
      gender: newListing.gender,
      size: newListing.size,
      seller: 'You',
      sellerRating: 5,
      reason: newListing.reason,
      verified: false,
      posted: 'just now',
    }
    setListings([listing, ...listings])
    setSubmitted(true)
    setTab('browse')
    setNewListing({ race: '', bibNumber: '', gender: 'M', size: 'M', reason: '', transferConfirmed: false })
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6 mt-4">
        <Link href="/" className="text-gray-500 hover:text-white transition text-sm">Back</Link>
        <h1 className="text-xl font-bold tracking-tight">Stryd</h1>
      </div>

      <h2 className="text-2xl font-bold mb-1">Bib Marketplace</h2>
      <p className="text-gray-400 text-sm mb-1">Buy and sell race bibs safely. Every listing is verified.</p>
      <p className="text-xs text-green-400 mb-6">No fees from us — you only pay the race organiser transfer fee directly.</p>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('browse')} className={"flex-1 py-2.5 rounded-full text-sm font-medium transition " + (tab === 'browse' ? 'bg-orange-500 text-white' : 'bg-gray-900 text-gray-400 border border-gray-800')}>Browse bibs</button>
        <button onClick={() => setTab('sell')} className={"flex-1 py-2.5 rounded-full text-sm font-medium transition " + (tab === 'sell' ? 'bg-orange-500 text-white' : 'bg-gray-900 text-gray-400 border border-gray-800')}>List a bib</button>
      </div>

      {submitted && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-4">
          <p className="text-sm text-green-400 font-medium">Bib listed! We will verify it within 24 hours.</p>
        </div>
      )}

      {tab === 'browse' && (
        <div>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {distances.map(d => (
              <button key={d} onClick={() => setFilterDistance(d)} className={"text-xs whitespace-nowrap px-3 py-1.5 rounded-full border transition flex-shrink-0 " + (filterDistance === d ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-700 text-gray-400')}>
                {d === 'all' ? 'All distances' : d}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {filtered.map(listing => (
              <div key={listing.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{listing.race}</p>
                      {listing.verified && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Verified</span>}
                    </div>
                    <p className="text-xs text-gray-500">{listing.date} · {listing.distance}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Transfer fee</p>
                    <p className="text-sm font-bold text-orange-400">{listing.transferFee}</p>
                  </div>
                </div>
                <div className="flex gap-3 mb-3">
                  <div className="bg-gray-800 rounded-xl px-3 py-2 text-center">
                    <p className="text-xs text-gray-500">Bib</p>
                    <p className="text-sm font-bold">#{listing.bibNumber}</p>
                  </div>
                  <div className="bg-gray-800 rounded-xl px-3 py-2 text-center">
                    <p className="text-xs text-gray-500">Gender</p>
                    <p className="text-sm font-bold">{listing.gender}</p>
                  </div>
                  <div className="bg-gray-800 rounded-xl px-3 py-2 text-center">
                    <p className="text-xs text-gray-500">Size</p>
                    <p className="text-sm font-bold">{listing.size}</p>
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 mb-3">
                  <p className="text-xs text-gray-400">The transfer fee above is charged by the race organiser directly. Stryd charges nothing.</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Seller: {listing.seller} {'★'.repeat(listing.sellerRating)}</p>
                    <p className="text-xs text-gray-600 mt-0.5">Reason: {listing.reason} · {listing.posted}</p>
                  </div>
                  <button onClick={() => handleContact(listing.id)} className={"text-xs font-semibold px-4 py-2 rounded-full transition " + (contactedListings.includes(listing.id) ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-orange-500 hover:bg-orange-600 text-white')}>
                    {contactedListings.includes(listing.id) ? 'Contacted' : 'Contact seller'}
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-sm">No bibs available for this distance yet.</div>
            )}
          </div>
        </div>
      )}

      {tab === 'sell' && (
        <div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
            <p className="text-sm font-medium mb-3">How it works</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-3 text-xs text-gray-400">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0 font-bold">1</span>
                List your bib with your registration confirmation
              </div>
              <div className="flex items-start gap-3 text-xs text-gray-400">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0 font-bold">2</span>
                We verify the bib is legitimate within 24 hours
              </div>
              <div className="flex items-start gap-3 text-xs text-gray-400">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0 font-bold">3</span>
                Buyer contacts you and pays the race transfer fee directly to the organiser. Stryd takes nothing.
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Race</label>
              <select value={newListing.race} onChange={e => setNewListing({ ...newListing, race: e.target.value })} className="w-full bg-gray-900 border border-gray-800 text-white text-sm px-4 py-3 rounded-xl outline-none">
                <option value="">Select a race...</option>
                {RACES.map(r => <option key={r.id} value={r.name}>{r.name} — {r.distance} (transfer fee: {r.transferFee})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Bib number</label>
              <input value={newListing.bibNumber} onChange={e => setNewListing({ ...newListing, bibNumber: e.target.value })} placeholder="e.g. 4821" className="w-full bg-gray-900 border border-gray-800 text-white text-sm px-4 py-3 rounded-xl outline-none placeholder-gray-600" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-2 block">Gender category</label>
                <select value={newListing.gender} onChange={e => setNewListing({ ...newListing, gender: e.target.value })} className="w-full bg-gray-900 border border-gray-800 text-white text-sm px-4 py-3 rounded-xl outline-none">
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="X">Non-binary</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-2 block">T-shirt size</label>
                <select value={newListing.size} onChange={e => setNewListing({ ...newListing, size: e.target.value })} className="w-full bg-gray-900 border border-gray-800 text-white text-sm px-4 py-3 rounded-xl outline-none">
                  <option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Reason for selling</label>
              <input value={newListing.reason} onChange={e => setNewListing({ ...newListing, reason: e.target.value })} placeholder="e.g. Injury, schedule conflict..." className="w-full bg-gray-900 border border-gray-800 text-white text-sm px-4 py-3 rounded-xl outline-none placeholder-gray-600" />
            </div>
            <div className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4">
              <input type="checkbox" id="transfer" checked={newListing.transferConfirmed} onChange={e => setNewListing({ ...newListing, transferConfirmed: e.target.checked })} className="mt-0.5 accent-orange-500" />
              <label htmlFor="transfer" className="text-xs text-gray-400 leading-relaxed">I confirm this is a legitimate registration and I will transfer it directly to the buyer through the official race website. I understand Stryd charges no fee for this service.</label>
            </div>
            <button onClick={handleSubmitListing} disabled={!newListing.race || !newListing.bibNumber || !newListing.reason || !newListing.transferConfirmed} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-semibold py-4 rounded-full transition">
              List my bib for free
            </button>
          </div>
        </div>
      )}
    </main>
  )
}