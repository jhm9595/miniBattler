import React, { useState, useEffect, useCallback } from 'react';
import { Application, extend } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { useGameStore } from '../store/gameStore';
import { axialToPixel, pixelToAxial, HEX_SIZE, Axial, rotateShape } from '../utils/hexUtils';
import { COSMIC_ITEMS } from '../data/items';

// Extend PixiJS components for @pixi/react v8
extend({ Container, Graphics, Text });

const GRID_RADIUS = 5;

const GameCanvas: React.FC = () => {
  const { placedItems, moveItem, rotateItem } = useGameStore();
  const [hoveredHex, setHoveredHex] = useState<Axial | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const stageWidth = 800;
  const stageHeight = 600;

  const drawGrid = useCallback((g: PIXI.Graphics) => {
    g.clear();
    for (let q = -GRID_RADIUS; q <= GRID_RADIUS; q++) {
      const r1 = Math.max(-GRID_RADIUS, -q - GRID_RADIUS);
      const r2 = Math.min(GRID_RADIUS, -q + GRID_RADIUS);
      for (let r = r1; r <= r2; r++) {
        const { x, y } = axialToPixel(q, r);
        
        // Use v8 API
        g.setStrokeStyle({ width: 2, color: 0x1f2937 });
        g.beginPath();
        g.fill({ color: 0x111827, alpha: 0.8 });
        
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 180) * (60 * i - 30);
          const px = x + HEX_SIZE * Math.cos(angle);
          const py = y + HEX_SIZE * Math.sin(angle);
          if (i === 0) g.moveTo(px, py);
          else g.lineTo(px, py);
        }
        g.closePath();
        g.stroke();
        g.fill();

        if (hoveredHex && hoveredHex.q === q && hoveredHex.r === r) {
            g.setStrokeStyle({ width: 2, color: 0x3b82f6 });
            g.stroke();
        }
      }
    }
  }, [hoveredHex]);

  const onMouseMoveStage = (e: PIXI.FederatedPointerEvent) => {
    const x = e.global.x - stageWidth / 2;
    const y = e.global.y - stageHeight / 2;
    const pos = pixelToAxial(x, y);
    setHoveredHex(pos);

    if (draggingId) {
      moveItem(draggingId, pos.q, pos.r);
    }
  };

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'r' && draggingId) {
        rotateItem(draggingId);
    }
  }, [draggingId, rotateItem]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  const drawSynergies = useCallback((g: PIXI.Graphics) => {
    g.clear();
    placedItems.forEach((itemA) => {
        const defA = COSMIC_ITEMS.find((d) => d.id === itemA.itemId);
        if (!defA || !defA.synergy) return;

        placedItems.forEach((itemB) => {
            if (itemA.id === itemB.id) return;
            const defB = COSMIC_ITEMS.find((d) => d.id === itemB.itemId);
            if (!defB) return;

            const tagMatch = defA.synergy!.targetTag === 'Any' || defB.tags.includes(defA.synergy!.targetTag);
            if (!tagMatch) return;

            const axialDist = (Math.abs(itemA.q - itemB.q) + Math.abs(itemA.q + itemA.r - itemB.q - itemB.r) + Math.abs(itemA.r - itemB.r)) / 2;

            if (axialDist <= defA.synergy!.range) {
                const p1 = axialToPixel(itemA.q, itemA.r);
                const p2 = axialToPixel(itemB.q, itemB.r);
                
                g.setStrokeStyle({ width: 2, color: 0x00ffff, alpha: 0.6 });
                g.moveTo(p1.x, p1.y);
                g.lineTo(p2.x, p2.y);
                g.stroke();
                
                g.setStrokeStyle({ width: 4, color: 0x00ffff, alpha: 0.2 });
                g.moveTo(p1.x, p1.y);
                g.lineTo(p2.x, p2.y);
                g.stroke();
            }
        });
    });
  }, [placedItems]);

  return (
    <div className="relative group overflow-hidden rounded-xl border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)] bg-black">
      {/* @ts-ignore */}
      <Application 
        width={stageWidth} 
        height={stageHeight} 
        background="#050510"
        antialias={true}
      >
        {/* @ts-ignore */}
        <pixiContainer x={stageWidth / 2} y={stageHeight / 2} interactive={true} pointermove={onMouseMoveStage}>
          {/* @ts-ignore */}
          <pixiGraphics draw={drawGrid} />
          {/* @ts-ignore */}
          <pixiGraphics draw={drawSynergies} />
          
          {placedItems.map((item) => {
            const def = COSMIC_ITEMS.find((d) => d.id === item.itemId);
            if (!def) return null;

            const { x, y } = axialToPixel(item.q, item.r);
            const rotatedShape = rotateShape(def.shape, item.rotations);

            return (
              /* @ts-ignore */
              <pixiContainer key={item.id} x={x} y={y}>
                {/* @ts-ignore */}
                <pixiGraphics 
                  draw={(g: PIXI.Graphics) => {
                      g.clear();
                      g.setStrokeStyle({ width: 1, color: 0x3b82f6, alpha: 0.5 });
                      g.fill({ color: 0x3b82f6, alpha: 0.2 });
                      
                      rotatedShape.forEach(([sq, sr]) => {
                          const localX = HEX_SIZE * Math.sqrt(3) * (sq + sr / 2);
                          const localY = HEX_SIZE * (3 / 2) * sr;
                          
                          for (let i = 0; i < 6; i++) {
                              const angle = (Math.PI / 180) * (60 * i - 30);
                              const px = localX + HEX_SIZE * Math.cos(angle);
                              const py = localY + HEX_SIZE * Math.sin(angle);
                              if (i === 0) g.moveTo(px, py);
                              else g.lineTo(px, py);
                          }
                          g.closePath();
                      });
                      g.stroke();
                      g.fill();
                  }} 
                  interactive={true}
                  pointerdown={() => setDraggingId(item.id)}
                  pointerup={() => setDraggingId(null)}
                  pointerupoutside={() => setDraggingId(null)}
                />
                {/* @ts-ignore */}
                <pixiText 
                    text={def.name} 
                    anchor={0.5}
                    style={new TextStyle({ 
                        fontSize: 10, 
                        fill: 0xffffff, 
                        align: 'center',
                        dropShadow: {
                            color: '#000000',
                            blur: 4,
                            distance: 2
                        }
                    })} 
                />
              </pixiContainer>
            );
          })}
        </pixiContainer>
      </Application>

      {draggingId && (
          <div className="absolute top-4 right-4 bg-black/80 p-2 rounded border border-blue-500 text-blue-400 text-xs animate-pulse">
              [R] key to Rotate
          </div>
      )}
    </div>
  );
};

export default GameCanvas;
