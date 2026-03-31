export default function PageHeader({ title, sub, right }) {
  return (
    <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
        {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
      </div>
      {right && <div>{right}</div>}
    </div>
  )
}
