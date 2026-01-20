export interface Charm {
  id: string
  name: string
  icon: string
  power: string
  points: number
  iconBgColor?: string
  iconColor?: string
}

export const PLACEHOLDER_CHARMS: Charm[] = [
  {
    id: 'super-star',
    name: 'Super Star',
    icon: 'star',
    power: 'Main Character Energy',
    points: 150,
  },
  {
    id: '8-bit-love',
    name: '8-Bit Love',
    icon: 'favorite',
    power: '+1 Extra Life',
    points: 100,
    iconBgColor: '#131315',
    iconColor: '#ef4444',
  },
  {
    id: 'digi-pet',
    name: 'Digi-Pet',
    icon: 'pets',
    power: 'Always Hungry',
    points: 175,
    iconBgColor: '#fbcfe8',
  },
  {
    id: 'sonic-boom',
    name: 'Sonic Boom',
    icon: 'headphones',
    power: 'Mute Haters',
    points: 75,
    iconBgColor: '#dbeafe',
  },
]

export const MAX_CHARMS = 10
