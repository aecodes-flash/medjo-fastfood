export default function Statcard({ title, value, desc }) {
  return (
    <div className="stat">
      <div className="stat-title text-[#888] text-xs font-black uppercase tracking-widest">
        {title}
      </div>
      <div className="stat-value text-white text-2xl font-black">
        {value}
      </div>
      <div className="stat-desc text-[#555] text-xs">
        {desc}
      </div>
    </div>
  );
}