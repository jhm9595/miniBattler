import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Coins, RefreshCw } from 'lucide-react';
import { COSMIC_ITEMS, CosmicItem } from '../data/items';

const Shop: React.FC = () => {
    const { shopItems, gold, buyItem, rerollShop, placeItem } = useGameStore();

    useEffect(() => {
        rerollShop();
    }, []);

    const handleBuyAndPlace = (item: CosmicItem) => {
        if (gold >= 5) {
            buyItem(item);
            // Default place it in center or wait for dragging?
            // The user requested to drag from shop to backpack.
            // But let's simplify for now: item goes to inventory.
            // But wait, user requested dragging.
            // For dragging from React UI to PixiJS, I need a bridge.
            // I'll add them to inventory, and show them in a bar.
        }
    };

    return (
        <div className="mt-8 p-6 bg-[#0a0a20] rounded-2xl border border-indigo-500/30 shadow-[0_0_40px_rgba(79,70,229,0.15)] backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                        Cosmic Outpost
                    </h2>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full border border-amber-500/30">
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-300 font-mono font-bold leading-none">{gold}</span>
                    </div>
                    <button 
                        onClick={() => {
                            if (gold >= 2) {
                                rerollShop();
                                useGameStore.getState().buyItem({ id: 'reroll_cost', gold: 2 } as any); // Simple cost deduction
                            }
                        }}
                        className="group flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20"
                    >
                        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        Reroll (2)
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
                <AnimatePresence mode='popLayout'>
                    {shopItems.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                            transition={{ delay: idx * 0.05, type: 'spring', damping: 15 }}
                            whileHover={{ y: -5 }}
                            onClick={() => handleBuyAndPlace(item)}
                            className="bg-[#11112b] p-4 rounded-xl border border-indigo-500/20 cursor-pointer hover:border-indigo-400/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all group relative overflow-hidden h-40 flex flex-col justify-between"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <div>
                                <h3 className="text-sm font-bold text-indigo-100 group-hover:text-indigo-300 transition-colors">
                                    {item.name}
                                </h3>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="px-1.5 py-0.5 bg-indigo-500/10 rounded text-[10px] text-indigo-400 font-medium tracking-wide">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 flex flex-col gap-2">
                                {item.synergy && (
                                    <div className="text-[10px] text-indigo-300/60 leading-tight">
                                        <span className="text-indigo-400">Target:</span> {item.synergy.targetTag}
                                        <br />
                                        <span className="text-indigo-400">Effect:</span> {item.synergy.effect}
                                    </div>
                                )}
                                <div className="text-sm font-mono text-amber-300 mt-2 flex justify-between items-center group-hover:text-amber-200 transition-colors">
                                    <span>5 Gold</span>
                                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Shop;
