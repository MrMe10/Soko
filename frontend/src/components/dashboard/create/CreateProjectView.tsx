/**
 * CreateProjectView.tsx
 * ---------------------
 * Central orchestrator component for the interactive multi-step project creation workflow.
 * Coordinates animation state transitions, drag-and-drop pointer listeners, and composes
 * the stage-specific UI subcomponents (Setup Selection, Details Form, Tech Drawer, SVG Nodes,
 * Loading Status, and Drag Previews).
 */

import React, { useState, useEffect } from 'react'
import {
  OPTIONS,
  SURROUNDING_NODES,
  INITIAL_HEXAGON_SCALE,
  ENLARGED_HEXAGON_SCALE,
  FINAL_HEXAGON_SCALE,
  CENTERING_SPEED_MS,
  LOADING_MESSAGES
} from './createProjectData'
import { SetupSelectionHeader, SetupSelectionFooter } from './SetupSelectionHeader'
import { ProjectDetailsForm } from './ProjectDetailsForm'
import { TechStackDrawer } from './TechStackDrawer'
import { SurroundingHexNodes } from './SurroundingHexNodes'
import { BuildingStatusOverlay } from './BuildingStatusOverlay'
import { TechDragPreviews } from './TechDragPreviews'

export interface CreateProjectViewProps {
  onCreateProject?: (project: { name: string; description: string; type: 'separate' | 'fullstack' }) => void
  onCancel?: () => void
}

export default function CreateProjectView({ onCreateProject }: CreateProjectViewProps) {
  const [selectedType, setSelectedType] = useState<'separate' | 'fullstack'>('separate')
  const [projectName, setProjectName] = useState('Decoupled Storehouse')
  const [projectDescription, setProjectDescription] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false) // Step 1: Fade out elements & glide to center
  const [isScaled, setIsScaled] = useState(false)       // Step 2: Scale up in center
  const [isContentFaded, setIsContentFaded] = useState(false) // Step 3: Fade out text after scale completes
  const [isSubmitted, setIsSubmitted] = useState(false)       // Step 4: Fade out form elements except project name
  const [isMovedRight, setIsMovedRight] = useState(false)     // Step 5: Glide small title hexagon to right side of screen
  const [isPushedOut, setIsPushedOut] = useState(false)       // Step 6a: Move outer small hexagons out to 6 sides
  const [isExpanded, setIsExpanded] = useState(false)         // Step 6b: Expand outer hexagons to full size
  const [isStackShrunk, setIsStackShrunk] = useState(false)   // Step 7: Shrink central hexagon after generate
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [isBuildComplete, setIsBuildComplete] = useState(false)

  useEffect(() => {
    if (!isStackShrunk) {
      setLoadingMessageIndex(0)
      setIsBuildComplete(false)
      return
    }

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => {
        if (prev >= LOADING_MESSAGES.length - 1) {
          setIsBuildComplete(true)
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 1800)

    return () => clearInterval(interval)
  }, [isStackShrunk])

  // Draggable tech pill state
  const [draggedTech, setDraggedTech] = useState<{ name: string; category: string } | null>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const [dragOriginPos, setDragOriginPos] = useState<{ x: number; y: number } | null>(null)
  const [returningTech, setReturningTech] = useState<{
    name: string
    category: string
    fromX: number
    fromY: number
    toX: number
    toY: number
  } | null>(null)
  const [isReturningAnim, setIsReturningAnim] = useState(false)
  const [assignedTechs, setAssignedTechs] = useState<Record<string, string>>({})
  const [hoveredCellId, setHoveredCellId] = useState<string | null>(null)
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0)
  const [maxStepReached, setMaxStepReached] = useState<number>(0)
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next')
  const [stepFadeStage, setStepFadeStage] = useState<'idle' | 'exiting' | 'entering'>('idle')
  const [isStackGenerated, setIsStackGenerated] = useState<boolean>(false)

  const handleStepChange = (targetStepIndex: number) => {
    if (targetStepIndex === activeStepIndex || stepFadeStage !== 'idle') return

    const direction = targetStepIndex > activeStepIndex ? 'next' : 'prev'
    setSlideDirection(direction)
    setStepFadeStage('exiting')

    setTimeout(() => {
      setActiveStepIndex(targetStepIndex)
      setMaxStepReached((prev) => Math.max(prev, targetStepIndex))
      setStepFadeStage('entering')

      setTimeout(() => {
        setStepFadeStage('idle')
      }, 40)
    }, 180)
  }

  const handleStartDrag = (e: React.PointerEvent, name: string, category: string) => {
    e.preventDefault()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setDragOriginPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    setDraggedTech({ name, category })
    setDragPos({ x: e.clientX, y: e.clientY })
  }

  useEffect(() => {
    if (!draggedTech) return

    const handlePointerMove = (e: PointerEvent) => {
      setDragPos({ x: e.clientX, y: e.clientY })

      const targetEl = document.elementFromPoint(e.clientX, e.clientY)
      const cellId = targetEl?.closest('[data-cell-id]')?.getAttribute('data-cell-id')
      setHoveredCellId(cellId || null)
    }

    const handlePointerUp = (e: PointerEvent) => {
      const targetEl = document.elementFromPoint(e.clientX, e.clientY)
      const cellId = targetEl?.closest('[data-cell-id]')?.getAttribute('data-cell-id')

      let isMatch = false
      if (cellId && draggedTech) {
        const targetNode = SURROUNDING_NODES.find((n) => n.id === cellId)
        const isFirst4Filled = Boolean(
          assignedTechs['top-left'] &&
          assignedTechs['top-right'] &&
          assignedTechs['left'] &&
          assignedTechs['right']
        )

        isMatch = Boolean(
          targetNode && (
            targetNode.category === draggedTech.category ||
            (targetNode.category === 'Extra Tech' && isFirst4Filled)
          )
        )

        if (isMatch) {
          setAssignedTechs((prev) => ({
            ...prev,
            [cellId]: draggedTech.name
          }))

          // Automatically transition to next category step after selecting a tech pill
          if (activeStepIndex < 3) {
            setTimeout(() => {
              handleStepChange(activeStepIndex + 1)
            }, 350)
          }
        }
      }

      if (!isMatch && draggedTech && dragPos) {
        const currentDragged = draggedTech
        const currentPos = dragPos
        const tileEl = document.querySelector(`[data-tech-tile="${currentDragged.name}"]`)
        let toX = dragOriginPos?.x || currentPos.x
        let toY = dragOriginPos?.y || currentPos.y
        if (tileEl) {
          const rect = tileEl.getBoundingClientRect()
          toX = rect.left + rect.width / 2
          toY = rect.top + rect.height / 2
        }

        setReturningTech({
          name: currentDragged.name,
          category: currentDragged.category,
          fromX: currentPos.x,
          fromY: currentPos.y,
          toX,
          toY
        })
        setIsReturningAnim(false)

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsReturningAnim(true)
          })
        })

        setTimeout(() => {
          setReturningTech(null)
          setIsReturningAnim(false)
        }, 360)
      }

      setDraggedTech(null)
      setDragPos(null)
      setHoveredCellId(null)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [draggedTech, assignedTechs, dragPos, dragOriginPos, activeStepIndex])

  const handleSelectType = (type: 'separate' | 'fullstack') => {
    setSelectedType(type)
    setProjectName(type === 'separate' ? 'Decoupled Storehouse' : 'Fullstack Storehouse')
  }

  const handleContinue = () => {
    // Step 1: Simultaneously fade out surrounding elements & glide selected card to center
    setIsConfirmed(true)

    // Step 2: Scale up & glow after centering completes (550ms delay)
    setTimeout(() => {
      setIsScaled(true)
    }, CENTERING_SPEED_MS - 50)

    // Step 3: Fade out text & cell contents upwards AFTER scale animation completes (1050ms total delay)
    setTimeout(() => {
      setIsContentFaded(true)
    }, CENTERING_SPEED_MS + 450)
  }

  const handleResetAnimation = () => {
    setIsStackShrunk(false)
    setIsBuildComplete(false)
    setIsExpanded(false)
    setIsPushedOut(false)
    setIsMovedRight(false)
    setIsSubmitted(false)
    setIsContentFaded(false)
    setIsScaled(false)
    setIsConfirmed(false)
    setAssignedTechs({})
    setActiveStepIndex(0)
    setMaxStepReached(0)
    setStepFadeStage('idle')
    setIsStackGenerated(false)
  }

  const handleFinishCreate = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (isSubmitted) return

    // Step 4: Fade away form elements inside the cell, leaving only the project name
    setIsSubmitted(true)

    // Step 5: Move hexagon to the right side of the screen after scaling down to small
    setTimeout(() => {
      setIsMovedRight(true)

      // Step 6a: Push out small hexagons to all 6 sides after arriving at the right side
      setTimeout(() => {
        setIsPushedOut(true)

        // Step 6b: Resize outer hexagons to full scale
        setTimeout(() => {
          setIsExpanded(true)
        }, 450)
      }, 600)
    }, 350)
  }

  const handleCompleteProject = () => {
    if (onCreateProject) {
      onCreateProject({
        name: projectName.trim() || (selectedType === 'separate' ? 'Decoupled Storehouse' : 'Fullstack Storehouse'),
        description: projectDescription.trim(),
        type: selectedType
      })
    }
  }

  return (
    <div className="relative min-h-[75vh] w-full flex flex-col items-center justify-center py-6 px-4 overflow-x-clip">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Stage 3: Tech Stack Drawer */}
      <TechStackDrawer
        isStackGenerated={isStackGenerated}
        isPushedOut={isPushedOut}
        activeStepIndex={activeStepIndex}
        maxStepReached={maxStepReached}
        stepFadeStage={stepFadeStage}
        slideDirection={slideDirection}
        assignedTechs={assignedTechs}
        draggedTech={draggedTech}
        returningTech={returningTech}
        projectName={projectName}
        projectDescription={projectDescription}
        selectedType={selectedType}
        onStepChange={handleStepChange}
        onStartDrag={handleStartDrag}
        onGenerate={() => {
          setIsStackGenerated(true)
          setTimeout(() => {
            setIsStackShrunk(true)
          }, 700)
        }}
      />

      {/* Stage 1: Setup Selection Header */}
      <SetupSelectionHeader
        isConfirmed={isConfirmed}
        selectedType={selectedType}
        onContinue={handleContinue}
      />

      {/* Hexagon Options Container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 my-4 w-full max-w-4xl">
        {OPTIONS.map(({ type, title, desc, Icon }) => {
          const isSelected = selectedType === type
          const isUnselected = !isSelected

          let transformClasses = 'translate-x-0 translate-y-0 scale-100'

          let currentScale = INITIAL_HEXAGON_SCALE
          if (isStackShrunk) {
            currentScale = 'scale-[0.06] sm:scale-[0.045]'
          } else if (isSubmitted) {
            currentScale = FINAL_HEXAGON_SCALE
          } else if (isScaled) {
            currentScale = ENLARGED_HEXAGON_SCALE
          } else {
            currentScale = INITIAL_HEXAGON_SCALE
          }

          if (isConfirmed) {
            if (isSelected) {
              if (isStackGenerated) {
                if (type === 'separate') {
                  transformClasses = `translate-y-0 md:translate-x-[172px] ${currentScale}`
                } else {
                  transformClasses = `translate-y-0 md:-translate-x-[172px] ${currentScale}`
                }
              } else if (isMovedRight) {
                if (type === 'separate') {
                  transformClasses = `translate-y-[180px] md:translate-y-0 md:translate-x-[450px] ${currentScale}`
                } else {
                  transformClasses = `translate-y-[180px] md:translate-y-0 md:translate-x-[110px] ${currentScale}`
                }
              } else if (type === 'separate') {
                transformClasses = `translate-y-[160px] md:translate-y-0 md:translate-x-[172px] ${currentScale}`
              } else {
                transformClasses = `-translate-y-[160px] md:translate-y-0 md:-translate-x-[172px] ${currentScale}`
              }
            }
          }

          const visibilityClasses = isConfirmed && isUnselected
            ? 'opacity-0 pointer-events-none'
            : 'opacity-100'

          const interactionClasses = isConfirmed
            ? isSelected ? 'z-20 cursor-default' : 'z-0 pointer-events-none'
            : 'z-10 cursor-pointer hover:-translate-y-1'

          return (
            <div
              key={type}
              onClick={() => !isConfirmed && handleSelectType(type)}
              className={`group relative flex flex-col items-center select-none shrink-0 transition-all ${
                isStackShrunk ? 'duration-500' : isStackGenerated ? 'duration-700' : isScaled ? 'duration-500' : 'duration-600'
              } ease-in-out ${visibilityClasses} ${interactionClasses} ${transformClasses}`}
            >
              <style>{`
                @keyframes spinPause {
                  0% { transform: rotate(0deg); }
                  50% { transform: rotate(360deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
              <div
                className="relative w-64 h-72 sm:w-72 sm:h-80 flex items-center justify-center shrink-0"
                style={{
                  animation: isStackShrunk ? 'spinPause 2s cubic-bezier(0.4, 0, 0.2, 1) infinite' : undefined
                }}
              >
                <svg
                  className={`absolute inset-0 w-full h-full overflow-visible transition-all duration-500 ease-in-out ${
                    isSelected
                      ? isScaled && !isSubmitted
                        ? 'drop-shadow-[0_0_40px_rgba(99,102,241,0.65)]'
                        : 'drop-shadow-[0_0_24px_rgba(99,102,241,0.45)]'
                      : 'drop-shadow-md group-hover:drop-shadow-lg'
                  }`}
                  style={{ overflow: 'visible' }}
                  viewBox="0 0 240 270"
                  fill="none"
                >
                  {/* Surrounding Outer Hex Nodes */}
                  <SurroundingHexNodes
                    isSelected={isSelected}
                    isExpanded={isExpanded}
                    isPushedOut={isPushedOut}
                    isStackShrunk={isStackShrunk}
                    assignedTechs={assignedTechs}
                    hoveredCellId={hoveredCellId}
                    draggedTech={draggedTech}
                    onUnassignTech={(nodeId) => {
                      setAssignedTechs((prev) => {
                        const next = { ...prev }
                        delete next[nodeId]
                        return next
                      })
                    }}
                  />

                  {/* Main Central Hexagon */}
                  <polygon
                    points="120,5 230,68 230,195 120,258 10,195 10,68"
                    fill="#ffffff"
                    stroke={isStackShrunk ? '#6366f1' : isSelected ? '#6366f1' : '#e2e8f0'}
                    strokeWidth={isStackShrunk ? '12' : isSelected ? (isScaled && !isSubmitted ? '5' : '4') : '2'}
                    className={`transition-all duration-300 ${
                      isStackShrunk
                        ? 'drop-shadow-[0_0_10px_rgba(99,102,241,0.7)]'
                        : 'group-hover:stroke-indigo-400'
                    }`}
                  />
                </svg>

                {/* Stage 2 & Form Content */}
                <ProjectDetailsForm
                  isSelected={isSelected}
                  isContentFaded={isContentFaded}
                  isSubmitted={isSubmitted}
                  isStackShrunk={isStackShrunk}
                  selectedType={selectedType}
                  title={title}
                  desc={desc}
                  Icon={Icon}
                  projectName={projectName}
                  setProjectName={setProjectName}
                  projectDescription={projectDescription}
                  setProjectDescription={setProjectDescription}
                  onFinishCreate={handleFinishCreate}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Stage 1 Footer Button */}
      <SetupSelectionFooter
        isConfirmed={isConfirmed}
        selectedType={selectedType}
        onContinue={handleContinue}
      />

      {/* Stage 4: Building Environment Overlay & Final Launch Button */}
      <BuildingStatusOverlay
        isStackShrunk={isStackShrunk}
        isSubmitted={isSubmitted}
        loadingMessageIndex={loadingMessageIndex}
        isBuildComplete={isBuildComplete}
        onResetAnimation={handleResetAnimation}
        onCompleteProject={handleCompleteProject}
      />

      {/* Drag previews & physics animation overlays */}
      <TechDragPreviews
        draggedTech={draggedTech}
        dragPos={dragPos}
        hoveredCellId={hoveredCellId}
        returningTech={returningTech}
        isReturningAnim={isReturningAnim}
      />
    </div>
  )
}
