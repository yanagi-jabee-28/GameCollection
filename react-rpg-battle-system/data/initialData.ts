
import { Unit } from '../types';

export const INITIAL_HEROES: Unit[] = [
  {
    id: 'hero-1',
    name: '勇者',
    hp: 140,
    maxHp: 140,
    mp: 25,
    maxMp: 25,
    attack: 28,
    defense: 12,
    speed: 14,
    isEnemy: false,
    isDefending: false,
    color: 'bg-blue-600',
    avatarUrl: 'https://picsum.photos/id/1025/200/200',
    learnedSkills: ['fireball', 'heal', 'double_slash']
  },
  {
    id: 'hero-2',
    name: '魔法使い',
    hp: 85,
    maxHp: 85,
    mp: 60,
    maxMp: 60,
    attack: 8,
    defense: 6,
    speed: 11,
    isEnemy: false,
    isDefending: false,
    color: 'bg-purple-600',
    avatarUrl: 'https://picsum.photos/id/1062/200/200',
    learnedSkills: ['fireball', 'bang', 'moreheal']
  },
  {
    id: 'hero-3',
    name: '武闘家',
    hp: 110,
    maxHp: 110,
    mp: 20, // MPを20に変更
    maxMp: 20, // 最大MPを20に変更
    attack: 32,
    defense: 8,
    speed: 18,
    isEnemy: false,
    isDefending: false,
    color: 'bg-orange-600',
    avatarUrl: 'https://picsum.photos/id/1011/200/200',
    learnedSkills: ['metal_slash']
  }
];

export const INITIAL_ENEMIES: Unit[] = [
  {
    id: 'enemy-1',
    name: 'スライム',
    hp: 35,
    maxHp: 35,
    mp: 0,
    maxMp: 0,
    attack: 16,
    defense: 4,
    speed: 9,
    isEnemy: true,
    isDefending: false,
    color: 'bg-blue-400',
    avatarUrl: 'https://picsum.photos/id/1084/200/200',
    learnedSkills: []
  },
  {
    id: 'enemy-2',
    name: 'ドラゴン',
    hp: 150,
    maxHp: 150,
    mp: 100,
    maxMp: 100,
    attack: 35,
    defense: 15,
    speed: 7,
    isEnemy: true,
    isDefending: false,
    color: 'bg-green-700',
    avatarUrl: 'https://picsum.photos/id/1003/200/200',
    learnedSkills: ['breath']
  },
  {
    id: 'enemy-3',
    name: '大コウモリ',
    hp: 45,
    maxHp: 45,
    mp: 0,
    maxMp: 0,
    attack: 18,
    defense: 5,
    speed: 16,
    isEnemy: true,
    isDefending: false,
    color: 'bg-gray-600',
    avatarUrl: 'https://picsum.photos/id/1020/200/200',
    learnedSkills: ['vampire']
  }
];
