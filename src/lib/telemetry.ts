type TelemetryEvent = 
  | 'flip_call_answered'
  | 'gift_revealed'
  | 'snap_taken'
  | 'charm_viewed'

export function trackEvent(event: TelemetryEvent, metadata?: Record<string, unknown>) {
  console.log(`[Telemetry] ${event}`, metadata ?? {})
}
