import { useCharms } from '../../context/CharmContext'
import { CharmUnlockModal } from './CharmUnlockModal'

export function CharmModalManager() {
  const { newlyUnlockedCharm, dismissUnlockModal } = useCharms()

  if (!newlyUnlockedCharm) return null

  return (
    <CharmUnlockModal 
      charm={newlyUnlockedCharm} 
      onDismiss={dismissUnlockModal} 
    />
  )
}
