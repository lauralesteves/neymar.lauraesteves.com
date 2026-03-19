import { useCallback, useEffect, useRef, useState } from 'react';

const TOTAL_FALL_SPRITES = 5;
const GRAVITY = 0.09;
const BOUNCE_FACTOR = 0.3;
const MIN_BOUNCE_VEL = 0.5;
const SPRITE_HEIGHT = 96;
const GROUND_HEIGHT = 53;
const SPRITE_WIDTH = 40;
const FOOTER_HEIGHT = 130;
const NAVBAR_HEIGHT = 56;
const SPAWN_DELAY_MS = 600;
const HORIZONTAL_FRICTION = 0.98;

interface Sprite {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fallIndex: number;
  isGrounded: boolean;
  isDone: boolean;
  isDragging: boolean;
  wasThrown: boolean;
  flipped: boolean;
}

interface DragState {
  spriteId: number;
  offsetX: number;
  offsetY: number;
  positions: { x: number; y: number; t: number }[];
}

interface FallingNeymarProps {
  isMuted: boolean;
}

export function FallingNeymar({ isMuted }: FallingNeymarProps) {
  const [sprites, setSprites] = useState<Sprite[]>([]);
  const spritesRef = useRef<Sprite[]>([]);
  const isMutedRef = useRef(isMuted);
  const rafRef = useRef<number>(0);
  const nextIdRef = useRef(0);
  const waitingToSpawnRef = useRef(false);
  const spawnTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const preloadedAudioRef = useRef<HTMLAudioElement | null>(null);
  const preloadedThrowAudioRef = useRef<HTMLAudioElement | null>(null);
  const dragRef = useRef<DragState | null>(null);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    // Preload audio so it plays instantly on spawn
    const audio = new Audio('/audio/ta_doendo_demais.mp3');
    audio.preload = 'auto';
    audio.load();
    preloadedAudioRef.current = audio;

    const throwAudio = new Audio('/audio/nao-consigo.mp3');
    throwAudio.preload = 'auto';
    throwAudio.load();
    preloadedThrowAudioRef.current = throwAudio;
  }, []);

  const handlePointerDown = useCallback((spriteId: number, e: React.PointerEvent) => {
    const sprite = spritesRef.current.find(s => s.id === spriteId);
    if (!sprite || !sprite.isDone) return;

    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    sprite.isDone = false;
    sprite.isGrounded = false;
    sprite.isDragging = true;
    sprite.wasThrown = true;
    sprite.vy = 0;
    sprite.vx = 0;
    sprite.fallIndex = Math.floor(Math.random() * TOTAL_FALL_SPRITES) + 1;

    dragRef.current = {
      spriteId,
      offsetX: e.clientX - sprite.x,
      offsetY: e.clientY - sprite.y,
      positions: [{ x: e.clientX, y: e.clientY, t: performance.now() }],
    };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;

    const sprite = spritesRef.current.find(s => s.id === drag.spriteId);
    if (!sprite) return;

    sprite.x = e.clientX - drag.offsetX;
    sprite.y = e.clientY - drag.offsetY;

    const now = performance.now();
    drag.positions.push({ x: e.clientX, y: e.clientY, t: now });
    if (drag.positions.length > 5) {
      drag.positions = drag.positions.slice(-5);
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;

    const sprite = spritesRef.current.find(s => s.id === drag.spriteId);
    if (!sprite) return;

    sprite.isDragging = false;

    const { positions } = drag;
    if (positions.length >= 2) {
      const last = positions[positions.length - 1];
      const prev = positions[Math.max(0, positions.length - 3)];
      const dt = (last.t - prev.t) || 1;
      sprite.vx = ((last.x - prev.x) / dt) * 5;
      sprite.vy = ((last.y - prev.y) / dt) * 5;
    }

    if (preloadedThrowAudioRef.current) {
      const clone = preloadedThrowAudioRef.current.cloneNode() as HTMLAudioElement;
      clone.volume = 0.8;
      clone.play().catch(() => {});
    }

    dragRef.current = null;
  }, []);

  useEffect(() => {
    // Reset on StrictMode remount
    spritesRef.current = [];
    nextIdRef.current = 0;
    waitingToSpawnRef.current = false;

    const spawn = () => {
      const fallIndex = Math.floor(Math.random() * TOTAL_FALL_SPRITES) + 1;
      const margin = SPRITE_WIDTH + 20;
      const x = margin + Math.random() * (window.innerWidth - margin * 2);

      const sprite: Sprite = {
        id: nextIdRef.current++,
        x,
        y: -SPRITE_HEIGHT,
        vx: 0,
        vy: 0,
        fallIndex,
        isGrounded: false,
        isDone: false,
        isDragging: false,
        wasThrown: false,
        flipped: Math.random() > 0.5,
      };

      spritesRef.current.push(sprite);
      waitingToSpawnRef.current = false;

      if (!isMutedRef.current && preloadedAudioRef.current) {
        const clone = preloadedAudioRef.current.cloneNode() as HTMLAudioElement;
        clone.volume = 0.8;
        clone.play().catch(() => {});
      }
    };

    const animate = () => {
      const groundY =
        window.innerHeight - FOOTER_HEIGHT - SPRITE_HEIGHT - NAVBAR_HEIGHT / 2;
      let anyActive = false;

      for (const s of spritesRef.current) {
        if (s.isDone || s.isDragging) continue;
        anyActive = true;

        s.vy += GRAVITY;
        s.y += s.vy;
        s.x += s.vx;
        s.vx *= HORIZONTAL_FRICTION;

        if (s.x < 0) {
          s.x = 0;
          s.vx = Math.abs(s.vx) * BOUNCE_FACTOR;
        }
        if (s.x > window.innerWidth - SPRITE_WIDTH) {
          s.x = window.innerWidth - SPRITE_WIDTH;
          s.vx = -Math.abs(s.vx) * BOUNCE_FACTOR;
        }

        if (s.y >= groundY) {
          s.y = groundY;
          s.isGrounded = true;
          s.vy = -Math.abs(s.vy) * BOUNCE_FACTOR;

          if (Math.abs(s.vy) < MIN_BOUNCE_VEL) {
            s.vy = 0;
            s.vx = 0;
            s.isDone = true;
            s.wasThrown = false;
          }
        }

      }

      if (!anyActive && !waitingToSpawnRef.current) {
        waitingToSpawnRef.current = true;
        spawnTimeoutRef.current = setTimeout(spawn, SPAWN_DELAY_MS);
      }

      setSprites([...spritesRef.current]);
      rafRef.current = requestAnimationFrame(animate);
    };

    spawn();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
      {sprites.map((s) => (
        <img
          key={s.id}
          src={
            s.isGrounded && !s.isDragging
              ? '/images/neymar_ground.webp'
              : `/images/neymar_fall_${s.fallIndex}.webp`
          }
          alt=""
          draggable={false}
          className={`absolute ${
            s.isGrounded && !s.isDragging
              ? 'neymar-ground'
              : `neymar-fall neymar-fall-${s.fallIndex}`
          } ${s.isDone ? 'cursor-grab pointer-events-auto' : ''} ${
            s.isDragging ? 'cursor-grabbing pointer-events-auto' : ''
          }`}
          style={{
            left: s.x,
            top: s.y,
            height: s.isGrounded && !s.isDragging ? GROUND_HEIGHT : SPRITE_HEIGHT,
            width: 'auto',
            transform: s.flipped ? 'scaleX(-1)' : undefined,
            touchAction: 'none',
            filter: s.wasThrown ? 'drop-shadow(0 0 12px red) drop-shadow(0 0 24px red)' : undefined,
          }}
          onPointerDown={(e) => handlePointerDown(s.id, e)}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      ))}
    </div>
  );
}
