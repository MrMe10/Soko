import React, { useState, useLayoutEffect, useRef, useMemo, useCallback } from 'react'

// ============================================================================
// 🎨 HONEYCOMB FADE CONFIGURATION (Adjust fade-out effect here)
// ============================================================================
export const FADE_START_PERCENT = 75       // % from top where fade begins (e.g. 75 = 75% of screen is covered before fading)
export const FADE_END_PERCENT = 100        // % from top where pattern reaches 0% opacity (bottom of screen)
export const BOTTOM_OVERLAY_HEIGHT = 80    // Height in px of smooth bottom gradient blend (0 to disable)
export const BOTTOM_OVERLAY_OPACITY = 0.6  // Darkness of bottom blend (0.0 to 1.0)
export const TOP_OVERLAY_HEIGHT = 50       // Height in px of top edge blend (0 to disable)
export const SIDE_FADE_PERCENT = 0         // % width on left & right edges (0 = edge to edge)
// ============================================================================

// ============================================================================
// 📐 HONEYCOMB CELL SIZE CONFIGURATION
// ============================================================================
export const HEX_WIDTH = 105   // Width of a single hexagon
export const HEX_HEIGHT = 120  // Height of a single hexagon
// ============================================================================

export interface InteractiveHoneycombProps {
  /** % from top where vertical fade begins (0-100). Default: FADE_START_PERCENT (75) */
  fadeStart?: number
  /** % from top where pattern fades out completely (0-100). Default: FADE_END_PERCENT (100) */
  fadeEnd?: number
  /** Height in px of bottom gradient blend overlay (0 to disable). Default: BOTTOM_OVERLAY_HEIGHT (80) */
  bottomOverlayHeight?: number
  /** Darkness of bottom gradient blend (0.0 to 1.0). Default: BOTTOM_OVERLAY_OPACITY (0.6) */
  bottomOverlayOpacity?: number
  /** Height in px of top edge blend (0 to disable). Default: TOP_OVERLAY_HEIGHT (50) */
  topOverlayHeight?: number
  /** % width on left & right edges (0 = edge to edge). Default: SIDE_FADE_PERCENT (0) */
  sideFade?: number
}

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

// 1-ring neighbor logic (1 center + 6 immediate neighbors)
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

export const InteractiveHoneycomb: React.FC<InteractiveHoneycombProps> = ({
  fadeStart = FADE_START_PERCENT,
  fadeEnd = FADE_END_PERCENT,
  bottomOverlayHeight = BOTTOM_OVERLAY_HEIGHT,
  bottomOverlayOpacity = BOTTOM_OVERLAY_OPACITY,
  topOverlayHeight = TOP_OVERLAY_HEIGHT,
  sideFade = SIDE_FADE_PERCENT,
}) => {
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

  // Generate extra rows and columns to cover the entire screen edge-to-edge
  const cols = dimensions.width ? Math.ceil(dimensions.width / colWidth) + 3 : 0
  const rows = dimensions.height ? Math.ceil(dimensions.height / rowHeight) + 2 : 0

  const hexagons = useMemo(() => {
    const arr: Cell[] = []
    if (cols > 0 && rows > 0) {
      for (let col = -2; col < cols; col++) {
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
            points
          })
        }
      }
    }
    return arr
  }, [cols, rows])

  const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return

    const rect = svg.getBoundingClientRect()
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

  // Partition hexagons into inactive background and active glowing cluster
  // This ensures active glowing hexagons always render ON TOP of inactive ones in SVG DOM order,
  // preventing dark grid strokes from overlapping or clipping green glowing strokes.
  const { inactiveHexes, activeHexes } = useMemo(() => {
    const inactive: Array<{ cell: Cell; logo: TechLogo | undefined }> = []
    const active: Array<{ cell: Cell; logo: TechLogo | undefined }> = []

    for (let i = 0; i < hexagons.length; i++) {
      const cell = hexagons[i]
      const isActive = hoveredCell
        ? isNeighbor(cell.col, cell.row, hoveredCell.col, hoveredCell.row)
        : false
      const logoIndex = Math.abs(cell.col * 3 + cell.row * 7) % techLogos.length
      const logo = techLogos[logoIndex]

      if (isActive) {
        active.push({ cell, logo })
      } else {
        inactive.push({ cell, logo })
      }
    }

    return { inactiveHexes: inactive, activeHexes: active }
  }, [hexagons, hoveredCell])

  // Build dynamic masks based on fade configuration variables
  const safeFadeStart = Math.min(100, Math.max(0, fadeStart))
  const safeFadeEnd = Math.min(100, Math.max(safeFadeStart, fadeEnd))
  const midPoint = Math.round(safeFadeStart + (safeFadeEnd - safeFadeStart) * 0.5)
  const latePoint = Math.round(safeFadeStart + (safeFadeEnd - safeFadeStart) * 0.8)

  const verticalMask = safeFadeStart >= 100
    ? 'none'
    : `linear-gradient(to bottom, black 0%, black ${safeFadeStart}%, rgba(0,0,0,0.65) ${midPoint}%, rgba(0,0,0,0.15) ${latePoint}%, transparent ${safeFadeEnd}%)`

  const horizontalMask = sideFade > 0
    ? `linear-gradient(to right, transparent 0%, black ${sideFade}%, black ${100 - sideFade}%, transparent 100%)`
    : 'none'

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 w-full h-full overflow-hidden select-none"
      style={{
        WebkitMaskImage: verticalMask,
        maskImage: verticalMask,
      }}
    >
      <div 
        className="w-full h-full"
        style={{
          WebkitMaskImage: horizontalMask,
          maskImage: horizontalMask,
        }}
      >
        <style>{`
          .honeycomb-hex {
            transition: fill 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                        stroke 0.22s cubic-bezier(0.16, 1, 0.3, 1),
                        filter 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .glowing-hex {
            fill: rgba(16, 185, 129, 0.15);
            stroke: #10b981; 
            stroke-width: 2.8px;
            filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.65));
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
            {/* Layer 1: Inactive Background Hexagons */}
            <g id="inactive-hexagons">
              {inactiveHexes.map(({ cell }) => (
                <polygon
                  key={cell.id}
                  points={cell.points}
                  className="honeycomb-hex fill-transparent stroke-zinc-800/90 stroke-[1.2px] pointer-events-none"
                />
              ))}
            </g>

            {/* Layer 2: Active Glowing Hexagons (Rendered on top so strokes stay clean with zero overlapping lines) */}
            <g id="active-hexagons">
              {activeHexes.map(({ cell, logo }) => (
                <React.Fragment key={cell.id}>
                  <polygon
                    points={cell.points}
                    className="honeycomb-hex glowing-hex pointer-events-none"
                  />
                  {logo && (
                    <image
                      href={logo.src}
                      x={cell.x + (HEX_WIDTH - LOGO_SIZE) / 2}
                      y={cell.y + (HEX_HEIGHT - LOGO_SIZE) / 2}
                      width={LOGO_SIZE}
                      height={LOGO_SIZE}
                      className="honeycomb-hex-logo pointer-events-none"
                      style={{
                        transformOrigin: `${cell.centerX}px ${cell.centerY}px`,
                        transform: 'scale(1.08)',
                        filter: 'brightness(0) invert(1) drop-shadow(0 0 6px rgba(16, 185, 129, 0.8))',
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </g>
          </svg>
        )}
      </div>

      {/* Smooth bottom & top ambient fade overlays */}
      {bottomOverlayHeight > 0 && (
        <div 
          className="absolute inset-x-0 bottom-0 pointer-events-none" 
          style={{
            height: `${bottomOverlayHeight}px`,
            background: `linear-gradient(to top, #090d0b 0%, rgba(9, 13, 11, ${bottomOverlayOpacity}) 60%, transparent 100%)`
          }}
        />
      )}
      {topOverlayHeight > 0 && (
        <div 
          className="absolute inset-x-0 top-0 pointer-events-none" 
          style={{
            height: `${topOverlayHeight}px`,
            background: 'linear-gradient(to bottom, rgba(9, 13, 11, 0.8) 0%, transparent 100%)'
          }}
        />
      )}
    </div>
  )
}
