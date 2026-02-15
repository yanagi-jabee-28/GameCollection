import React from 'react';
import { Unit } from '../types';
import { Shield } from 'lucide-react';

interface UnitCardProps {
  unit: Unit;
  isActive: boolean;
  isTargetable?: boolean;
  onSelect?: (unitId: string) => void;
}

const UnitCard: React.FC<UnitCardProps> = ({ unit, isActive, isTargetable, onSelect }) => {
  const isDead = unit.hp <= 0;
  
  const hpPercent = Math.max(0, (unit.hp / unit.maxHp) * 100);
  const mpPercent = Math.max(0, (unit.mp / unit.maxMp) * 100);
  
  const borderStyle = isActive 
    ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] scale-105' 
    : 'border-white/20 hover:border-white/40';
    
  const opacityStyle = isDead ? 'opacity-50 grayscale' : 'opacity-100';
  const cursorStyle = isTargetable && !isDead ? 'cursor-pointer hover:bg-white/10' : 'cursor-default';

  const handleClick = () => {
    if (isTargetable && !isDead && onSelect) {
      onSelect(unit.id);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        relative flex flex-col items-center p-3 md:p-4 rounded-xl border-2 bg-rpg-panel transition-all duration-300
        w-28 md:w-36 lg:w-40
        ${borderStyle} ${opacityStyle} ${cursorStyle}
        ${isActive ? 'z-10' : 'z-0'}
      `}
    >
      {/* Active Arrow */}
      {isActive && (
        <div className="absolute -top-8 text-yellow-400 animate-bounce">
          ▼
        </div>
      )}

      {/* Avatar */}
      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full mb-2 md:mb-3 shadow-inner flex items-center justify-center text-2xl font-bold text-white ${unit.color} relative overflow-hidden border-2 border-black/30`}>
        {unit.avatarUrl ? (
          <img src={unit.avatarUrl} alt={unit.name} className="w-full h-full object-cover" />
        ) : (
           unit.name.charAt(0)
        )}
        {unit.isDefending && (
           <div className="absolute inset-0 bg-black/40 flex items-center justify-center animate-pulse">
             <Shield size={24} className="text-blue-300" />
           </div>
        )}
      </div>

      {/* Stats */}
      <div className="w-full space-y-1 md:space-y-2">
        <div className="text-center font-bold text-xs md:text-sm truncate text-white drop-shadow-md">{unit.name}</div>
        
        {/* HP Bar */}
        <div className="w-full bg-gray-900 rounded-full h-2 md:h-2.5 relative overflow-hidden border border-gray-700">
          <div 
            className={`h-full transition-all duration-500 ${hpPercent < 30 ? 'bg-rpg-danger' : 'bg-rpg-success'}`} 
            style={{ width: `${hpPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] md:text-xs text-gray-300 font-mono leading-none">
          <span>H</span>
          <span>{unit.hp}</span>
        </div>

        {/* MP Bar */}
        {unit.maxMp > 0 && (
          <>
            <div className="w-full bg-gray-900 rounded-full h-1.5 md:h-2 relative overflow-hidden border border-gray-700 mt-1">
              <div 
                className="h-full bg-rpg-accent transition-all duration-500" 
                style={{ width: `${mpPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] md:text-xs text-blue-200 font-mono leading-none">
              <span>M</span>
              <span>{unit.mp}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UnitCard;