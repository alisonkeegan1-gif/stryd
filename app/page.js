import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <p className="text-orange-400 tracking-widest text-sm font-semibold mb-4 uppercase">
        Race photos — free, forever
      </p>
      <h1 className="text-6xl font-bold mb-4 tracking-tight">
        Stryd
      </h1>
      <p className="text-gray-400 text-xl mb-10 text-center max-w-md">
        Someone captured you mid-stride. Find your race photos in seconds — no fees, no paywalls.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/search">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition">
            Find my photos
          </button>
        </Link>
        <Link href="/upload">
          <button className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold px-8 py-3 rounded-full transition">
            Upload race photos
          </button>
        </Link>
      </div>
      <p className="text-gray-600 text-sm mt-16">
        Powered by runners, for runners.
      </p>
    </main>
  )
}
