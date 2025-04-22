import { useEffect, useRef, useState, type RefObject } from 'react';

export function useScrollToBottom<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (!container) return;

  //   const handleScroll = () => {
  //     const distanceToBottom =
  //       container.scrollHeight - container.scrollTop - container.clientHeight;

  //     setIsAtBottom(distanceToBottom < 50);
  //   };

  //   container.addEventListener('scroll', handleScroll);
  //   return () => container.removeEventListener('scroll', handleScroll);
  // }, []);

  useEffect(() => {
    const end = endRef.current;
    if (!end || !isAtBottom) return;

    end.scrollIntoView({ behavior: 'smooth' });
  }, [isAtBottom]);

  return {
    containerRef,
    endRef,
    scrollToBottom,
    isAtBottom,
  };
}
