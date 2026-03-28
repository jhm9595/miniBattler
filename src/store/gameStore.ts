import { create } from 'zustand';
import { COSMIC_ITEMS, CosmicItem, FUSION_RECIPES } from '../data/items';
import { Axial, rotateShape } from '../utils/hexUtils';

export interface PlacedItem {
  id: string; // Unique instance ID
  itemId: string; // Reference to COSMIC_ITEMS
  q: number;
  r: number;
  rotations: number;
}

interface GameState {
  placedItems: PlacedItem[];
  shopItems: CosmicItem[];
  gold: number;
  health: number;
  inventory: CosmicItem[]; // Items in reserve/not on grid
  draggedItem: PlacedItem | null;
  
  // Actions
  buyItem: (item: CosmicItem) => void;
  placeItem: (item: PlacedItem) => void;
  moveItem: (id: string, q: number, r: number) => void;
  rotateItem: (id: string) => void;
  removeItem: (id: string) => void;
  rerollShop: () => void;
  checkFusion: (item1Id: string, item2Id: string) => string | null;
  checkMerge: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  placedItems: [],
  shopItems: [],
  gold: 100,
  health: 100,
  inventory: [],
  draggedItem: null,

  buyItem: (item) => {
    if (get().gold >= 5) {
      set((state) => ({
        gold: state.gold - 5,
        inventory: [...state.inventory, item],
        shopItems: state.shopItems.filter((i) => i.id !== item.id),
      }));
    }
  },

  placeItem: (item) => {
    set((state) => ({
      placedItems: [...state.placedItems, item],
      inventory: state.inventory.filter((i) => i.id !== item.itemId),
    }));
    get().checkMerge();
  },

  moveItem: (id, q, r) => {
    set((state) => ({
      placedItems: state.placedItems.map((item) =>
        item.id === id ? { ...item, q, r } : item
      ),
    }));
  },

  rotateItem: (id) => {
    set((state) => ({
      placedItems: state.placedItems.map((item) =>
        item.id === id ? { ...item, rotations: (item.rotations + 1) % 6 } : item
      ),
    }));
  },

  removeItem: (id) => {
    set((state) => ({
      placedItems: state.placedItems.filter((item) => item.id !== id),
    }));
  },

  rerollShop: () => {
    const randomItems = [];
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * COSMIC_ITEMS.length);
        randomItems.push({ ...COSMIC_ITEMS[randomIndex], id: `${COSMIC_ITEMS[randomIndex].id}_${Math.random().toString(36).substr(2, 9)}` });
    }
    set({ shopItems: randomItems });
  },

  checkFusion: (item1Id, item2Id) => {
    const recipe = FUSION_RECIPES.find(
      (r) => (r.inputs[0] === item1Id && r.inputs[1] === item2Id) || (r.inputs[0] === item2Id && r.inputs[1] === item1Id)
    );
    return recipe ? recipe.result : null;
  },

  checkMerge: () => {
    const { placedItems } = get();
    const itemCounts: Record<string, PlacedItem[]> = {};

    placedItems.forEach((item) => {
      if (!itemCounts[item.itemId]) itemCounts[item.itemId] = [];
      itemCounts[item.itemId].push(item);
    });

    for (const itemId in itemCounts) {
      if (itemCounts[itemId].length >= 3) {
        // Simple merge: remove 3, give one (in real game, upgrade degree)
        const toRemove = itemCounts[itemId].slice(0, 3);
        set((state) => ({
          placedItems: state.placedItems.filter((i) => !toRemove.includes(i)),
          gold: state.gold + 10, // Reward for merge
        }));
        console.log(`Merged 3 ${itemId}! Received Gold!`);
      }
    }
  },
}));
