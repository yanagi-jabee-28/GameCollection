export interface Unit {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;
  isEnemy: boolean;
  avatarUrl?: string;
  isDefending: boolean;
  color: string;
  learnedSkills: string[]; // List of Skill IDs
}

export type ActionCategory = 'ATTACK' | 'DEFEND' | 'MAGIC' | 'SKILL';

export type TargetType = 'SINGLE_ENEMY' | 'SINGLE_ALLY' | 'ALL_ENEMIES' | 'ALL_ALLIES' | 'SELF';

export interface Skill {
  id: string;
  name: string;
  mpCost: number;
  type: 'MAGIC' | 'SKILL';
  targetType: TargetType;
  power: number; // Damage or Heal amount
  description: string;
  animationKey?: string; // For visual effects
}

export interface BattleLog {
  id: string;
  message: string;
  type: 'info' | 'damage' | 'heal' | 'turn' | 'success' | 'skill';
}

export type GameState = 'BATTLE' | 'VICTORY' | 'DEFEAT';

export interface BattleState {
  units: Unit[];
  turnQueue: string[];
  activeUnitId: string | null;
  logs: BattleLog[];
  gameState: GameState;
}