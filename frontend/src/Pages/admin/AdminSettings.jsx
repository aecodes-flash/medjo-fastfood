import React, { useState } from 'react'

const toggles = [
  { label: 'Online Ordering', desc: 'Accept orders from the website', default: true },
  { label: 'GCash Payments', desc: 'Enable GCash as payment method', default: true },
  { label: 'Email Notifications', desc: 'Get notified on new orders', default: true },
  { label: 'Customer Reviews', desc: 'Allow customers to leave feedback', default: true },
  { label: 'Maintenance Mode', desc: 'Temporarily close the store', default: false },
]

function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} className={`w-12 h-6 rounded-full transition-colors duration-200 relative shrink-0 ${on ? 'bg-orange-500' : 'bg-gray-600'}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${on ? 'left-6' : 'left-0.5'}`} />
    </button>
  )
}

export default function Setting() {
  const [storeName, setStoreName] = useState('Medyo Fast Food')
  const [deliveryFee, setDeliveryFee] = useState(49)
  const [minOrder, setMinOrder] = useState(100)
  const [states, setStates] = useState(toggles.map(t => t.default))

  const flip = i => setStates(s => s.map((v, idx) => idx === i ? !v : v))

  return (
    <div className="flex gap-6 p-6 bg-[#141414] min-h-screen text-white">

      {/* Store Settings */}
      <div className="flex-1 bg-[#1e1e1e] rounded-2xl p-6 border border-white/10">
        <h2 className="text-lg font-bold tracking-widest uppercase mb-4">Store Settings</h2>
        <div className="border-t border-white/10 pt-4">
          <p className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-4">🏪 General</p>
          {[
            { label: 'Store Name (₱)', value: storeName, set: setStoreName, type: 'text' },
            { label: 'Delivery Fee (₱)', value: deliveryFee, set: setDeliveryFee, type: 'number' },
            { label: 'Minimum Order (₱)', value: minOrder, set: setMinOrder, type: 'number' },
          ].map(({ label, value, set, type }) => (
            <div key={label} className="mb-4">
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-2">{label}</p>
              <input
                type={type}
                value={value}
                onChange={e => set(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500 transition"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notifications & Features */}
      <div className="flex-1 bg-[#1e1e1e] rounded-2xl p-6 border border-white/10">
        <h2 className="text-lg font-bold tracking-widest uppercase mb-4">Notifications & Features</h2>
        <div className="border-t border-white/10 pt-4">
          <p className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-4">🔔 Toggles</p>
          {toggles.map((t, i) => (
            <div key={t.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div>
                <p className="font-semibold text-sm">{t.label}</p>
                <p className="text-xs text-gray-500">{t.desc}</p>
              </div>
              <Toggle on={states[i]} onToggle={() => flip(i)} />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}