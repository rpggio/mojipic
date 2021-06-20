import { Drawing, DrawingSettings, Glyph, ToolType } from '../../lib/emoji-drawing'
import { GridBounds, GridPosition, Size } from '../../lib/2d'
import { Store, useStore } from '../../lib/reactives'
import { Stack } from '../../lib/immutable-objects'
import log from 'loglevel'
import { useEffect } from 'react'
import { analytics } from './firebase'
import { drawingAtom } from './drawingAtom'
import { useRecoilState } from 'recoil'
import { toolboxAtom } from './toolboxAtom'

export const drawingSettings: DrawingSettings = {
  minSize: new Size(3, 3),
  maxSize: new Size(16, 12),
}
const undoStackLimit = 20

export const historyStore = Store(new Stack<Drawing>([], undoStackLimit))
export const useHistory = () => useStore(historyStore)

export function useEditor() {
  const [drawing, setDrawing] = useRecoilState(drawingAtom)
  const [toolbox, setToolbox] = useRecoilState(toolboxAtom)
  const [history, setHistory] = useHistory()

  useEffect(() => {
    log.debug(drawing.toString())
  }, [drawing])

  function setDrawingUndoable(newDrawing: Drawing) {
    setHistory((it) => it.pushed(drawing))
    setDrawing(newDrawing)
  }

  const commands = {
    activateTool(tool: ToolType) {
      if (tool !== toolbox.activeToolType) {
        setToolbox((it) => it.withActiveTool(tool))
      }
    },

    pickBrush(brush: Glyph) {
      setToolbox((it) => it.withActiveTool('paintbrush').withBrush(brush))
      analytics.logEvent('select_content', {
        content_type: 'emoji',
        item_id: brush || '',
      })
    },

    applyTool(position: GridPosition) {
      setDrawingUndoable(toolbox.activeTool.apply(drawing, position, drawingSettings))
    },

    loadDrawing(drawing: Drawing) {
      setDrawing(drawing)
      setToolbox(toolbox.withRecent(drawing.uniqueGlyphs()))
    },

    undo() {
      const [newHistory, popped] = history.popped()
      if (popped) {
        setDrawing(popped)
        setHistory(newHistory)
      }
    },

    clear() {
      setDrawingUndoable(Drawing.createEmpty(GridBounds.fromSize(drawingSettings.minSize)))
      analytics.logEvent('select_content', {
        content_type: 'drawing',
        item_id: 'NEW',
      })
    },
  }

  return {
    drawing,
    toolbox,
    ...commands,
  }
}
