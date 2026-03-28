import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import Shop from './components/Shop';
import { useGameStore } from './store/gameStore';
import { Shield, Zap, Target, HelpCircle, LayoutGrid, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HUDItem = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) => (
    <div className={`p-4 bg-[${color}]/5 rounded-2xl border border-[${color}]/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-sm`}>
        <div className="flex items-center gap-3">
            <div className={`p-2 bg-[${color}]/20 rounded-lg`}>
                <Icon className={`w-5 h-5 text-[${color}]`} />
            </div>
            <div>
                <p className={`text-[10px] text-[${color}]/60 font-medium uppercase tracking-widest`}>{label}</p>
                <p className="text-xl font-mono font-bold text-gray-100">{value}</p>
            </div>
        </div>
    </div>
);

const App: React.FC = () => {
    const { gold, health, inventory, placeItem } = useGameStore();
    const [showHelp, setShowHelp] = useState(false);

    return (
        <div className="min-h-screen bg-[#02020a] text-gray-100 p-8 flex flex-col items-center font-sans overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_#02020a_100%)] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />

            <header className="z-10 w-full max-w-5xl flex justify-between items-center mb-10">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center p-3 shadow-2xl shadow-indigo-600/30">
                        <Sparkles className="w-full h-full text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tighter uppercase leading-none">
                            Cosmic Archive
                        </h1>
                        <p className="text-xs text-indigo-400/60 font-medium tracking-[0.3em] uppercase mt-1">Stellar Inventory Defense System</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => setShowHelp(true)}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white/40 hover:text-white/80"
                    >
                        <HelpCircle className="w-6 h-6" />
                    </button>
                    <button className="px-6 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-600/40 rounded-xl transition-all font-bold text-sm text-indigo-300">
                        DEPLOY FLEET
                    </button>
                </div>
            </header>

            <main className="z-10 w-full max-w-5xl grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-8">
                    <GameCanvas />
                    <Shop />
                </div>

                <div className="col-span-4 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <HUDItem icon={Shield} label="DEFENSE" value={`${health}%`} color="#ef4444" />
                        <HUDItem icon={Zap} label="ENERGY" value="2,450" color="#8b5cf6" />
                    </div>

                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-6">
                            <LayoutGrid className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">
                                Archive Inventory
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                            {inventory.map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        placeItem({
                                            id: `${item.id}_p_${Math.random()}`,
                                            itemId: item.id,
                                            q: 0,
                                            r: 0,
                                            rotations: 0
                                        });
                                    }}
                                    className="aspect-square bg-[#0c0c20] rounded-lg border border-indigo-500/20 flex items-center justify-center p-2 cursor-pointer hover:border-indigo-400 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-[10px] font-bold text-center text-indigo-200 uppercase leading-tight">{item.name}</span>
                                </motion.div>
                            ))}
                            {[...Array(9 - inventory.length)].map((_, i) => (
                                <div key={i} className="aspect-square bg-black/40 rounded-lg border border-white/5" />
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl border border-indigo-500/30 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 blur-sm group-hover:opacity-30 transition-opacity translate-x-1/4 -translate-y-1/4">
                            <Target className="w-32 h-32 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Active Synergies</h3>
                        <p className="text-xs text-indigo-200 opacity-60">Place items adjacent to each other to activate cosmic resonance.</p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-indigo-500/30 rounded text-[10px] border border-indigo-500/40">Star +3</span>
                            <span className="px-3 py-1 bg-purple-500/30 rounded text-[10px] border border-purple-500/40">Electric +1</span>
                        </div>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {showHelp && (
                    <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-8"
                    onClick={() => setShowHelp(false)}
                    >
                        <motion.div 
                        initial={{ scale: 0.9, y: 30 }}
                        animate={{ scale: 1, y: 0 }}
                        className="max-w-xl w-full bg-[#0a0a20] p-10 rounded-3xl border border-indigo-500/40 shadow-[0_0_100px_rgba(79,70,229,0.2)]"
                        onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter">Mission Briefing</h2>
                            <div className="space-y-6 text-indigo-200/80 leading-relaxed">
                                <p>1. <span className="text-white font-bold">Purchase Fragment:</span> Acquisition starts in the shop below. Each piece costs 5 Gold.</p>
                                <p>2. <span className="text-white font-bold">Archive Placement:</span> Click an item in your inventory to deploy it to the Archive Grid.</p>
                                <p>3. <span className="text-white font-bold">Orientation:</span> Hold [R] while dragging to rotate items to fit complex gaps.</p>
                                <p>4. <span className="text-white font-bold">Resonance (Merge):</span> Matching 3 identical fragments will automatically evolve them into a superior state.</p>
                            </div>
                            <button 
                                onClick={() => setShowHelp(false)}
                                className="w-full mt-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl tracking-[0.2em] uppercase transition-all"
                            >
                                START ARCHIVING
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
