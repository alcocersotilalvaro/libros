import React from 'react'

export default function FilterBar({ categories, active, onSelect, counts }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect('Todas')}
        className={`chip ${active === 'Todas' ? 'chip-active' : 'chip-idle'}`}
      >
        Todas
        <span className="opacity-70">({counts.__all__ || 0})</span>
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`chip ${active === cat ? 'chip-active' : 'chip-idle'}`}
        >
          {cat}
          <span className="opacity-70">({counts[cat] || 0})</span>
        </button>
      ))}
    </div>
  )
}
