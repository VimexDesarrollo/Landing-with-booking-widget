export default function MarqueeBand() {
  const item = (
    <span className="marquee__item">
      Playa del Carmen <span className="dot" />
      <span className="stroke">Tulum</span> <span className="dot" />
      Akumal <span className="dot" />
    </span>
  )
  return (
    <div className="marquee">
      <div className="marquee__track">
        {item}
        {item}
      </div>
    </div>
  )
}
