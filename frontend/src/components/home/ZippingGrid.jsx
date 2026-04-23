import React, { useRef, useEffect } from 'react';

const VIBRANT_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#8b5cf6', // violet-500
  '#f59e0b', // amber-500
  '#f43f5e', // rose-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#f97316', // orange-500
];

const DARK_VIBRANT_COLORS = [
  '#60a5fa', // blue-400
  '#34d399', // emerald-400
  '#a78bfa', // violet-400
  '#fbbf24', // amber-400
  '#fb7185', // rose-400
  '#22d3ee', // cyan-400
];

const DIRECTIONS = ['right', 'left', 'up', 'down'];

export default function ZippingGrid({ 
  cellSize = 48, 
  dotCount = 15, 
  trailLength = 12,
  moveInterval = 80 
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Dot {
      constructor() {
        this.reset();
        // 1 second initial delay before they start moving in
        // Since they start at a random depth outside, they stay invisible during this time
        this.lastMoveTime = Date.now() + 1000 + Math.random() * moveInterval;
      }

      reset() {
        const isDark = document.documentElement.classList.contains('dark');
        const colors = isDark ? DARK_VIBRANT_COLORS : VIBRANT_COLORS;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        
        const cols = Math.floor(canvas.width / cellSize);
        const rows = Math.floor(canvas.height / cellSize);

        // Start from an edge based on direction, but with random depth so they don't all arrive at once
        const depth = Math.floor(Math.random() * 20); // up to 20 cells deep outside
        
        if (this.direction === 'right') { this.col = -1 - depth; this.row = Math.floor(Math.random() * rows); }
        else if (this.direction === 'left') { this.col = cols + depth; this.row = Math.floor(Math.random() * rows); }
        else if (this.direction === 'down') { this.row = -1 - depth; this.col = Math.floor(Math.random() * cols); }
        else { this.row = rows + depth; this.col = Math.floor(Math.random() * cols); }
        
        this.trail = [];
        this.lastMoveTime = Date.now();
      }

      update() {
        const now = Date.now();
        if (now - this.lastMoveTime > moveInterval) {
          this.trail.push({ col: this.col, row: this.row });
          if (this.trail.length > trailLength) this.trail.shift();

          if (this.direction === 'right') this.col++;
          else if (this.direction === 'left') this.col--;
          else if (this.direction === 'up') this.row--;
          else if (this.direction === 'down') this.row++;

          const cols = Math.floor(canvas.width / cellSize);
          const rows = Math.floor(canvas.height / cellSize);
          
          if (this.col < -2 || this.col >= cols + 2 || this.row < -2 || this.row >= rows + 2) {
            this.reset();
          }
          this.lastMoveTime = now;
        }
      }

      draw() {
        const squareSize = cellSize * 0.9;
        const offset = (cellSize - squareSize) / 2;

        // Draw trail
        this.trail.forEach((pos, i) => {
          const alpha = (i / this.trail.length) * 0.3;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.roundRect(pos.col * cellSize + offset, pos.row * cellSize + offset, squareSize, squareSize, 4);
          ctx.fill();
        });

        // Draw head
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(this.col * cellSize + offset, this.row * cellSize + offset, squareSize, squareSize, 4);
        ctx.fill();
      }
    }

    const dots = Array.from({ length: dotCount }, () => new Dot());

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = document.documentElement.classList.contains('dark');
      const cols = Math.ceil(canvas.width / cellSize);
      const rows = Math.ceil(canvas.height / cellSize);
      
      // Draw background neutral cells
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)';
      const squareSize = cellSize * 0.9;
      const offset = (cellSize - squareSize) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.beginPath();
          ctx.roundRect(c * cellSize + offset, r * cellSize + offset, squareSize, squareSize, 4);
          ctx.fill();
        }
      }

      dots.forEach(dot => {
        dot.update();
        dot.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [cellSize, dotCount, trailLength, moveInterval]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}
