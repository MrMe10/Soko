/**
 * SurroundingHexNodes.tsx
 * -----------------------
 * SVG satellite node component: Renders the 6 surrounding outer hexagon nodes pushed outward around
 * the central project card, handling drop target highlighting, hover feedback, and assigned tech badges.
 */

import React from 'react'
import {
  SURROUNDING_NODES,
  TECH_DETAILS,
  PRE_RESIZE_SCALE
} from './createProjectData'

interface SurroundingHexNodesProps {
  isSelected: boolean
  isExpanded: boolean
  isPushedOut: boolean
  isStackShrunk: boolean
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
  assignedTechs,
  hoveredCellId,
  draggedTech,
  onUnassignTech
}) => {
  if (!isSelected) return null

  const isFirstFourFilled = Boolean(
    assignedTechs['top-left'] &&
    assignedTechs['top-right'] &&
    assignedTechs['left'] &&
    assignedTechs['right']
  )

  const sortedNodes = [...SURROUNDING_NODES].sort((a, b) => {
    const aAssigned = Boolean(assignedTechs[a.id])
    const bAssigned = Boolean(assignedTechs[b.id])
    const aHovered = hoveredCellId === a.id
    const bHovered = hoveredCellId === b.id

    const getWeight = (id: string, assigned: boolean, hovered: boolean) => {
      if (hovered) return 3
      if (assigned) return 2
      const cat = SURROUNDING_NODES.find((n) => n.id === id)?.category
      const isComp = draggedTech
        ? cat === 'Extra Tech'
          ? isFirstFourFilled
          : cat === draggedTech.category
        : false
      if (isComp) return 1
      return 0
    }

    return getWeight(a.id, aAssigned, aHovered) - getWeight(b.id, bAssigned, bHovered)
  })

  return (
    <>
      {sortedNodes.map(({ id, label, category: nodeCategory, Icon: NodeIcon, dx, dy }) => {
        const assignedTech = assignedTechs[id]
        const isHoveredTarget = hoveredCellId === id
        const isDraggingActive = Boolean(draggedTech)

        const isCompatible = draggedTech
          ? nodeCategory === 'Extra Tech'
            ? isFirstFourFilled
            : nodeCategory === draggedTech.category
          : false

        const isHoveredValid = isHoveredTarget && isCompatible
        const isHoveredInvalid = isHoveredTarget && !isCompatible
        const isTargetGlowing = isDraggingActive && isCompatible && !isHoveredTarget

        const details = assignedTech ? TECH_DETAILS[assignedTech] : null
        const AssignedLogo = details?.logo
        const AssignedMockIcon = details?.mockupIcon || NodeIcon

        return (
          <g
            key={id}
            data-cell-id={id}
            onClick={() => {
              if (assignedTech && !draggedTech) {
                onUnassignTech(id)
              }
            }}
            className="transition-all pointer-events-auto cursor-pointer"
            style={{
              transform:
                isExpanded || isPushedOut
                  ? `translate(${dx}px, ${dy}px) scale(${isHoveredValid ? 1.1 : isHoveredInvalid ? 0.95 : isTargetGlowing ? 1.04 : 1})`
                  : `translate(0px, 0px) scale(${PRE_RESIZE_SCALE})`,
              transformOrigin: '120px 131.5px',
              opacity: isPushedOut ? (isDraggingActive && !isCompatible && !assignedTech ? 0.4 : 1) : 0,
              transitionProperty: 'transform, opacity',
              transitionDuration: isStackShrunk ? '500ms' : isExpanded ? '300ms' : '450ms',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <polygon
              points="120,5 230,68 230,195 120,258 10,195 10,68"
              fill={
                isStackShrunk
                  ? '#ffffff'
                  : assignedTech
                  ? '#ffffff'
                  : isHoveredValid
                  ? '#e0e7ff'
                  : isHoveredInvalid
                  ? '#fef2f2'
                  : isTargetGlowing
                  ? '#f5f7ff'
                  : '#f1f5f9'
              }
              stroke={
                isStackShrunk
                  ? '#6366f1'
                  : assignedTech
                  ? '#6366f1'
                  : isHoveredValid
                  ? '#6366f1'
                  : isHoveredInvalid
                  ? '#ef4444'
                  : isTargetGlowing
                  ? '#818cf8'
                  : 'none'
              }
              strokeWidth={isStackShrunk ? '10' : assignedTech ? '3.5' : isHoveredTarget ? '3' : isTargetGlowing ? '2.5' : '0'}
              strokeDasharray={
                isStackShrunk
                  ? undefined
                  : isHoveredValid && !assignedTech
                  ? '6 4'
                  : isHoveredInvalid
                  ? '4 4'
                  : isTargetGlowing
                  ? '4 3'
                  : undefined
              }
              className={
                isStackShrunk
                  ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.6)] transition-all duration-300'
                  : assignedTech
                  ? 'drop-shadow-[0_0_18px_rgba(99,102,241,0.35)]'
                  : isHoveredValid
                  ? 'drop-shadow-md'
                  : isHoveredInvalid
                  ? 'drop-shadow-sm'
                  : isTargetGlowing
                  ? 'drop-shadow-[0_0_14px_rgba(99,102,241,0.45)]'
                  : 'drop-shadow-sm'
              }
            />
            <foreignObject x="30" y="55" width="180" height="160">
              <div
                className={`w-full h-full flex flex-col items-center justify-center text-center p-2 space-y-1 select-none transition-opacity duration-300 ${
                  isStackShrunk ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    assignedTech
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : isHoveredValid
                      ? 'bg-indigo-100 text-indigo-600'
                      : isHoveredInvalid
                      ? 'bg-red-100 text-red-500'
                      : isTargetGlowing
                      ? 'bg-indigo-100/90 text-indigo-600 shadow-xs'
                      : 'bg-slate-200/70 text-slate-400'
                  }`}
                >
                  {assignedTech && AssignedLogo ? (
                    <img src={AssignedLogo} alt={assignedTech} className="w-5 h-5 object-contain" />
                  ) : (
                    <AssignedMockIcon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`text-[11px] tracking-tight ${
                    assignedTech
                      ? 'font-extrabold text-slate-900'
                      : isHoveredInvalid
                      ? 'font-bold text-red-500'
                      : isTargetGlowing
                      ? 'font-extrabold text-indigo-600'
                      : 'font-semibold text-slate-400'
                  }`}
                >
                  {assignedTech ||
                    (isHoveredInvalid
                      ? nodeCategory === 'Extra Tech' && !isFirstFourFilled
                        ? 'Fill 4 Primary Layers'
                        : 'Mismatched Layer'
                      : label)}
                </span>
                {assignedTech ? (
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100 uppercase font-mono">
                    {label}
                  </span>
                ) : isTargetGlowing ? (
                  <span className="text-[8.5px] font-extrabold text-indigo-500 tracking-wider uppercase font-mono animate-pulse">
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
