import React, { useState, useLayoutEffect, useRef, useMemo, useCallback } from 'react'

// ==========================================
// ADJUST HONEYCOMB CELL SIZE HERE:
// ==========================================
const HEX_WIDTH = 105   // Width of a single hexagon
const HEX_HEIGHT = 120  // Height of a single hexagon
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
  centerX: number
  centerY: number
  points: string
}

interface TechLogo {
  src: string
  alt: string
}

const LOGO_SIZE = 40

const techLogos: TechLogo[] = [
  { src: '/React-Logo.png', alt: 'React' },
  { src: '/nextjs7685.logowik.com.png', alt: 'Next.js' },
  { src: '/nodejs-icon.png', alt: 'Node.js' },
  { src: '/external-mongodb-a-cross-platform-document-oriented-database-program-logo-color-tal-revivo.png', alt: 'MongoDB' },
  { src: '/express-js2119.logowik.com.png', alt: 'Express' },
  { src: '/t_supabase-icon9119.logowik.com.png', alt: 'Supabase' },
  { src: '/angular-icon-logo.png', alt: 'Angular' },
  { src: '/t_pinecone-database4602.logowik.com.png', alt: 'Pinecone' }
]

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
  const svgRef = useRef<SVGSVGElement>(null)
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
          const points = `${x + halfWidth},${y} ${x + fullWidth},${y + quarterHeight} ${x + fullWidth},${y + threeQuarterHeight} ${x + halfWidth},${y + fullHeight} ${x},${y + threeQuarterHeight} ${x},${y + quarterHeight}`

          arr.push({
            id: `${col}-${row}`,
            col,
            row,
            x,
            y,
            centerX: x + halfWidth,
            centerY: y + halfHeight,
            points,
          })
        }
      }
    }
    return arr
  }, [cols, rows])

  // Continuous pointer movement tracking ensures fast cursor swipes never miss cells
  const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current || hexagons.length === 0) return
    const rect = svgRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top

    let closest: Cell | null = null
    let minDistSq = (HEX_WIDTH * 0.55) ** 2

    for (let i = 0; i < hexagons.length; i++) {
      const cell = hexagons[i]
      const dx = cell.centerX - mx
      const dy = cell.centerY - my
      const distSq = dx * dx + dy * dy
      if (distSq < minDistSq) {
        minDistSq = distSq
        closest = cell
      }
    }

    if (closest) {
      setHoveredCell(prev => (prev?.col === closest!.col && prev?.row === closest!.row ? prev : { col: closest.col, row: closest.row, x: closest.x, y: closest.y }))
    } else {
      setHoveredCell(null)
    }
  }, [hexagons])

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 w-full h-full overflow-hidden select-none">
      <style>{`
        .honeycomb-hex {
          transform: scale(1);
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                      fill 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                      stroke 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          transform-box: view-box;
          z-index: 1;
        }
        .glowing-hex {
          transform: scale(1.08);
          fill: rgba(59, 130, 246, 0.12);
          stroke: #3b82f6; 
          stroke-width: 4px;
          filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
          z-index: 10;
        }
        .honeycomb-hex-logo {
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          transform-box: view-box;
        }
      `}</style>
      {dimensions.width > 0 && dimensions.height > 0 && (
        <svg
          ref={svgRef}
          className="w-full h-full block cursor-pointer"
          style={{ pointerEvents: 'auto' }}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoveredCell(null)}
        >
          <defs>
            <radialGradient id="honeycomb-mask-grad" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="white" />
              <stop offset="80%" stopColor="black" />
            </radialGradient>
            <mask id="honeycomb-mask">
              <rect width="100%" height="100%" fill="url(#honeycomb-mask-grad)" />
            </mask>
          </defs>

          {hexagons.map(({ id, col, row, x, y, points }) => {
            const isActive = hoveredCell
              ? isNeighbor(col, row, hoveredCell.col, hoveredCell.row)
              : false

            const originX = hoveredCell ? hoveredCell.x + halfWidth : x + halfWidth
            const originY = hoveredCell ? hoveredCell.y + halfHeight : y + halfHeight

            const logoIndex = Math.abs(col * 3 + row * 7) % techLogos.length
            const logo = techLogos[logoIndex]

            return (
              <React.Fragment key={id}>
                <polygon
                  points={points}
                  mask={isActive ? undefined : 'url(#honeycomb-mask)'}
                  className={`honeycomb-hex ${
                    isActive ? 'glowing-hex' : 'fill-transparent stroke-slate-300/30 stroke-[1.2px]'
                  } pointer-events-none`}
                  style={{
                    transformOrigin: `${originX}px ${originY}px`,
                  }}
                />
                {logo && (
                  <image
                    href={logo.src}
                    x={x + (HEX_WIDTH - LOGO_SIZE) / 2}
                    y={y + (HEX_HEIGHT - LOGO_SIZE) / 2}
                    width={LOGO_SIZE}
                    height={LOGO_SIZE}
                    mask={isActive ? undefined : 'url(#honeycomb-mask)'}
                    className="honeycomb-hex-logo pointer-events-none"
                    style={{
                      transformOrigin: `${originX}px ${originY}px`,
                      transform: isActive ? 'scale(1.08)' : 'scale(1)',
                      filter: isActive 
                        ? 'brightness(0) opacity(0.7) drop-shadow(0 0 3px rgba(59, 130, 246, 0.4))' 
                        : 'brightness(0) opacity(0)',
                    }}
                  />
                )}
              </React.Fragment>
            )
          })}
        </svg>
      )}
    </div>
  )
}
