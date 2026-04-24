'use client'
import { useState } from 'react'
import Link from 'next/link'

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'training', label: 'Training' },
  { id: 'tips', label: 'Tips' },
  { id: 'photos', label: 'Photos' },
  { id: 'race', label: 'Race experience' },
]

const SAMPLE_POSTS = [
  { id: 1, author: 'Sarah M.', avatar: 'SM', category: 'training', content: 'Just finished my first 30km long run in prep for Montreal Marathon! Anyone else doing it this year?', race: 'Montreal Marathon 2025', image: null, likes: 14, comments: 3, time: '2h ago' },
  { id: 2, author: 'Marc T.', avatar: 'MT', category: 'tips', content: 'Pro tip: start slower than you think you need to. The first 5km should feel embarrassingly easy.', race: null, image: null, likes: 31, comments: 7, time: '5h ago' },
  { id: 3, author: 'Priya S.', avatar: 'PS', category: 'photos', content: 'Amazing shots at Parkrun this morning!', race: 'Mont Royal Parkrun 204', image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=500', likes: 22, comments: 4, time: '8h ago' },
  { id: 4, author: 'James K.', avatar: 'JK', category: 'race', content: 'Laval 10K done! New PB by 47 seconds. The course was fast and crowd support was unreal.', race: 'Laval 10K Spring', image: null, likes: 18, comments: 5, time: '1d ago' },
]

export default function Community() {
  const [posts, setPosts] = useState(SAMPLE_POSTS)
  const [likedPosts, setLikedPosts] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [showCompose, setShowCompose] = useState(false)
  const [newPost, setNewPost] = useState({ content: '', category: 'training', race: '' })

  const filtered = activeCategory === 'all' ? posts : posts.filter(p => p.category === activeCategory)

  function handleLike(id) {
    if (likedPosts.includes(id)) return
    setLikedPosts([...likedPosts, id])
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p))
  }

  function handleSubmit() {
    if (!newPost.content.trim()) return
    setPosts([{ id: Date.now(), author: 'You', avatar: 'ME', category: newPost.category, content: newPost.content, race: newPost.race || null, image: null, likes: 0, comments: 0, time: 'just now' }, ...posts])
    setNewPost({ content: '', category: 'training', race: '' })
    setShowCompose(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6 mt-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-white transition text-sm">Back</Link>
          <h1 className="text-xl font-bold">Stryd</h1>
        </div>
        <button onClick={() => setShowCompose(!showCompose)} className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition">+ Post</button>
      </div>
      <h2 className="text-2xl font-bold mb-1">Community</h2>
      <p className="text-gray-400 text-sm mb-6">Training tips, race experiences and photos from runners like you.</p>
      {showCompose && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6">
          <textarea value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} placeholder="Share a tip, experience or photo..." className="w-full bg-transparent text-white placeholder-gray-600 text-sm resize-none outline-none mb-4" rows={3} />
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <button key={cat.id} onClick={() => setNewPost({ ...newPost, category: cat.id })} className={"text-xs px-3 py-1.5 rounded-full border transition " + (newPost.category === cat.id ? "bg-orange-500 border-orange-500 text-white" : "border-gray-700 text-gray-400")}>{cat.label}</button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Category: {newPost.category}</span>
            <div className="flex gap-2">
              <button onClick={() => setShowCompose(false)} className="text-xs text-gray-500 px-4 py-2">Cancel</button>
              <button onClick={handleSubmit} className="text-xs bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-full">Post</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={"text-xs whitespace-nowrap px-3 py-1.5 rounded-full border transition flex-shrink-0 " + (activeCategory === cat.id ? "bg-orange-500 border-orange-500 text-white" : "border-gray-700 text-gray-400")}>{cat.label}</button>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {filtered.map(post => (
          <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold flex items-center justify-center">{post.avatar}</div>
              <div><p className="text-sm font-medium">{post.author}</p><p className="text-xs text-gray-600">{post.time}</p></div>
              <span className="ml-auto text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400">{post.category}</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">{post.content}</p>
            {post.image && <img src={post.image} alt="" className="w-full h-48 object-cover rounded-xl mb-3" />}
            {post.race && <div className="inline-flex text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full mb-3">{post.race}</div>}
            <div className="flex items-center gap-4 pt-2 border-t border-gray-800">
              <button onClick={() => handleLike(post.id)} className={"flex items-center gap-1.5 text-xs transition " + (likedPosts.includes(post.id) ? "text-orange-400" : "text-gray-500 hover:text-gray-300")}>{likedPosts.includes(post.id) ? "❤️" : "🤍"} {post.likes}</button>
              <button className="flex items-center gap-1.5 text-xs text-gray-500">💬 {post.comments}</button>
              <button className="flex items-center gap-1.5 text-xs text-gray-500 ml-auto">↗ Share</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}