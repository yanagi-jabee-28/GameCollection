import { useState, useEffect, useCallback, useRef } from 'react';
import { Unit, BattleLog, GameState, ActionCategory, Skill } from '../types';
import { INITIAL_HEROES, INITIAL_ENEMIES } from '../data/initialData';
import { SKILLS } from '../data/skillDatabase';
import { generateTurnQueue, calculateAttackDamage, calculateSkillEffect, getAliveEnemies, getAliveHeroes } from '../utils/battleUtils';

const TURN_DELAY = 1000;

export const useBattleSystem = () => {
  const [units, setUnits] = useState<Unit[]>([...INITIAL_HEROES, ...INITIAL_ENEMIES]);
  const [turnQueue, setTurnQueue] = useState<string[]>([]);
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);
  const [logs, setLogs] = useState<BattleLog[]>([]);
  const [gameState, setGameState] = useState<GameState>('BATTLE');
  
  const unitsRef = useRef(units);
  const gameStateRef = useRef(gameState);

  useEffect(() => { unitsRef.current = units; }, [units]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const addLog = useCallback((message: string, type: BattleLog['type'] = 'info') => {
    setLogs(prev => [...prev, { id: Date.now().toString() + Math.random(), message, type }]);
  }, []);

  // --- Battle Initialization ---
  useEffect(() => {
    addLog('魔物たちが あらわれた！');
    startNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNewRound = () => {
    const aliveUnits = unitsRef.current.filter(u => u.hp > 0);
    if (aliveUnits.length === 0) return;
    const newQueue = generateTurnQueue(aliveUnits);
    setTurnQueue(newQueue);
    if (newQueue.length > 0) setActiveUnitId(newQueue[0]);
  };

  // --- Turn Management ---
  const nextTurn = useCallback(() => {
    const aliveHeroes = getAliveHeroes(unitsRef.current);
    const aliveEnemies = getAliveEnemies(unitsRef.current);

    if (aliveHeroes.length === 0) {
      setGameState('DEFEAT');
      addLog('全滅した...', 'info');
      setActiveUnitId(null);
      return;
    }
    if (aliveEnemies.length === 0) {
      setGameState('VICTORY');
      addLog('勝利した！', 'success');
      setActiveUnitId(null);
      return;
    }

    setTurnQueue(prevQueue => {
      const remaining = prevQueue.slice(1);
      if (remaining.length > 0) {
        setActiveUnitId(remaining[0]);
        return remaining;
      } else {
        const newQueue = generateTurnQueue(unitsRef.current);
        if (newQueue.length > 0) setActiveUnitId(newQueue[0]);
        return newQueue;
      }
    });
  }, [addLog]);

  // --- Active Unit Monitoring ---
  useEffect(() => {
    if (!activeUnitId || gameState !== 'BATTLE') return;
    const activeUnit = units.find(u => u.id === activeUnitId);

    if (!activeUnit || activeUnit.hp <= 0) {
      nextTurn();
      return;
    }

    // Turn Start Reset
    if (activeUnit.isDefending) {
      setUnits(prev => prev.map(u => u.id === activeUnitId ? { ...u, isDefending: false } : u));
    }

    addLog(`${activeUnit.name} のターン！`, 'turn');

    if (activeUnit.isEnemy) {
      const timer = setTimeout(() => executeEnemyTurn(activeUnit), TURN_DELAY);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeUnitId, gameState, nextTurn]);

  // --- AI Logic ---
  const executeEnemyTurn = (enemy: Unit) => {
    const heroes = getAliveHeroes(unitsRef.current);
    if (heroes.length === 0) return;

    // AI Decision
    const useSkillChance = Math.random() < 0.5;
    const availableSkills = enemy.learnedSkills.map(id => SKILLS[id]).filter(s => s && enemy.mp >= s.mpCost);
    
    let action: ActionCategory = 'ATTACK';
    let skillId: string | undefined;
    let target = heroes[Math.floor(Math.random() * heroes.length)];

    if (useSkillChance && availableSkills.length > 0) {
      const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
      action = skill.type as ActionCategory;
      skillId = skill.id;
      // Re-target for self/healing skills if we had them (not implemented for enemies yet, assuming offensive)
    }

    performAction({ category: action, actorId: enemy.id, targetId: target.id, skillId });
  };

  // --- Core Action Logic ---
  const performAction = ({ category, actorId, targetId, skillId }: { 
    category: ActionCategory, 
    actorId: string, 
    targetId?: string, 
    skillId?: string 
  }) => {
    setUnits(currentUnits => {
      const actor = currentUnits.find(u => u.id === actorId);
      if (!actor) return currentUnits; // Safety check

      let newUnits = [...currentUnits];
      
      // -- DEFEND --
      if (category === 'DEFEND') {
        addLog(`${actor.name} は 身をまもっている。`, 'info');
        return newUnits.map(u => u.id === actorId ? { ...u, isDefending: true } : u);
      }

      // -- ATTACK --
      if (category === 'ATTACK' && targetId) {
        const target = newUnits.find(u => u.id === targetId);
        if (target) {
          const damage = calculateAttackDamage(actor, target);
          addLog(`${actor.name} のこうげき！ ${target.name} に ${damage} のダメージ！`, 'damage');
          newUnits = newUnits.map(u => u.id === targetId ? { ...u, hp: Math.max(0, u.hp - damage) } : u);
          if (newUnits.find(u => u.id === targetId)?.hp === 0) {
            addLog(`${target.name} は たおれた！`, 'info');
          }
        }
      }

      // -- SKILL / MAGIC --
      if ((category === 'MAGIC' || category === 'SKILL') && skillId) {
        const skill = SKILLS[skillId];
        if (skill && actor.mp >= skill.mpCost) {
          // Consume MP
          newUnits = newUnits.map(u => u.id === actorId ? { ...u, mp: Math.max(0, u.mp - skill.mpCost) } : u);
          addLog(`${actor.name} は ${skill.name} をつかった！`, 'skill');

          // Determine targets
          let targets: Unit[] = [];
          if (skill.targetType === 'ALL_ENEMIES') {
            targets = actor.isEnemy ? getAliveHeroes(newUnits) : getAliveEnemies(newUnits);
          } else if (skill.targetType === 'ALL_ALLIES') {
            targets = actor.isEnemy ? getAliveEnemies(newUnits) : getAliveHeroes(newUnits);
          } else if (targetId) {
            const t = newUnits.find(u => u.id === targetId);
            if (t) targets = [t];
          }

          // Apply Effects
          targets.forEach(t => {
            const effectValue = calculateSkillEffect(actor, t, skill);
            
            if (['heal', 'heal_big'].includes(skill.animationKey || '')) {
              // Healing
              newUnits = newUnits.map(u => {
                if (u.id === t.id) {
                  const newHp = Math.min(u.maxHp, u.hp + effectValue);
                  addLog(`${t.name} のHPが ${effectValue} 回復した！`, 'heal');
                  return { ...u, hp: newHp };
                }
                return u;
              });
            } else {
              // Damage
              newUnits = newUnits.map(u => {
                if (u.id === t.id) {
                  const newHp = Math.max(0, u.hp - effectValue);
                  addLog(`${t.name} に ${effectValue} のダメージ！`, 'damage');
                  return { ...u, hp: newHp };
                }
                return u;
              });
              if (newUnits.find(u => u.id === t.id)?.hp === 0) {
                addLog(`${t.name} は たおれた！`, 'info');
              }
            }
          });

        } else {
          addLog(`しかし MPがたりない！`, 'info');
        }
      }

      return newUnits;
    });

    // Schedule next turn
    setTimeout(() => {
      nextTurn();
    }, 800);
  };

  return {
    units,
    activeUnitId,
    logs,
    gameState,
    executePlayerAction: performAction,
    restart: () => window.location.reload()
  };
};