import { type Charm } from '../types/charm'

export const testCharm: Charm = {
  id: 'test-charm-1',
  name: 'Test Charm',
  icon: '⭐',
  power: 'Test power description',
  points: 10,
}

export const testCharm2: Charm = {
  id: 'test-charm-2',
  name: 'Second Charm',
  icon: '🌟',
  power: 'Another power',
  points: 25,
}

export const testCharmWithColors: Charm = {
  id: 'colored-charm',
  name: 'Colored Charm',
  icon: '💎',
  power: 'Shiny power',
  points: 50,
  iconBgColor: '#FF0099',
  iconColor: '#CCFF00',
}
