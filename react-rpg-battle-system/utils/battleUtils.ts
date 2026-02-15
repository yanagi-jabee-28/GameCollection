import { Unit, Skill } from '../types';

/**
 * Calculates physical attack damage
 */
export const calculateAttackDamage = (attacker: Unit, defender: Unit): number => {
  const baseDamage = Math.max(1, attacker.attack - defender.defense / 2);
  const defenseMultiplier = defender.isDefending ? 0.5 : 1.0;
  const variance = 0.9 + Math.random() * 0.2; // 90% - 110%
  return Math.floor(baseDamage * defenseMultiplier * variance);
};

/**
 * Calculates Magic/Skill damage or healing
 */
export const calculateSkillEffect = (attacker: Unit, target: Unit, skill: Skill): number => {
  let baseAmount = 0;

  if (skill.type === 'MAGIC') {
    // Magic damage is usually fixed base + small stat scaling (using attack/2 as proxy for magic stat here)
    baseAmount = skill.power + (attacker.attack * 0.2); 
  } else {
    // Skills might be multipliers of physical attack
    if (skill.power < 10) { // Assuming low numbers are multipliers
      const basePhys = Math.max(1, attacker.attack - target.defense / 2);
      baseAmount = basePhys * skill.power;
    } else {
      // Fixed damage skills (like Breath)
      baseAmount = skill.power;
    }
  }

  // Defend only reduces Physical and Skill damage, usually not Magic (unless specific armor, ignored here)
  const defenseMultiplier = (target.isDefending && skill.type !== 'MAGIC') ? 0.5 : 1.0;
  const variance = 0.9 + Math.random() * 0.2;

  return Math.floor(baseAmount * defenseMultiplier * variance);
};

/**
 * Generates turn queue
 */
export const generateTurnQueue = (units: Unit[]): string[] => {
  const aliveUnits = units.filter(u => u.hp > 0);
  const sorted = [...aliveUnits].sort((a, b) => {
    const speedA = a.speed * (0.9 + Math.random() * 0.2);
    const speedB = b.speed * (0.9 + Math.random() * 0.2);
    return speedB - speedA;
  });
  return sorted.map(u => u.id);
};

export const getAliveUnits = (units: Unit[]) => units.filter(u => u.hp > 0);
export const getAliveEnemies = (units: Unit[]) => units.filter(u => u.isEnemy && u.hp > 0);
export const getAliveHeroes = (units: Unit[]) => units.filter(u => !u.isEnemy && u.hp > 0);