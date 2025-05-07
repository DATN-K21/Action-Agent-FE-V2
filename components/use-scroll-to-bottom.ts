import { useEffect, useRef, useState, type RefObject } from 'react';

export function useScrollToBottom<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const end = endRef.current;
    if (!end || !isAtBottom) return;

    scrollToBottom();
  }, [isAtBottom]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setIsAtBottom(scrollHeight - scrollTop - clientHeight < 5);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    containerRef,
    endRef,
    scrollToBottom,
    isAtBottom,
  };
}
