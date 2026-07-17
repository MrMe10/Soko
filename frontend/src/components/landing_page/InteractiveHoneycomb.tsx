import React, { useState, useLayoutEffect, useRef, useMemo } from 'react'

// ==========================================
// ADJUST HONEYCOMB CELL SIZE HERE:
// ==========================================
const HEX_WIDTH = 70   // Width of a single hexagon (originally 56)
const HEX_HEIGHT = 80  // Height of a single hexagon (originally 64)
// ==========================================

// Derived layout constants
const colWidth = HEX_WIDTH / 2
const rowHeight = HEX_HEIGHT * 1.5
const oddRowOffset = HEX_HEIGHT * 0.75

const halfWidth = HEX_WIDTH / 2
const fullWidth = HEX_WIDTH
const quarterHeight = HEX_HEIGHT / 4
const threeQuarterHeight = HEX_HEIGHT * 0.75
const fullHeight = HEX_HEIGHT
const halfHeight = HEX_HEIGHT / 2

interface Cell {
  id: string
  col: number
  row: number
  x: number
  y: number
}

const isNeighbor = (col: number, row: number, hoveredCol: number, hoveredRow: number) => {
  if (col === hoveredCol && row === hoveredRow) return true
  
  const colDiff = col - hoveredCol
  const rowDiff = row - hoveredRow
  
  // Directly left/right
  if (rowDiff === 0 && Math.abs(colDiff) === 2) return true
  
  // Diagonals
  const isEven = Math.abs(hoveredCol) % 2 === 0
  if (Math.abs(colDiff) === 1) {
    if (isEven) {
      return rowDiff === -1 || rowDiff === 0
    } else {
      return rowDiff === 0 || rowDiff === 1
    }
  }
  
  return false
}

export const InteractiveHoneycomb: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [hoveredCell, setHoveredCell] = useState<{ col: number; row: number; x: number; y: number } | null>(null)

  useLayoutEffect(() => {
    if (!containerRef.current) return

    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }

    updateSize()
    const resizeObserver = new ResizeObserver(() => updateSize())
    resizeObserver.observe(containerRef.current)

    return () => resizeObserver.disconnect()
  }, [])

  const cols = dimensions.width ? Math.ceil(dimensions.width / colWidth) + 2 : 0
  const rows = dimensions.height ? Math.ceil(dimensions.height / rowHeight) + 1 : 0

  const hexagons = useMemo(() => {
    const arr: Cell[] = []
    if (cols > 0 && rows > 0) {
      for (let col = -1; col < cols; col++) {
        for (let row = -1; row < rows; row++) {
          const x = col * colWidth
          const y = row * rowHeight + (Math.abs(col) % 2 === 1 ? oddRowOffset : 0)
          arr.push({
            id: `${col}-${row}`,
            col,
            row,
            x,
            y,
          })
        }
      }
    }
    return arr
  }, [cols, rows])


  return (
    <div ref={containerRef} className="absolute inset-0 z-0 w-full h-full overflow-hidden select-none">
      <style>{`
        .honeycomb-hex {
          transform: scale(1);
          transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1),
                      fill 1s cubic-bezier(0.16, 1, 0.3, 1),
                      stroke 1s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 1s cubic-bezier(0.16, 1, 0.3, 1);
          transform-box: view-box;
          z-index: 1;
        }
        .glowing-hex {
          transform: scale(1.08);
          fill: rgba(59, 130, 246, 0.12);
          stroke: #3b82f6;
          stroke-width: 2.2px;
          filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
          z-index: 10;
        }
      `}</style>
      {dimensions.width > 0 && dimensions.height > 0 && (
        <svg
          className="w-full h-full block"
          style={{ pointerEvents: 'auto' }}
          onMouseLeave={() => setHoveredCell(null)}
        >
          <defs>
            <radialGradient id="honeycomb-mask-grad" cx="50%" cy="50%" r="50%">
              <stop offset="35%" stopColor="white" />
              <stop offset="80%" stopColor="black" />
            </radialGradient>
            <mask id="honeycomb-mask">
              <rect width="100%" height="100%" fill="url(#honeycomb-mask-grad)" />
            </mask>
          </defs>
          {/* Draw hexagons (visual only, pointer-events disabled to let catcher handle interaction) */}
          {hexagons.map(({ id, col, row, x, y }) => {
            const isActive = hoveredCell
              ? isNeighbor(col, row, hoveredCell.col, hoveredCell.row)
              : false

            const points = `
              ${x + halfWidth},${y}
              ${x + fullWidth},${y + quarterHeight}
              ${x + fullWidth},${y + threeQuarterHeight}
              ${x + halfWidth},${y + fullHeight}
              ${x},${y + threeQuarterHeight}
              ${x},${y + quarterHeight}
            `.trim().replace(/\s+/g, ' ')

            // Use the hovered cell's center as the scaling origin for all active cells
            const originX = hoveredCell ? hoveredCell.x + halfWidth : x + halfWidth
            const originY = hoveredCell ? hoveredCell.y + halfHeight : y + halfHeight

            return (
              <polygon
                key={id}
                points={points}
                mask={isActive ? undefined : 'url(#honeycomb-mask)'}
                className={`honeycomb-hex ${
                  isActive ? 'glowing-hex' : 'fill-transparent stroke-slate-300/30 stroke-[1.2px]'
                } pointer-events-none`}
                style={{
                  transformOrigin: `${originX}px ${originY}px`,
                }}
              />
            )
          })}
          {/* Invisible interactive hover catchers (not masked, covers all cells to trigger hover glow) */}
          {hexagons.map(({ id, col, row, x, y }) => {
            const points = `
              ${x + halfWidth},${y}
              ${x + fullWidth},${y + quarterHeight}
              ${x + fullWidth},${y + threeQuarterHeight}
              ${x + halfWidth},${y + fullHeight}
              ${x},${y + threeQuarterHeight}
              ${x},${y + quarterHeight}
            `.trim().replace(/\s+/g, ' ')

            return (
              <polygon
                key={`catcher-${id}`}
                points={points}
                fill="transparent"
                stroke="transparent"
                className="cursor-pointer"
                style={{
                  pointerEvents: 'auto',
                }}
                onMouseEnter={() => setHoveredCell({ col, row, x, y })}
              />
            )
          })}
        </svg>
      )}
    </div>
  )
}
