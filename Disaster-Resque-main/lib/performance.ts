// Performance monitoring utility
export function logWebVitals(metric: any) {
  console.log(metric)
  
  // Send to analytics service
  if (typeof window !== 'undefined') {
    const body = JSON.stringify(metric)
    // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', body)
    } else {
      fetch('/api/analytics', {
        method: 'POST',
        body,
        keepalive: true,
      }).catch((err) => console.error('Failed to send metric:', err))
    }
  }
}

export function measurePerformance() {
  if (typeof window === 'undefined') return

  // Measure Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(`[Performance] ${entry.name}: ${entry.duration.toFixed(2)}ms`)
    }
  })

  observer.observe({
    entryTypes: ['measure', 'navigation', 'resource', 'paint', 'largest-contentful-paint'],
  })

  // Log page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('[Performance] Page hidden')
    } else {
      console.log('[Performance] Page visible')
    }
  })
}

export function optimizeImages() {
  if (typeof document === 'undefined') return

  // Lazy load images
  const images = document.querySelectorAll('img[data-src]')
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        img.src = img.dataset.src || ''
        img.removeAttribute('data-src')
        observer.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Debounce utility for performance-critical functions
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func(...args)
      timeoutId = null
    }, delay)
  }
}

// Request rate limiter
export function createRateLimiter(maxRequests: number, windowMs: number) {
  const requests: number[] = []

  return {
    isAllowed(): boolean {
      const now = Date.now()
      const startWindow = now - windowMs

      // Remove old requests outside the window
      while (requests.length > 0 && requests[0] < startWindow) {
        requests.shift()
      }

      if (requests.length < maxRequests) {
        requests.push(now)
        return true
      }

      return false
    },
  }
}
