export interface Axial {
  q: number;
  r: number;
}

export const HEX_SIZE = 30;

export function axialToPixel(q: number, r: number): { x: number; y: number } {
  const x = HEX_SIZE * Math.sqrt(3) * (q + r / 2);
  const y = HEX_SIZE * (3 / 2) * r;
  return { x, y };
}

export function pixelToAxial(x: number, y: number): Axial {
  const q = ((Math.sqrt(3) / 3) * x - (1 / 3) * y) / HEX_SIZE;
  const r = ((2 / 3) * y) / HEX_SIZE;
  return axialRound(q, r);
}

function axialRound(q: number, r: number): Axial {
  let rq = Math.round(q);
  let rr = Math.round(r);
  let rs = Math.round(-q - r);

  const dq = Math.abs(rq - q);
  const dr = Math.abs(rr - r);
  const ds = Math.abs(rs - (-q - r));

  if (dq > dr && dq > ds) {
    rq = -rr - rs;
  } else if (dr > ds) {
    rr = -rq - rs;
  }
  return { q: rq, r: rr };
}

export function getHexDistance(a: Axial, b: Axial): number {
  return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
}

export function rotateAxialCW(q: number, r: number): Axial {
  // 60 degrees clockwise rotation
  return { q: -r, r: q + r };
}

export function rotateShape(shape: [number, number][], rotations: number): [number, number][] {
  let newShape = [...shape];
  for (let i = 0; i < rotations % 6; i++) {
    newShape = newShape.map(([q, r]) => {
      const rotated = rotateAxialCW(q, r);
      return [rotated.q, rotated.r];
    });
  }
  return newShape;
}
