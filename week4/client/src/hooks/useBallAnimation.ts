import { useState, useEffect, type RefObject } from 'react';

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export const useBallAnimation = (containerRef: RefObject<HTMLDivElement | null>) => {
  const [balls, setBalls] = useState<Ball[]>([]);

  useEffect(() => {
    const initialBalls: Ball[] = [
      { id: 1, x: 100, y: 100, vx: 3, vy: 2, size: 80, color: 'bg-cyan-400' },
      { id: 2, x: 300, y: 200, vx: -2, vy: 4, size: 120, color: 'bg-pink-400' },
      { id: 3, x: 500, y: 400, vx: 2, vy: -3, size: 60, color: 'bg-yellow-300' },
      { id: 4, x: 200, y: 500, vx: -3, vy: -2, size: 100, color: 'bg-lime-400' },
      { id: 5, x: 600, y: 150, vx: 4, vy: 1, size: 90, color: 'bg-violet-400' },
    ];
    setBalls(initialBalls);

    
    const animate = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();

      setBalls((prevBalls) =>
        prevBalls.map((ball) => {
          let { x, y, vx, vy, size } = ball;
          const radius = size / 2;

          if (x - radius + vx < 0 || x + radius + vx > width) vx *= -1;
          if (y - radius + vy < 0 || y + radius + vy > height) vy *= -1;

          return { ...ball, x: x + vx, y: y + vy, vx, vy };
        })
      );
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [containerRef]);

  return balls; 
};