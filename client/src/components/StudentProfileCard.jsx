import { Phone, Mail, MapPin, Calendar, Armchair, Hash, Clock, ShieldCheck, QrCode } from 'lucide-react'

const shiftIcon = { Morning: '🌅', Afternoon: '☀️', Evening: '🌆', Night: '🌙' }

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700/60 last:border-0">
    <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
      <Icon size={12} className="text-blue-500 dark:text-blue-400" />
    </div>
    <span className="text-xs text-gray-400 dark:text-gray-500 w-14 flex-shrink-0">{label}</span>
    <span className="text-xs font-semibold ml-auto text-right text-gray-800 dark:text-gray-100 max-w-[55%] truncate">{value}</span>
  </div>
)

export default function StudentProfileCard({ student }) {
  const joined = new Date(student.joined).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">

      {/* ── Header ── */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-700 px-5 pt-6 pb-10">
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute top-2 -left-6 w-20 h-20 rounded-full bg-white/5" />

        <div className="relative flex flex-col items-center text-center gap-2">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-300 to-indigo-400 flex items-center justify-center text-blue-900 font-black text-2xl shadow-lg ring-4 ring-white/20">
            {student.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">{student.name}</h2>
            <p className="text-blue-300 text-xs mt-0.5 font-medium tracking-wide">
              {shiftIcon[student.shift]} {student.shift} Shift · KD Library
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              student.active
                ? 'bg-green-400/20 text-green-300 ring-1 ring-green-400/40'
                : 'bg-gray-400/20 text-gray-300 ring-1 ring-gray-400/40'
            }`}>
              {student.active ? '● Active' : '○ Inactive'}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              student.fee === 'Paid'
                ? 'bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-400/40'
                : 'bg-red-400/20 text-red-300 ring-1 ring-red-400/40'
            }`}>
              Fee: {student.fee}
            </span>
          </div>
        </div>
      </div>

      {/* ── ID chips ── */}
      <div className="relative -mt-5 mx-4 flex gap-2">
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 px-3 py-2.5 flex items-center gap-2">
          <Hash size={13} className="text-blue-500 flex-shrink-0" />
          <div>
            <p className="text-[9px] text-gray-400 uppercase tracking-wide">Roll No</p>
            <p className="text-xs font-bold text-gray-800 dark:text-gray-100 font-mono">{student.roll}</p>
          </div>
        </div>
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 px-3 py-2.5 flex items-center gap-2">
          <Armchair size={13} className="text-indigo-500 flex-shrink-0" />
          <div>
            <p className="text-[9px] text-gray-400 uppercase tracking-wide">Seat No</p>
            <p className="text-xs font-bold text-gray-800 dark:text-gray-100 font-mono">{student.seat || '—'}</p>
          </div>
        </div>
      </div>

      {/* ── Info rows ── */}
      <div className="px-4 pt-3 pb-1">
        <InfoRow icon={Phone}    label="Phone"   value={student.phone} />
        <InfoRow icon={Mail}     label="Email"   value={student.email || '—'} />
        <InfoRow icon={MapPin}   label="Address" value={student.address || '—'} />
        <InfoRow icon={Clock}    label="Shift"   value={`${shiftIcon[student.shift]} ${student.shift}`} />
        <InfoRow icon={Calendar} label="Joined"  value={joined} />
      </div>

      {/* ── QR + Barcode ── */}
      {(student.qrcode || student.barcode) && (
        <div className="mx-4 mb-4 mt-2 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
          {student.qrcode && (
            <div className="flex items-center gap-3 px-3 py-2.5 border-b border-gray-100 dark:border-gray-700">
              <img src={student.qrcode} alt="QR Code" className="w-16 h-16 rounded-lg flex-shrink-0" />
              <div>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
                  <QrCode size={10} /> Scan to View Profile
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Scan QR with mobile camera</p>
              </div>
            </div>
          )}
          {student.barcode && (
            <div className="flex flex-col items-center gap-1 px-3 py-2.5">
              <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                <ShieldCheck size={10} /> Entry Barcode
              </div>
              <img src={student.barcode} alt="Barcode" className="max-w-full h-10 object-contain" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
