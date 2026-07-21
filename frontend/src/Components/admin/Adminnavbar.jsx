export default function AdminNavbar({ title, search, setSearch }) {
  return (
    <header className="bg-[#181818] border-b border-white/5 px-8 py-4 flex items-center gap-4 sticky top-0 z-40">
      <h1 className="font-black text-2xl uppercase tracking-widest flex-1">{title}</h1>
      <div className="flex items-center gap-2 bg-[#222] border border-white/5 rounded-xl px-4 py-2.5 w-72">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          className="bg-transparent outline-none text-sm text-white placeholder-[#555] w-full"
        />
      </div>
    </header>
  );
}