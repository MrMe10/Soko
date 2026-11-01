/**
 * SurroundingHexNodes.tsx
 * -----------------------
 * SVG satellite node component: Renders the 6 surrounding outer hexagon nodes pushed outward around
 * the central project card, handling drop target highlighting, hover feedback, and assigned tech badges.
 */

import React, { useState } from 'react'
import {
  getSurroundingNodes,
  getTechDetails,
  PRE_RESIZE_SCALE,
  HEX_POINTS,
  HEX_ORIGIN,
  HEX_PUSH_FACTOR
} from './createProjectData'
import type { ArchitectureType } from './createProjectData'

interface SurroundingHexNodesProps {
  isSelected: boolean
  isExpanded: boolean
  isPushedOut: boolean
  isStackShrunk: boolean
  selectedType: ArchitectureType
  assignedTechs: Record<string, string>
  hoveredCellId: string | null
  draggedTech: { name: string; category: string } | null
  onUnassignTech: (nodeId: string) => void
}

export const SurroundingHexNodes: React.FC<SurroundingHexNodesProps> = ({
  isSelected,
  isExpanded,
  isPushedOut,
  isStackShrunk,
  selectedType,
  assignedTechs,
  hoveredCellId,
  draggedTech,
  onUnassignTech
}) => {
  const [mouseHoveredId, setMouseHoveredId] = useState<string | null>(null)

  if (!isSelected) return null

  const nodesList = getSurroundingNodes(selectedType)

  const sortedNodes = [...nodesList].sort((a, b) => {
    const aAssigned = Boolean(assignedTechs[a.id])
    const bAssigned = Boolean(assignedTechs[b.id])
    const aHovered = hoveredCellId === a.id || mouseHoveredId === a.id
    const bHovered = hoveredCellId === b.id || mouseHoveredId === b.id

    const getWeight = (id: string, assigned: boolean, hovered: boolean) => {
      if (hovered) return 4
      if (assigned) return 2
      const cat = nodesList.find((n) => n.id === id)?.category
      const isComp = draggedTech ? cat === draggedTech.category : false
      if (isComp) return 1
      return 0
    }

    return getWeight(a.id, aAssigned, aHovered) - getWeight(b.id, bAssigned, bHovered)
  })

  return (
    <>
      {sortedNodes.map(({ id, label, category: nodeCategory, Icon: NodeIcon, dx, dy }) => {
        const assignedTech = assignedTechs[id]
        const isFullstackPairHover =
          selectedType === 'fullstack' &&
          draggedTech?.category === 'Fullstack Framework' &&
          (id === 'top-left' || id === 'top-right') &&
          (hoveredCellId === 'top-left' || hoveredCellId === 'top-right')

        const isHoveredTarget = hoveredCellId === id || isFullstackPairHover
        const isDraggingActive = Boolean(draggedTech)

        const isCompatible = draggedTech ? nodeCategory === draggedTech.category : false

        const isHoveredValid = isHoveredTarget && isCompatible
        const isHoveredInvalid = isHoveredTarget && !isCompatible
        const isTargetGlowing = isDraggingActive && isCompatible && !isHoveredTarget

        const isMouseHovered =
          !isDraggingActive &&
          (mouseHoveredId === id ||
            (selectedType === 'fullstack' &&
              (id === 'top-left' || id === 'top-right') &&
              (mouseHoveredId === 'top-left' || mouseHoveredId === 'top-right') &&
              Boolean(assignedTechs['top-left'] || assignedTechs['top-right'])))

        // Calculate enlargement scale
        const scale = isStackShrunk
          ? 1
          : isHoveredValid
          ? 1.12
          : isHoveredInvalid
          ? 0.95
          : isTargetGlowing
          ? 1.04
          : isMouseHovered && assignedTech
          ? 1.08
          : isMouseHovered
          ? 1.04
          : 1

        // Radial outward translation to prevent overlapping/underlapping adjacent or central cells
        const scaleDiff = Math.max(0, scale - 1)
        const currentDx = dx + dx * scaleDiff * HEX_PUSH_FACTOR
        const currentDy = dy + dy * scaleDiff * HEX_PUSH_FACTOR

        const details = getTechDetails(assignedTech)
        const AssignedLogo = details.logo
        const AssignedMockIcon = details.mockupIcon || NodeIcon

        return (
          <g
            key={id}
            data-cell-id={id}
            onMouseEnter={() => !draggedTech && setMouseHoveredId(id)}
            onMouseLeave={() => !draggedTech && setMouseHoveredId(null)}
            onClick={() => {
              if (assignedTech && !draggedTech) {
                onUnassignTech(id)
              }
            }}
            className="transition-all pointer-events-auto cursor-pointer"
            style={{
              transform:
                isExpanded || isPushedOut
                  ? `translate(${currentDx}px, ${currentDy}px) scale(${scale})`
                  : `translate(0px, 0px) scale(${PRE_RESIZE_SCALE})`,
              transformOrigin: HEX_ORIGIN,
              opacity: isPushedOut ? (isDraggingActive && !isCompatible && !assignedTech ? 0.4 : 1) : 0,
              filter:
                isHoveredValid || (isMouseHovered && assignedTech)
                  ? 'drop-shadow(0 10px 22px rgba(16, 185, 129, 0.4))'
                  : isTargetGlowing
                  ? 'drop-shadow(0 4px 12px rgba(16, 185, 129, 0.25))'
                  : undefined,
              transitionProperty: 'transform, opacity, filter',
              transitionDuration: isStackShrunk ? '500ms' : isExpanded ? '300ms' : '450ms',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <polygon
              points={HEX_POINTS}
              fill={
                isStackShrunk
                  ? '#090d0b'
                  : assignedTech
                  ? '#121214'
                  : isHoveredValid
                  ? '#064e3b'
                  : isHoveredInvalid
                  ? '#450a0a'
                  : isTargetGlowing
                  ? '#062e22'
                  : isMouseHovered
                  ? '#18181b'
                  : '#0f1311'
              }
              stroke={
                isStackShrunk
                  ? '#10b981'
                  : assignedTech
                  ? '#10b981'
                  : isHoveredValid
                  ? '#10b981'
                  : isHoveredInvalid
                  ? '#ef4444'
                  : isTargetGlowing
                  ? '#34d399'
                  : isMouseHovered
                  ? '#52525b'
                  : '#27272a'
              }
              strokeWidth={
                isStackShrunk
                  ? '10'
                  : assignedTech
                  ? '3.5'
                  : isHoveredTarget
                  ? '3'
                  : isTargetGlowing
                  ? '2.5'
                  : isMouseHovered
                  ? '2.2'
                  : '1.8'
              }
              strokeDasharray={
                isStackShrunk
                  ? undefined
                  : assignedTech
                  ? undefined
                  : isHoveredValid
                  ? '6 4'
                  : isHoveredInvalid
                  ? '4 4'
                  : isTargetGlowing
                  ? '4 3'
                  : '5 4'
              }
              className={isStackShrunk ? 'transition-all duration-300' : 'transition-colors'}
            />
            <foreignObject x="30" y="55" width="180" height="160">
              <div
                className={`w-full h-full flex flex-col items-center justify-center text-center p-2 space-y-1 select-none transition-opacity duration-300 ${
                  isStackShrunk ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    assignedTech
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                      : isHoveredValid
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : isHoveredInvalid
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : isTargetGlowing
                      ? 'bg-emerald-500/15 text-emerald-400 shadow-xs border border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {assignedTech && AssignedLogo ? (
                    <img src={AssignedLogo} alt={assignedTech} className="w-6 h-6 object-contain" />
                  ) : (
                    <AssignedMockIcon className="w-5.5 h-5.5" />
                  )}
                </div>
                <span
                  className={`text-[11px] tracking-tight ${
                    assignedTech
                      ? 'font-extrabold text-white'
                      : isHoveredInvalid
                      ? 'font-bold text-red-400'
                      : isTargetGlowing
                      ? 'font-extrabold text-emerald-400'
                      : isMouseHovered
                      ? 'font-bold text-zinc-200'
                      : 'font-semibold text-zinc-500'
                  }`}
                >
                  {assignedTech || (isHoveredInvalid ? 'Mismatched Layer' : label)}
                </span>
                {assignedTech ? (
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/80 uppercase font-mono">
                    {label}
                  </span>
                ) : isTargetGlowing ? (
                  <span className="text-[8.5px] font-extrabold text-emerald-400 tracking-wider uppercase font-mono animate-pulse">
                    Drop Here
                  </span>
                ) : null}
              </div>
            </foreignObject>
          </g>
        )
      })}
    </>
  )
}

export default SurroundingHexNodes
