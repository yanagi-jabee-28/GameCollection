import React from 'react';
import { Sword, Shield, Zap, Sparkles, CornerUpLeft } from 'lucide-react';
import { ActionCategory, Skill, Unit } from '../types';
import { SKILLS } from '../data/skillDatabase';

interface CommandMenuProps {
  activeUnit: Unit | undefined;
  onActionSelect: (category: ActionCategory, skillId?: string) => void;
  onBack?: () => void;
  currentMenu: 'TOP' | 'MAGIC' | 'SKILL';
}

const CommandMenu: React.FC<CommandMenuProps> = ({ activeUnit, onActionSelect, currentMenu, onBack }) => {
  if (!activeUnit) return null;

  const btnBase = "flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-white transition-all active:scale-95 border-b-4 text-sm md:text-base shadow-lg";
  
  // -- Sub Menu (Magic / Skills) --
  if (currentMenu === 'MAGIC' || currentMenu === 'SKILL') {
    const filterType = currentMenu;
    const skills = activeUnit.learnedSkills
      .map(id => SKILLS[id])
      .filter(s => s && s.type === filterType);

    return (
      <div className="w-full h-full flex flex-col bg-rpg-panel border-t-4 border-double border-gray-500 p-4 animate-float">
        <div className="flex justify-between items-center mb-2 px-2 border-b border-gray-600 pb-2">
           <span className="text-yellow-400 font-bold">{currentMenu === 'MAGIC' ? 'じゅもん' : 'とくぎ'}</span>
           <button onClick={onBack} className="text-xs text-gray-400 flex items-center hover:text-white">
             <CornerUpLeft size={14} className="mr-1"/> もどる
           </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-32 scrollbar-hide">
          {skills.length === 0 && <div className="col-span-2 text-center text-gray-500 py-4">覚えている技はありません</div>}
          
          {skills.map(skill => {
            const canUse = activeUnit.mp >= skill.mpCost;
            return (
              <button
                key={skill.id}
                onClick={() => canUse && onActionSelect(currentMenu, skill.id)}
                disabled={!canUse}
                className={`
                  ${btnBase} 
                  ${canUse ? 'bg-slate-700 hover:bg-slate-600 border-slate-900' : 'bg-gray-800 border-gray-900 opacity-50 cursor-not-allowed'}
                  flex-col md:flex-row items-start md:items-center justify-between px-3 py-2
                `}
              >
                <span>{skill.name}</span>
                <span className="text-xs font-mono text-blue-300 bg-black/40 px-1 rounded">{skill.mpCost} MP</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // -- Top Level Menu --
  return (
    <div className="w-full flex flex-wrap md:flex-nowrap gap-3 p-4 bg-rpg-panel border-t-4 border-double border-gray-500 justify-center shadow-2xl animate-float">
      <button 
        onClick={() => onActionSelect('ATTACK')} 
        className={`${btnBase} bg-red-700 hover:bg-red-600 border-red-900 w-[45%] md:w-auto`}
      >
        <Sword size={18} /> たたかう
      </button>
      
      <button 
        onClick={() => onActionSelect('MAGIC')} 
        className={`${btnBase} bg-indigo-700 hover:bg-indigo-600 border-indigo-900 w-[45%] md:w-auto`}
      >
        <Sparkles size={18} /> じゅもん
      </button>
      
      <button 
        onClick={() => onActionSelect('SKILL')} 
        className={`${btnBase} bg-orange-700 hover:bg-orange-600 border-orange-900 w-[45%] md:w-auto`}
      >
        <Zap size={18} /> とくぎ
      </button>
      
      <button 
        onClick={() => onActionSelect('DEFEND')} 
        className={`${btnBase} bg-blue-700 hover:bg-blue-600 border-blue-900 w-[45%] md:w-auto`}
      >
        <Shield size={18} /> ぼうぎょ
      </button>
    </div>
  );
};

export default CommandMenu;