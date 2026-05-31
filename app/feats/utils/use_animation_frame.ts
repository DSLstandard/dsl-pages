import { useEffect, type DependencyList } from "react";


export function useAnimationFrame(
  callback: (ts: number) => void,
  dependencies?: DependencyList
) {
  useEffect(() => {
    let request_id: number | null = null
    let is_running = false

    const animate = (animate_ts: number) => {
      const this_ts = animate_ts

      // In case a request is somehow meant while being cancelled.
      if (!is_running) {
        return
      }

      callback(this_ts)
      request_id = requestAnimationFrame(animate)
    }

    const start = () => {
      is_running = true

      request_id = requestAnimationFrame(animate)
    }

    const stop = () => {
      is_running = false

      if (request_id) {
        cancelAnimationFrame(request_id)
      }
    }

    start()
    return () => stop()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}