
'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ParticlesProps extends React.HTMLAttributes<HTMLCanvasElement> {
  quantity?: number;
  staticity?: number;
  ease?: number;
}

export function Particles({
  className,
  quantity = 150,
  staticity = 50,
  ease = 50,
  ...props
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouse = useRef<{ x: number; y: number; max: number }>({ x: 0, y: 0, max: 65000 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext('2d');
    }

    const initCanvas = () => {
      resizeCanvas();
      draw();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const { w, h } = canvasSize.current;
        const x = clientX - rect.left - w / 2;
        const y = clientY - rect.top - h / 2;
        const inside = x < w / 2 && x > -(w / 2) && y < h / 2 && y > -(h / 2);
        if (inside) {
          mouse.current.x = x;
          mouse.current.y = y;
        }
      }
    };

    const handleResize = () => {
      resizeCanvas();
    };

    const resizeCanvas = () => {
      if (canvasContainerRef.current && canvasRef.current && context.current) {
        circles.current.length = 0;
        canvasSize.current.w = canvasContainerRef.current.offsetWidth;
        canvasSize.current.h = canvasContainerRef.current.offsetHeight;
        canvasRef.current.width = canvasSize.current.w * dpr;
        canvasRef.current.height = canvasSize.current.h * dpr;
        canvasRef.current.style.width = `${canvasSize.current.w}px`;
        canvasRef.current.style.height = `${canvasSize.current.h}px`;
        context.current.scale(dpr, dpr);
        for (let i = 0; i < quantity; i++) {
          circles.current.push(new Circle());
        }
      }
    };

    const Circle = function (this: any) {
      const self = this;
      (function (this: any) {
        self.x = Math.random() * canvasSize.current.w;
        self.y = Math.random() * canvasSize.current.h;
        self.x_ = (canvasSize.current.w / 2 - self.x) * -1;
        self.y_ = (canvasSize.current.h / 2 - self.y) * -1;
        self.color = `rgba(255, 255, 255, ${Math.random() * 0.6 + 0.1})`;
        self.radius = Math.random() * 1.5 + 0.5;
      }.call(self));

      this.draw = function () {
        const { w, h } = canvasSize.current;
        const x = self.x;
        const y = self.y;
        const r = self.radius;
        const c = self.color;

        if (context.current) {
          context.current.beginPath();
          context.current.arc(x, y, r, 0, 2 * Math.PI);
          context.current.fillStyle = c;
          context.current.fill();
          context.current.closePath();
        }
      };

      this.update = function () {
        self.x_ += (mouse.current.x - self.x) / staticity;
        self.y_ += (mouse.current.y - self.y) / staticity;
        self.x_ *= (ease / 100);
        self.y_ *= (ease / 100);

        self.x += self.x_;
        self.y += self.y_;
        
        const { w, h } = canvasSize.current;
        if (self.x > w || self.x < 0 || self.y > h || self.y < 0) {
            self.x = Math.random() * w;
            self.y = Math.random() * h;
            self.x_ = (w / 2 - self.x) * -1;
            self.y_ = (h / 2 - self.y) * -1;
        }
      };
    };

    const draw = () => {
      if (context.current) {
        context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
        circles.current.forEach(circle => circle.update());
        circles.current.forEach(circle => circle.draw());
      }
      window.requestAnimationFrame(draw);
    };

    initCanvas();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [dpr, ease, quantity, staticity]);

  return (
    <div className={cn('w-full h-full', className)} ref={canvasContainerRef} aria-hidden="true">
      <canvas ref={canvasRef} {...props} />
    </div>
  );
}
