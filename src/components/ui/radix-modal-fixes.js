const OPEN_MODAL_SELECTOR = [
  '[role="dialog"][data-state="open"]',
  '[role="alertdialog"][data-state="open"]',
  '[data-state="open"][data-radix-dialog-content]',
  '[data-state="open"][data-radix-alert-dialog-content]',
  '[data-state="open"][data-vaul-drawer]',
].join(",")

let guardRefCount = 0
let styleObserver
let domObserver
let handlePageShow
let handleVisibilityChange

const hasOpenModal = () => Boolean(document.querySelector(OPEN_MODAL_SELECTOR))

const clearBodyPointerEvents = () => {
  if (typeof document === "undefined") return
  if (!document.body) return

  document.body.style.pointerEvents = ""
}

const resetBodyPointerEventsIfStale = () => {
  if (typeof document === "undefined") return
  if (document.body.style.pointerEvents !== "none") return

  if (!hasOpenModal()) {
    clearBodyPointerEvents()
  }
}

const scheduleBodyPointerEventsCleanup = () => {
  if (typeof window === "undefined") return

  const tryCleanup = () => {
    resetBodyPointerEventsIfStale()
  }

  // Close transitions from nested modals can complete at different times.
  // Re-check a few times so late body locks are also removed.
  const delays = [0, 16, 64, 120, 220, 350, 500, 750, 1000]
  window.requestAnimationFrame(tryCleanup)
  delays.forEach((delay) => {
    window.setTimeout(tryCleanup, delay)
  })
}

const installBodyPointerEventsGuard = () => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {}
  }

  guardRefCount += 1

  if (guardRefCount === 1) {
    const triggerCleanup = () => {
      window.requestAnimationFrame(resetBodyPointerEventsIfStale)
    }

    styleObserver = new MutationObserver(triggerCleanup)
    styleObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    })

    domObserver = new MutationObserver(triggerCleanup)
    domObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    handlePageShow = () => triggerCleanup()
    handleVisibilityChange = () => triggerCleanup()

    window.addEventListener("pageshow", handlePageShow)
    document.addEventListener("visibilitychange", handleVisibilityChange)
  }

  scheduleBodyPointerEventsCleanup()

  return () => {
    guardRefCount = Math.max(0, guardRefCount - 1)

    if (guardRefCount === 0) {
      styleObserver?.disconnect()
      domObserver?.disconnect()
      styleObserver = undefined
      domObserver = undefined

      if (handlePageShow) {
        window.removeEventListener("pageshow", handlePageShow)
        handlePageShow = undefined
      }

      if (handleVisibilityChange) {
        document.removeEventListener("visibilitychange", handleVisibilityChange)
        handleVisibilityChange = undefined
      }
    }

    scheduleBodyPointerEventsCleanup()
  }
}

export { installBodyPointerEventsGuard, scheduleBodyPointerEventsCleanup }
