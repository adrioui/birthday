import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../test/render'
import { WalletScreen } from './WalletScreen'
import { testCharm } from '../test/fixtures'

describe('WalletScreen', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders empty state when no charms', () => {
    renderWithProviders(<WalletScreen />)
    expect(screen.queryByText(testCharm.name)).not.toBeInTheDocument()
  })

  it('displays unlocked charms from context', () => {
    renderWithProviders(<WalletScreen />, { initialCharms: [testCharm] })
    const charmNames = screen.getAllByText(testCharm.name)
    expect(charmNames.length).toBeGreaterThan(0)
  })

  it('shows total points', () => {
    renderWithProviders(<WalletScreen />, { initialCharms: [testCharm] })
    expect(screen.getByText('10')).toBeInTheDocument()
  })
})
