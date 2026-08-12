/**
 * TechDragPreviews.tsx
 * --------------------
 * Interactive overlay component: Renders the active floating hexagon drag preview underneath the pointer
 * as well as the spring/return animation when a dropped tech pill returns to its origin tile.
 */

import React from 'react'
import { Layers } from 'lucide-react'
import { SURROUNDING_NODES, TECH_DETAILS } from './createProjectData'

interface TechDragPreviewsProps {
  draggedTech: { name: string; category: string } | null
  dragPos: { x: number; y: number } | null
  hoveredCellId: string | null
  returningTech: {
    name: string
    category: string
    fromX: number
    fromY: number
    toX: number
    toY: number
  } | null
  isReturningAnim: boolean
}

export const TechDragPreviews: React.FC<TechDragPreviewsProps> = ({
  draggedTech,
  dragPos,
  hoveredCellId,
  returningTech,
  isReturningAnim
}) => {
  return (
    <>
      {/* Floating Dragged Hexagon Preview */}
      {draggedTech && dragPos && (() => {
        const hoveredNode = hoveredCellId ? SURROUNDING_NODES.find((n) => n.id === hoveredCellId) : null
        const isHoveredInvalid = Boolean(hoveredNode && hoveredNode.category !== draggedTech.category)
        const details = TECH_DETAILS[draggedTech.name] || {}
        const LogoImg = details.logo
        const MockupIcon = details.mockupIcon || Layers

        return (
          <div
            className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 select-none"
            style={{ left: dragPos.x, top: dragPos.y }}
          >
            <div className="relative w-24 h-28 flex items-center justify-center">
              <svg
                viewBox="0 0 120 135"
                className={`w-full h-full overflow-visible ${
                  isHoveredInvalid
                    ? 'drop-shadow-[0_10px_25px_rgba(239,68,68,0.5)]'
                    : 'drop-shadow-[0_10px_25px_rgba(99,102,241,0.55)]'
                }`}
              >
                <polygon
                  points="60,2.5 115,34 115,96 60,127.5 5,96 5,34"
                  fill="#ffffff"
                  stroke={isHoveredInvalid ? '#ef4444' : '#6366f1'}
                  strokeWidth="4"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center pointer-events-none space-y-1">
                {LogoImg ? (
                  <img src={LogoImg} alt={draggedTech.name} className="w-8 h-8 object-contain" />
                ) : (
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isHoveredInvalid ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-600'
                    }`}
                  >
                    <MockupIcon className="w-4.5 h-4.5" />
                  </div>
                )}
                <span className="text-[10.5px] font-extrabold text-slate-900 leading-tight max-w-[80px] break-words">
                  {draggedTech.name}
                </span>
                <span
                  className={`text-[7.5px] font-extrabold uppercase tracking-wider font-mono ${
                    isHoveredInvalid ? 'text-red-500' : 'text-indigo-500'
                  }`}
                >
                  {draggedTech.category}
                </span>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Floating Returning Hexagon Preview Animation */}
      {returningTech && (() => {
        const details = TECH_DETAILS[returningTech.name] || {}
        const LogoImg = details.logo
        const MockupIcon = details.mockupIcon || Layers
        const curX = isReturningAnim ? returningTech.toX : returningTech.fromX
        const curY = isReturningAnim ? returningTech.toY : returningTech.fromY

        return (
          <div
            className="fixed pointer-events-none z-50 select-none transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              left: curX,
              top: curY,
              transform: 'translate(-50%, -50%)',
              opacity: 1
            }}
          >
            <div className="relative w-[86px] h-[96px] sm:w-[94px] sm:h-[104px] flex flex-col items-center justify-center">
              <svg viewBox="0 0 120 135" className="absolute inset-0 w-full h-full overflow-visible drop-shadow-sm">
                <polygon points="60,2.5 115,34 115,96 60,127.5 5,96 5,34" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.8" />
              </svg>
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-1.5 space-y-1">
                {LogoImg ? (
                  <img src={LogoImg} alt={returningTech.name} className="w-9 h-9 object-contain" />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center">
                    <MockupIcon className="w-5 h-5" />
                  </div>
                )}
                <span className="text-[10px] sm:text-[10.5px] font-extrabold text-slate-900 leading-tight max-w-[74px] sm:max-w-[80px] text-center line-clamp-2 break-words">
                  {returningTech.name}
                </span>
              </div>
            </div>
          </div>
        )
      })()}
    </>
  )
}

export default TechDragPreviews
