export interface PreciseIntervalOptions {
  /**
   * The interval duration in milliseconds
   */
  intervalMs: number
}

export interface PreciseInterval {
  /** Clear the interval. */
  destroy: () => void
}

export function createPreciseInterval(callback: () => void, opts: PreciseIntervalOptions): PreciseInterval {
  /** Is the interval already destroyed */
  let isDestroyed: boolean = false

  let timeoutHandle: ReturnType<typeof setTimeout> | null = null

  const beginMs = performance.now()
  let wantedMs = beginMs + opts.intervalMs

  const tick = () => {
    const nowMs = performance.now()

    if (isDestroyed) {
      return
    }

    callback()

    const drift = nowMs - wantedMs
    wantedMs += opts.intervalMs

    timeoutHandle = setTimeout(tick, opts.intervalMs - drift)
  }
  timeoutHandle = setTimeout(tick, opts.intervalMs)

  const destroy = () => {
    if (isDestroyed) {
      return
    }

    isDestroyed = true

    if (timeoutHandle !== null) {
      clearTimeout(timeoutHandle)
    }
  }

  const pi: PreciseInterval = { destroy }
  return pi
}