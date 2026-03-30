function Line({ width = '100%' }) {
  return (
    <div
      className="h-4 rounded-lg animate-shimmer"
      style={{
        width,
        background: 'linear-gradient(90deg, var(--color-cream-dark) 25%, var(--color-cream) 50%, var(--color-cream-dark) 75%)',
        backgroundSize: '200% 100%',
      }}
    />
  )
}

function Card() {
  return (
    <div className="bg-surface rounded-2xl p-5 shadow-warm-sm border border-cream-dark/40 space-y-3">
      <Line width="70%" />
      <Line width="90%" />
      <Line width="50%" />
    </div>
  )
}

function Page() {
  return (
    <div className="px-4 pt-6 pb-24 space-y-4 animate-fade-in">
      <Line width="40%" />
      <Card />
      <Card />
      <Card />
    </div>
  )
}

export default { Line, Card, Page }
