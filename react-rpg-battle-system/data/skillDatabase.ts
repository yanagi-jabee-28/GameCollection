import { Skill } from '../types';

export const SKILLS: Record<string, Skill> = {
  // --- Magic (Spells) ---
  'fireball': {
    id: 'fireball',
    name: 'メラ',
    mpCost: 4,
    type: 'MAGIC',
    targetType: 'SINGLE_ENEMY',
    power: 25,
    description: '敵1体に火の玉で攻撃',
    animationKey: 'fire'
  },
  'bang': {
    id: 'bang',
    name: 'イオ',
    mpCost: 8,
    type: 'MAGIC',
    targetType: 'ALL_ENEMIES',
    power: 20,
    description: '敵全体に爆発ダメージ',
    animationKey: 'explosion'
  },
  'heal': {
    id: 'heal',
    name: 'ホイミ',
    mpCost: 3,
    type: 'MAGIC',
    targetType: 'SINGLE_ALLY',
    power: 35,
    description: '味方1体のHPを回復',
    animationKey: 'heal'
  },
  'moreheal': {
    id: 'moreheal',
    name: 'ベホイミ',
    mpCost: 8,
    type: 'MAGIC',
    targetType: 'SINGLE_ALLY',
    power: 85,
    description: '味方1体のHPを大きく回復',
    animationKey: 'heal_big'
  },

  // --- Skills (Physical/Special) ---
  'double_slash': {
    id: 'double_slash',
    name: 'はやぶさ斬り',
    mpCost: 6,
    type: 'SKILL',
    targetType: 'SINGLE_ENEMY',
    power: 1.8, // Multiplier of normal attack
    description: '素早い動きで2回攻撃相当のダメージ',
    animationKey: 'slash'
  },
  'metal_slash': {
    id: 'metal_slash',
    name: 'メタル斬り',
    mpCost: 2,
    type: 'SKILL',
    targetType: 'SINGLE_ENEMY',
    power: 1.2,
    description: '硬い敵にも確実にダメージを与える',
    animationKey: 'slash_metal'
  },
  'breath': {
    id: 'breath',
    name: '火の息',
    mpCost: 0,
    type: 'SKILL',
    targetType: 'ALL_ENEMIES', // In this context, enemies of the user (heroes)
    power: 15,
    description: '燃え盛る炎を吐き出す',
    animationKey: 'breath'
  },
  'vampire': {
    id: 'vampire',
    name: '吸血',
    mpCost: 0,
    type: 'SKILL',
    targetType: 'SINGLE_ENEMY',
    power: 15,
    description: 'HPを吸い取る',
    animationKey: 'dark'
  }
};

export const getSkill = (id: string): Skill | undefined => SKILLS[id];