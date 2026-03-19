import { useEffect, useRef, useState } from 'react';

const TOTAL_FALL_SPRITES = 7;
const GRAVITY = 0.09;
const BOUNCE_FACTOR = 0.3;
const MIN_BOUNCE_VEL = 0.5;
const SPRITE_HEIGHT = 96;
const GROUND_HEIGHT = 53;
const SPRITE_WIDTH = 40;
const FOOTER_HEIGHT = 70;
const NAVBAR_HEIGHT = 56;
const SPAWN_DELAY_MS = 600;

interface Sprite {
  id: number;
  x: number;
  y: number;
  vy: number;
  fallIndex: number;
  isGrounded: boolean;
  isDone: boolean;
  flipped: boolean;
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

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    // Preload audio so it plays instantly on spawn
    const audio = new Audio('/audio/ta_doendo_demais.mp3');
    audio.preload = 'auto';
    audio.load();
    preloadedAudioRef.current = audio;
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
        vy: 0,
        fallIndex,
        isGrounded: false,
        isDone: false,
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
        if (s.isDone) continue;
        anyActive = true;

        s.vy += GRAVITY;
        s.y += s.vy;

        if (s.y >= groundY) {
          s.y = groundY;
          s.isGrounded = true;
          s.vy = -Math.abs(s.vy) * BOUNCE_FACTOR;

          if (Math.abs(s.vy) < MIN_BOUNCE_VEL) {
            s.vy = 0;
            s.isDone = true;
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
            s.isGrounded
              ? '/images/neymar_ground.webp'
              : `/images/neymar_fall_${s.fallIndex}.webp`
          }
          alt=""
          className="absolute"
          style={{
            left: s.x,
            top: s.y,
            height: s.isGrounded ? GROUND_HEIGHT : SPRITE_HEIGHT,
            width: 'auto',
            transform: s.flipped ? 'scaleX(-1)' : undefined,
          }}
        />
      ))}
    </div>
  );
}
