import { Link } from 'react-router-dom'
import cake from '../assets/cake.jpeg'
import frenchfries from '../assets/frenchfries.jpeg'
import homebg2 from '../assets/homebg2.png'
import homebg from '../assets/homebg.jpeg'
import juice from '../assets/juice.jpeg'
import milktea from '../assets/milktea.jpeg'
import pizza from '../assets/pizza.jpg'
import chicken1 from '../assets/chicken1.jpg'
import burger2 from'../assets/burger2.png'
import hotdeals from '../assets/hotdeals.jpg'
import hotdeals1 from '../assets/hotdeals1.jpg'
import Navbar from '../Components/Navbar'
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";


export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen">
        <div className="pt-0">
          <div className="relative h-135 flex items-center justify-center">
  <div className="absolute inset-0">
    <img src={homebg2} alt="Background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60"></div>
            </div>s
            <div className="relative text-center text-white px-4">
<h1 className="text-6xl font-black text-white  mb-4 tracking-wide" style={{ fontFamily: 'Impact, "Arial Narrow", sans-serif' }}>THERE IS NO SINCERE LOVE THAN OUR FOOD</h1>              <div className="flex gap-4 justify-center mt-8">
                <Link to='/cart'
            className="bg-white/90 hover:bg-orange-500 hover:scale-110 hover:text-white text-black px-13 py-7 rounded-full font-bold transition duration-300">
            ORDER NOW
                </Link>
                <Link to='/menu'
              className="bg-white/90 hover:bg-orange-500 hover:scale-110 hover:text-white text-black px-9 py-7 rounded-full font-bold transition duration-300">
                  MORE
                </Link>
              </div>
            </div>
          </div>

        <section className=" min-h-full bg-[#1a1a1a] px-6 py-16 ">
  <div className="flex items-center justify-center max-w-5xl mx-auto mb-8">
    <h2 className="text-3xl font-black text-white tracking-widest">FEATURED MENU</h2>
  </div>
  <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide max-w-5xl mx-auto">
    <Link to='/menu' className="flex flex-col items-center gap-3 shrink-0">
      <img src={pizza} alt="Pizza" className="w-60 h-60 object-cover rounded-2xl hover:scale-105 transition duration-300" />
      <span className="bg-[#E87722] text-white font-bold px-5 py-1 rounded-full text-sm">Pizza</span>
    </Link>
    <Link to='/menu' className="flex flex-col items-center gap-3 shrink-0">
      <img src={cake} alt="Cake" className="w-60 h-60 object-cover rounded-2xl hover:scale-105 transition duration-300" />
      <span className="bg-[#E87722] text-white font-bold px-5 py-1 rounded-full text-sm">Cake</span>
    </Link>
    <Link to='/menu' className="flex flex-col items-center gap-3 shrink-0">
      <img src={milktea} alt="Milk Tea" className="w-60 h-60 object-cover rounded-2xl hover:scale-105 transition duration-300" />
      <span className="bg-[#E87722] text-white font-bold px-5 py-1 rounded-full text-sm">Milk tea</span>
    </Link>
    <Link to='/menu' className="flex flex-col items-center gap-3 shrink-0">
      <img src={chicken1} alt="Chicken" className="w-60 h-60 object-cover rounded-2xl hover:scale-105 transition duration-300" />
      <span className="bg-[#E87722] text-white font-bold px-5 py-1 rounded-full text-sm">Chicken</span>
    </Link>
    <Link to='/menu' className="flex flex-col items-center gap-3 shrink-0">
      <img src={burger2} alt="Burger" className="w-60 h-60 object-cover rounded-2xl hover:scale-105 transition duration-300" />
      <span className="bg-[#E87722] text-white font-bold px-5 py-1 rounded-full text-sm">Burger</span>
    </Link>
  </div>
</section>

          <section className="bg-orange-500 px-6 py-12">
            <h2 className="text-3xl font-black text-center text-white tracking-widest mb-8">
              HOT DEALS
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <Link to='/menu' className="relative rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition duration-300 block">
                <img src={hotdeals1} alt="Hot Deal 1" className="w-full h-52 object-cover" />
                <span className="absolute top-3 left-3 bg-orange-500 text-white font-bold px-4 py-1 rounded-full text-sm">Super Hot Deal Meals</span>
              </Link>
              <Link to='/menu' className="relative rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition duration-300 block">
                <img src={hotdeals} alt="Hot Deal 2" className="w-full h-52 object-cover" />
                <span className="absolute top-3 left-3 bg-orange-500 text-white font-bold px-4 py-1 rounded-full text-sm">Super Hot Deal Meals</span>
              </Link>
            </div>
          </section>

        <footer className='bg-[#1a1a1a] px-6 py-8 flex items-center justify-center gap-6'>
  <a href='https://www.facebook.com/aejoshchrinze'
    className='text-white hover:text-blue-600 transition duration-300'>
    <FaFacebook size={35} />
  </a>
  <a href='https://twitter.com'
    className='text-white hover:text-blue-600 transition duration-300'>
    <FaTwitter size={35} />
  </a>
  <a href='https://www.instagram.com/_1hiroshi_?igsh=MXE5dmZmMTl5MDh3aw%3D%3D'
    className='text-white hover:text-blue-600 transition duration-300'>
    <BsInstagram size={35} />
  </a>
</footer>
        </div>
      </div>
    </div>
  )
}
