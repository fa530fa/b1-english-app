import { useState, useRef, useCallback } from 'react'

/**
 * Drag-to-reorder hook using Pointer Events (touch + mouse).
 *
 * Usage:
 *   const { displayItems, dragIdx, overIdx, itemRefs, startDrag } = useDragSort(items, onReorder)
 *
 *   // For each item at index i:
 *   <div ref={(el) => { itemRefs.current[i] = el }}>
 *     <button onPointerDown={(e) => startDrag(e, i)} style={{ touchAction: 'none' }}>
 *       <GripVertical />
 *     </button>
 *   </div>
 */
export function useDragSort(items, onReorder) {
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)
  const stateRef = useRef({ dragIdx: null, overIdx: null, items: [] })
  const itemRefs = useRef([])

  const startDrag = useCallback(
    (e, index) => {
      e.preventDefault()
      stateRef.current = { dragIdx: index, overIdx: index, items }
      setDragIdx(index)
      setOverIdx(index)

      const onMove = (ev) => {
        const y = ev.clientY
        const refs = itemRefs.current
        for (let i = 0; i < refs.length; i++) {
          const el = refs[i]
          if (!el) continue
          const rect = el.getBoundingClientRect()
          if (y >= rect.top && y <= rect.bottom) {
            if (stateRef.current.overIdx !== i) {
              stateRef.current.overIdx = i
              setOverIdx(i)
            }
            break
          }
        }
      }

      const onUp = () => {
        const { dragIdx: di, overIdx: oi, items: orig } = stateRef.current
        if (di !== null && oi !== null && di !== oi) {
          const next = [...orig]
          const [moved] = next.splice(di, 1)
          next.splice(oi, 0, moved)
          onReorder(next)
        }
        stateRef.current = { dragIdx: null, overIdx: null, items: [] }
        setDragIdx(null)
        setOverIdx(null)
        document.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerup', onUp)
      }

      document.addEventListener('pointermove', onMove)
      document.addEventListener('pointerup', onUp)
    },
    [items, onReorder]
  )

  // Preview the new order while dragging
  const displayItems =
    dragIdx !== null && overIdx !== null && dragIdx !== overIdx
      ? (() => {
          const arr = [...items]
          const [moved] = arr.splice(dragIdx, 1)
          arr.splice(overIdx, 0, moved)
          return arr
        })()
      : items

  return { displayItems, dragIdx, overIdx, itemRefs, startDrag }
}
