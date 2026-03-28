import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Stage, Container, Graphics, Sprite, Text } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { useGameStore, PlacedItem } from '../store/gameStore';
import { axialToPixel, pixelToAxial, HEX_SIZE, Axial, rotateShape } from '../utils/hexUtils';
import { COSMIC_ITEMS, CosmicItem } from '../data/items';

const GRID_RADIUS = 5;

const GameCanvas: React.FC = () => {
  const { placedItems, moveItem, rotateItem, removeItem, draggedItem } = useGameStore();
  const [hoveredHex, setHoveredHex] = useState<Axial | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const stageWidth = 800;
  const stageHeight = 600;

  const drawGrid = useCallback((g: PIXI.Graphics) => {
    g.clear();
    for (let q = -GRID_RADIUS; q <= GRID_RADIUS; q++) {
      const r1 = Math.max(-GRID_RADIUS, -q - GRID_RADIUS);
      const r2 = Math.min(GRID_RADIUS, -q + GRID_RADIUS);
      for (let r = r1; r <= r2; r++) {
        const { x, y } = axialToPixel(q, r);
        
        // Draw hex
        g.lineStyle(2, 0x1f2937, 1);
        g.beginFill(0x111827, 0.8);
        
        const points = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 180) * (60 * i - 30);
          points.push(x + HEX_SIZE * Math.cos(angle), y + HEX_SIZE * Math.sin(angle));
        }
        g.drawPolygon(points);
        g.endFill();

        if (hoveredHex && hoveredHex.q === q && hoveredHex.r === r) {
            g.lineStyle(2, 0x3b82f6, 1);
            g.drawPolygon(points);
        }
      }
    }
  }, [hoveredHex]);

  const onMouseMove = (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left - stageWidth / 2;
      const y = e.clientY - rect.top - stageHeight / 2;
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      const pos = pixelToAxial(x, y);
      setHoveredHex(pos);
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
    // Logic for synergies between items
    placedItems.forEach((itemA) => {
        const defA = COSMIC_ITEMS.find((d) => d.id === itemA.itemId);
        if (!defA || !defA.synergy) return;

        placedItems.forEach((itemB) => {
            if (itemA.id === itemB.id) return;
            const defB = COSMIC_ITEMS.find((d) => d.id === itemB.itemId);
            if (!defB) return;

            // Check if tags match or 'Any'
            const tagMatch = defA.synergy!.targetTag === 'Any' || defB.tags.includes(defA.synergy!.targetTag);
            if (!tagMatch) return;

            // Distance check (using item center for simplicity)
            const dist = Math.abs(itemA.q - itemB.q) + Math.abs(itemA.r - itemB.r); // Rough Manhattan dist for axial?
            // Actually axial dist:
            const axialDist = (Math.abs(itemA.q - itemB.q) + Math.abs(itemA.q + itemA.r - itemB.q - itemB.r) + Math.abs(itemA.r - itemB.r)) / 2;

            if (axialDist <= defA.synergy!.range) {
                const start = axialToPixel(itemA.q, itemB.r); // wait no
                const p1 = axialToPixel(itemA.q, itemA.r);
                const p2 = axialToPixel(itemB.q, itemB.r);
                
                g.lineStyle(2, 0x00ffff, 0.6);
                g.moveTo(p1.x, p1.y);
                g.lineTo(p2.x, p2.y);
                
                // Neon glow effect (simple)
                g.lineStyle(4, 0x00ffff, 0.2);
                g.moveTo(p1.x, p1.y);
                g.lineTo(p2.x, p2.y);
            }
        });
    });
  }, [placedItems]);

  return (
    <div className="relative group overflow-hidden rounded-xl border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)] bg-black" onMouseMove={onMouseMove}>
      <Stage 
        width={stageWidth} 
        height={stageHeight} 
        options={{ backgroundColor: 0x050510, antialias: true }}
      >
        <Container x={stageWidth / 2} y={stageHeight / 2}>
          <Graphics draw={drawGrid} />
          <Graphics draw={drawSynergies} />
          
          {placedItems.map((item) => {
            const def = COSMIC_ITEMS.find((d) => d.id === item.itemId);
            if (!def) return null;

            const { x, y } = axialToPixel(item.q, item.r);
            const rotatedShape = rotateShape(def.shape, item.rotations);

            return (
              <Container key={item.id} x={x} y={y}>
                {/* Item Shape Outline */}
                <Graphics draw={(g) => {
                    g.clear();
                    g.lineStyle(1, 0x3b82f6, 0.5);
                    g.beginFill(0x3b82f6, 0.2);
                    rotatedShape.forEach(([sq, sr]) => {
                        const px = axialToPixel(sq, sr);
                        // Correct local transform? 
                        // Wait, px is relative to container (x,y)
                        // But axialToPixel uses absolute coordinates if not careful.
                        // Let's use local axialToPixel logic here.
                    });
                    
                    rotatedShape.forEach(([sq, sr]) => {
                        const localX = HEX_SIZE * Math.sqrt(3) * (sq + sr / 2);
                        const localY = HEX_SIZE * (3 / 2) * sr;
                        
                        const points = [];
                        for (let i = 0; i < 6; i++) {
                            const angle = (Math.PI / 180) * (60 * i - 30);
                            points.push(localX + HEX_SIZE * Math.cos(angle), localY + HEX_SIZE * Math.sin(angle));
                        }
                        g.drawPolygon(points);
                    });
                    g.endFill();
                }} 
                interactive={true}
                pointerdown={() => setDraggingId(item.id)}
                pointerup={() => setDraggingId(null)}
                />
                <Text 
                    text={def.name} 
                    style={new PIXI.TextStyle({ 
                        fontSize: 12, 
                        fill: 0xffffff, 
                        align: 'center',
                        dropShadow: true,
                        dropShadowColor: '#000000',
                        dropShadowBlur: 4,
                        dropShadowDistance: 2
                    })} 
                    anchor={0.5} 
                />
              </Container>
            );
          })}
        </Container>
      </Stage>

      {draggingId && (
          <div className="absolute top-4 right-4 bg-black/80 p-2 rounded border border-blue-500 text-blue-400 text-xs animate-pulse">
              [R] key to Rotate
          </div>
      )}
    </div>
  );
};

export default GameCanvas;
