import React from 'react';
import { BattleLog } from '../types';
import { ChevronDown } from 'lucide-react';

interface MessageLogProps {
  logs: BattleLog[];
}

const MessageLog: React.FC<MessageLogProps> = ({ logs }) => {
  // Get the most recent log
  const lastLog = logs.length > 0 ? logs[logs.length - 1] : null;

  return (
    <div className="w-full bg-rpg-panel border-4 border-double border-gray-500 rounded-lg p-4 md:p-6 min-h-[100px] shadow-xl relative flex items-center justify-center text-center">
      <div className="font-mono text-lg md:text-xl leading-relaxed text-white drop-shadow-md w-full">
        {lastLog ? (
          <div key={lastLog.id} className="animate-fade-in">
             <span className={
               lastLog.type === 'damage' ? 'text-red-300' :
               lastLog.type === 'heal' ? 'text-green-300' :
               lastLog.type === 'skill' ? 'text-yellow-300' :
               'text-white'
             }>
               {lastLog.message}
             </span>
          </div>
        ) : (
          <span className="text-gray-500 animate-pulse text-sm">...</span>
        )}
      </div>
      
      {/* Decorative arrow indicating message window */}
      <div className="absolute bottom-1 right-2 text-white/30 animate-bounce">
        <ChevronDown size={20} />
      </div>
    </div>
  );
};

export default MessageLog;