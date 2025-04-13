import { useEffect, useRef, type RefObject } from 'react'

export function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T>,
  RefObject<T>,
] {
  const containerRef = useRef<T>(null)
  const endRef = useRef<T>(null)
  const lastScrollHeightRef = useRef<number>(0)

  useEffect(() => {
    const container = containerRef.current
    const end = endRef.current

    if (!container || !end) return

    const scrollToBottom = () => {
      end.scrollIntoView({ behavior: 'instant', block: 'end' })
      lastScrollHeightRef.current = container.scrollHeight
    }

    // Scroll ngay sau mount (nếu có nội dung ban đầu)
    setTimeout(() => {
      if (container.scrollHeight > 0) {
        scrollToBottom()
      }
    }, 0)

    const observer = new MutationObserver(() => {
      const newScrollHeight = container.scrollHeight

      if (newScrollHeight > lastScrollHeightRef.current) {
        setTimeout(() => {
          scrollToBottom()
        }, 0)
      }
    })

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    })

    return () => observer.disconnect()
  }, [])

  return [containerRef, endRef]
}
