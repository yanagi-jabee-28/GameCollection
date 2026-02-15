import React, { useState, useEffect } from 'react';
import { useBattleSystem } from '../hooks/useBattleSystem';
import UnitCard from './UnitCard';
import CommandMenu from './CommandMenu';
import MessageLog from './MessageLog';
import { ActionCategory, Unit } from '../types';
import { RefreshCw } from 'lucide-react';
import { SKILLS } from '../data/skillDatabase';

const BattleScene: React.FC = () => {
  const { units, activeUnitId, logs, gameState, executePlayerAction, restart } = useBattleSystem();
  
  // UI State
  const [menuLevel, setMenuLevel] = useState<'TOP' | 'MAGIC' | 'SKILL'>('TOP');
  const [selectedAction, setSelectedAction] = useState<{ category: ActionCategory, skillId?: string } | null>(null);
  const [targetMode, setTargetMode] = useState(false);

  const activeUnit = units.find(u => u.id === activeUnitId);
  const isPlayerTurn = activeUnit && !activeUnit.isEnemy && gameState === 'BATTLE';

  // Reset UI when turn changes
  useEffect(() => {
    setMenuLevel('TOP');
    setSelectedAction(null);
    setTargetMode(false);
  }, [activeUnitId]);

  const handleMenuSelect = (category: ActionCategory, skillId?: string) => {
    if (category === 'DEFEND') {
      if (activeUnit) executePlayerAction({ category: 'DEFEND', actorId: activeUnit.id });
      return;
    }

    if (category === 'MAGIC' && !skillId) {
      setMenuLevel('MAGIC');
      return;
    }
    if (category === 'SKILL' && !skillId) {
      setMenuLevel('SKILL');
      return;
    }

    // Prepare for targeting
    setSelectedAction({ category, skillId });
    
    // Check target type to skip selection if ALL or SELF (simplified logic)
    let autoTarget = false;
    if (skillId) {
      const skill = SKILLS[skillId];
      if (skill.targetType === 'ALL_ENEMIES' || skill.targetType === 'ALL_ALLIES' || skill.targetType === 'SELF') {
        autoTarget = true;
      }
    }

    if (autoTarget && activeUnit) {
      executePlayerAction({ category, actorId: activeUnit.id, skillId });
    } else {
      setTargetMode(true);
    }
  };

  const handleUnitClick = (targetId: string) => {
    if (!targetMode || !selectedAction || !activeUnit) return;
    
    // Execute
    executePlayerAction({
      category: selectedAction.category,
      actorId: activeUnit.id,
      targetId: targetId,
      skillId: selectedAction.skillId
    });
  };

  const handleBack = () => {
    if (targetMode) {
      setTargetMode(false);
      setSelectedAction(null);
    } else if (menuLevel !== 'TOP') {
      setMenuLevel('TOP');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto p-2 md:p-6 gap-3 font-sans bg-black/20">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-rpg-panel p-3 rounded-lg border-2 border-white/20 shadow-md">
        <h1 className="text-lg md:text-xl font-bold text-rpg-accent tracking-widest drop-shadow-sm">DRAGON BATTLE</h1>
        <div className="text-sm text-gray-300 font-mono bg-black/30 px-3 py-1 rounded">
          Next: <span className="text-white font-bold">{activeUnit?.name || '...'}</span>
        </div>
      </div>

      {/* Main Battle Scene (Center) */}
      <div className="flex-1 relative bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl flex flex-col md:flex-row group min-h-[300px]">
        
        {/* Enemy Group */}
        <div className="flex-1 flex flex-wrap content-center justify-center gap-6 p-6 relative">
           <div className="absolute top-2 left-2 text-red-500/30 font-bold tracking-[0.5em] text-sm pointer-events-none">ENEMIES</div>
           {units.filter(u => u.isEnemy).map(u => (
             <UnitCard 
               key={u.id} 
               unit={u} 
               isActive={activeUnitId === u.id}
               isTargetable={targetMode && (selectedAction?.category === 'ATTACK' || (!!selectedAction?.skillId && SKILLS[selectedAction.skillId]?.targetType === 'SINGLE_ENEMY'))}
               onSelect={handleUnitClick}
             />
           ))}
        </div>

        {/* Hero Group */}
        <div className="flex-1 flex flex-wrap content-center justify-center gap-6 p-6 relative bg-black/10">
           <div className="absolute top-2 right-2 text-blue-500/30 font-bold tracking-[0.5em] text-sm pointer-events-none">PARTY</div>
           {units.filter(u => !u.isEnemy).map(u => (
             <UnitCard 
               key={u.id} 
               unit={u} 
               isActive={activeUnitId === u.id}
               isTargetable={targetMode && !!selectedAction?.skillId && SKILLS[selectedAction.skillId]?.targetType === 'SINGLE_ALLY'}
               onSelect={handleUnitClick}
             />
           ))}
        </div>

        {/* Overlays */}
        {targetMode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-2 rounded-full border border-white/30 animate-pulse pointer-events-none z-50">
             Target Selection
          </div>
        )}

        {gameState !== 'BATTLE' && (
          <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center animate-fade-in backdrop-blur-sm">
            <h2 className={`text-5xl md:text-7xl font-black mb-6 tracking-tighter ${gameState === 'VICTORY' ? 'text-yellow-400' : 'text-red-600'}`}>
              {gameState === 'VICTORY' ? 'VICTORY' : 'DEFEATED'}
            </h2>
            <button 
              onClick={restart}
              className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-transform hover:scale-105"
            >
              <RefreshCw size={24} /> Play Again
            </button>
          </div>
        )}
      </div>

      {/* Footer Interface: Message & Command */}
      <div className="flex flex-col gap-2 w-full">
        
        {/* Message Window (Top of footer) */}
        <div className="w-full">
           <MessageLog logs={logs} />
        </div>

        {/* Command Menu Area (Bottom of footer) */}
        <div className="h-[140px] w-full"> 
          {isPlayerTurn ? (
             targetMode ? (
               <div className="w-full h-full bg-rpg-panel border-t-4 border-double border-gray-500 p-4 flex flex-col items-center justify-center gap-2">
                 <span className="text-white animate-pulse">対象を選んでください</span>
                 <button onClick={handleBack} className="text-sm text-red-400 underline hover:text-red-300">キャンセル</button>
               </div>
             ) : (
               <CommandMenu 
                 activeUnit={activeUnit} 
                 onActionSelect={handleMenuSelect} 
                 currentMenu={menuLevel}
                 onBack={handleBack}
               />
             )
          ) : (
            // Placeholder when not player turn or during animation
            <div className="w-full h-full bg-black/20 rounded-lg border-2 border-white/5 flex items-center justify-center text-gray-500 italic">
               Waiting...
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default BattleScene;