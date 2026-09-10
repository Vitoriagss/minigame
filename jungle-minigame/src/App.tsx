import { useEffect, useRef, useState } from 'react';

interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const keys: { [key: string]: boolean } = {};

    const player: Entity = { x: 180, y: 340, width: 30, height: 30, speed: 5 };
    const items: (Entity & { color: string })[] = [];

    const handleKeyDown = (e: KeyboardEvent) => { keys[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys[e.key] = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let frameCount = 0;

    const gameLoop = () => {
      frameCount++;

      if ((keys['ArrowLeft'] || keys['a']) && player.x > 0) player.x -= player.speed;
      if ((keys['ArrowRight'] || keys['d']) && player.x < canvas.width - player.width) player.x += player.speed;

      if (frameCount % 60 === 0) {
        items.push({
          x: Math.random() * (canvas.width - 20),
          y: 0,
          width: 20,
          height: 20,
          speed: 3 + Math.random() * 2,
          color: '#38ef7d'
        });
      }

      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(player.x, player.y, player.width, player.height);

      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += item.speed;

        if (
          player.x < item.x + item.width &&
          player.x + player.width > item.x &&
          player.y < item.y + item.height &&
          player.y + player.height > item.y
        ) {
          items.splice(i, 1);
          setScore((prev) => prev + 10);
          continue;
        }

        if (item.y > canvas.height) {
          items.splice(i, 1);
        } else {
          ctx.fillStyle = item.color;
          ctx.beginPath();
          ctx.arc(item.x + 10, item.y + 10, 10, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', background: '#030712', minHeight: '100vh', color: '#fff', padding: '2rem' }}>
      <h1>Canvas Game Prototype</h1>
      <p style={{ color: '#9ca3af' }}>Use as setas ⬅️ ➡️ ou A/D para mover</p>
      <div style={{ margin: '10px 0', fontSize: '1.25rem', fontWeight: 'bold' }}>Pontuação: {score}</div>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: '2px solid #374151', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
      />
    </div>
  );
}