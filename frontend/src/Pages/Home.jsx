import { Link } from 'react-router-dom'
import cake from '../assets/cake.jpeg'
import frenchfries from '../assets/frenchfries.jpeg'
import homebg2 from '../assets/homebg2.png'
import homebg from '../assets/homebg.jpeg'
import juice from '../assets/juice.jpeg'
import milktea from '../assets/milktea.jpeg'
import pizza from '../assets/pizza.jpg'
import chicken1 from '../assets/chicken1.jpg'
import burger2 from '../assets/burger2.png'
import hotdeals from '../assets/hotdeals.jpg'
import hotdeals1 from '../assets/hotdeals1.jpg'
import Navbar from '../Components/Navbar'
import { FaFacebook, FaTwitter } from "react-icons/fa"
import { BsInstagram } from "react-icons/bs"
import { MdLocalFireDepartment, MdDeliveryDining, MdVerified } from "react-icons/md"

const menuItems = [
  { img: pizza, name: 'Pizza', no: '01', tag: null },
  { img: cake, name: 'Cake', no: '02', tag: 'Chef\u2019s Pick' },
  { img: milktea, name: 'Milk Tea', no: '03', tag: null },
  { img: chicken1, name: 'Chicken', no: '04', tag: 'Best Seller' },
  { img: burger2, name: 'Burger', no: '05', tag: null },
]

const whyUs = [
  {
    icon: MdLocalFireDepartment,
    label: 'Hot & Fresh',
    desc: 'Cooked to order, every time — nothing sits around waiting for you.',
  },
  {
    icon: MdDeliveryDining,
    label: 'Fast Delivery',
    desc: 'From the fryer to your door in record time, still steaming.',
  },
  {
    icon: MdVerified,
    label: 'Honest Prices',
    desc: 'Real portions, fair prices — no surprise fees at checkout.',
  },
]

export default function Home() {
  return (
    <div className="bg-[#161513]">
      <Navbar />

      {/* fonts + keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;800&display=swap');
        .font-display { font-family: 'Bebas Neue', 'Impact', sans-serif; letter-spacing: 0.03em; }
        .font-accent { font-family: 'Fraunces', serif; font-style: italic; }
        .font-body { font-family: 'Inter', sans-serif; }

        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker-track { animation: ticker 26s linear infinite; }

        @keyframes bounce-down { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
        .scroll-cue { animation: bounce-down 1.8s ease-in-out infinite; }

        @keyframes spin-slow { to { transform: rotate(360deg); } }
        .spin-slow { animation: spin-slow 14s linear infinite; }

        @keyframes flicker {
          0%, 19%, 21%, 23%, 54%, 56%, 100% { opacity: 1; }
          20%, 22%, 55% { opacity: 0.45; }
        }
        .flicker { animation: flicker 5s infinite; }

        .grain::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.05;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker-track, .scroll-cue, .spin-slow, .flicker { animation: none !important; }
        }
      `}</style>

      <div className="min-h-screen font-body">

        {/* ---------- HERO ---------- */}
        <div className="grain relative h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={homebg2} alt="RAEYSN" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-[#161513] via-black/65 to-black/30"></div>
            <div className="absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-black/20"></div>
          </div>

          <div className="relative text-center text-white px-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-6 border border-white/20 rounded-full px-4 py-1.5 backdrop-blur-sm bg-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E87722] flicker"></span>
              <span className="text-white/80 font-semibold tracking-[0.25em] text-[11px]">(Your Business Name)</span>
            </div>

            <h1 className="font-display text-6xl md:text-8xl font-black text-white mb-6 leading-[0.92]">
              THERE IS NO <span className="font-accent font-medium not-italic text-[#E87722]">SINCERE</span> LOVE
              <br />THAN OUR FOOD
            </h1>

            <p className="text-white/60 text-sm md:text-base max-w-md mx-auto mb-10 font-body">
              Handmade, fired up, and out the door fast — welcome to (Your Business Name).
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link to='/cart'
                className="bg-[#E87722] hover:bg-white hover:text-[#161513] hover:scale-105 text-white px-10 py-4 md:px-14 md:py-5 rounded-full font-bold transition duration-300 shadow-lg shadow-orange-900/40">
                ORDER NOW
              </Link>
              <Link to='/menu'
                className="bg-white/10 backdrop-blur border border-white/30 hover:bg-white hover:text-[#161513] hover:scale-105 text-white px-10 py-4 md:px-14 md:py-5 rounded-full font-bold transition duration-300">
                VIEW MENU
              </Link>
            </div>
          </div>

          {/* signature element: rotating badge, like a food-truck stamp */}
          <div className="hidden md:flex absolute bottom-10 right-10 items-center justify-center w-28 h-28">
            <svg viewBox="0 0 100 100" className="spin-slow absolute w-full h-full">
              <defs>
                <path id="badge-circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
              </defs>
              <text fill="#E87722" fontSize="8.5" letterSpacing="2" fontFamily="Inter, sans-serif" fontWeight="700">
                <textPath href="#badge-circle">
                  FRESH • FAST • FIRE • FRESH • FAST • FIRE •
                </textPath>
              </text>
            </svg>
            <span className="font-display text-2xl text-white">🔥</span>
          </div>

          <div className="scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-2xl">
            ↓
          </div>
        </div>

        {/* ---------- TICKER ---------- */}
        <div className="bg-[#E87722] py-3 overflow-hidden whitespace-nowrap border-y-2 border-black/10">
          <div className="ticker-track inline-flex font-display text-xl md:text-2xl text-[#161513] font-black">
            {Array(2).fill(0).map((_, i) => (
              <span key={i} className="flex items-center shrink-0">
                {['SIZZLING HOT', 'FRESH DAILY', 'FAST DELIVERY', 'MADE WITH LOVE', '(Your Business Name)'].map((t, j) => (
                  <span key={j} className="flex items-center">
                    {t}
                    <span className="mx-8 opacity-50">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ---------- FEATURED MENU ---------- */}
        <section className="bg-[#161513] px-6 py-20">
          <div className="flex items-end justify-between max-w-5xl mx-auto mb-10">
            <div>
              <span className="text-[#E87722] font-bold tracking-[0.3em] text-xs">THE LINEUP</span>
              <h2 className="font-display text-4xl md:text-5xl text-white tracking-wide">FEATURED MENU</h2>
            </div>
            <Link to='/menu' className="hidden md:block text-[#999] hover:text-[#E87722] font-semibold transition">
              See full menu →
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide max-w-5xl mx-auto snap-x snap-mandatory">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to='/menu'
                className="group relative flex flex-col shrink-0 w-60 h-72 rounded-2xl overflow-hidden snap-start ring-1 ring-white/5 hover:ring-[#E87722]/60 transition duration-300 shadow-xl shadow-black/40"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-60 h-72 object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-black/40"></div>

                <span className="absolute top-3 left-3 font-display text-white/70 text-sm tracking-widest">
                  No.{item.no}
                </span>

                {item.tag && (
                  <span className="absolute top-3 right-3 bg-[#E87722] text-[#161513] text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full">
                    {item.tag}
                  </span>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                  <span className="text-white font-display text-2xl tracking-wide">{item.name}</span>
                  <span className="w-9 h-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white group-hover:bg-[#E87722] group-hover:text-[#161513] transition">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ---------- WHY US ---------- */}
        <section className="relative py-24 px-6">
          <div className="absolute inset-0">
            <img src={homebg} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#161513]/92"></div>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-[#E87722] font-bold tracking-[0.3em] text-xs">WHY (Your Business Name)</span>
              <h2 className="font-display text-4xl md:text-5xl text-white tracking-wide">EAT WITH CONFIDENCE</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-10 sm:divide-x sm:divide-white/10">
              {whyUs.map((f) => {
                const Icon = f.icon
                return (
                  <div key={f.label} className="text-center px-4">
                    <Icon className="mx-auto mb-4 text-[#E87722]" size={34} />
                    <h3 className="font-display text-3xl text-white mb-2 tracking-wide">{f.label}</h3>
                    <p className="text-[#999] text-sm leading-relaxed">{f.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ---------- HOT DEALS ---------- */}
        <section className="bg-[#E87722] px-6 py-20 relative overflow-hidden">
          <div className="text-center mb-10 relative">
            <span className="text-[#161513]/70 font-bold tracking-[0.3em] text-xs">DON'T MISS OUT</span>
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-widest">HOT DEALS</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto relative">
            {[hotdeals1, hotdeals].map((img, i) => (
              <Link
                key={i}
                to='/menu'
                className="group relative rounded-2xl overflow-hidden cursor-pointer bg-[#161513] block shadow-xl shadow-black/30"
              >
                <img src={img} alt="Hot deal" className="w-full h-52 object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"></div>
                <span className="absolute top-3 left-3 bg-[#161513] text-white font-bold px-4 py-1 rounded-full text-sm flex items-center gap-1.5">
                  <MdLocalFireDepartment className="text-[#E87722]" /> Super Hot Deal
                </span>
                <span className="absolute bottom-3 right-3 bg-white text-[#161513] font-display text-sm px-4 py-1.5 rounded-full tracking-widest group-hover:bg-[#E87722] group-hover:text-white transition">
                  Add to Cart →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ---------- FOOTER ---------- */}
        <footer className='bg-[#161513] border-t border-white/5 px-6 py-12 flex flex-col items-center justify-center gap-5'>
          <span className="font-display text-3xl text-white tracking-widest">(Your Business Name)</span>
          <div className="flex items-center justify-center gap-6">
            <a href='https://www.facebook.com/aejoshchrinze' className='text-[#999] hover:text-[#E87722] transition duration-300'>
              <FaFacebook size={22} />
            </a>
            <a href='https://twitter.com' className='text-[#999] hover:text-[#E87722] transition duration-300'>
              <FaTwitter size={22} />
            </a>
            <a href='https://www.instagram.com/_1hiroshi_?igsh=MXE5dmZmMTl5MDh3aw%3D%3D' className='text-[#999] hover:text-[#E87722] transition duration-300'>
              <BsInstagram size={22} />
            </a>
          </div>
          <p className="text-[#555] text-xs">© {new Date().getFullYear()} RAEYSN. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}