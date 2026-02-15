import React from 'react';
import BattleScene from './components/BattleScene';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-rpg-bg text-white font-sans selection:bg-rpg-accent selection:text-black">
      <BattleScene />
    </div>
  );
};

export default App;