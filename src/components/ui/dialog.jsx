"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props} />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const isIosDevice = () => {
  if (typeof window === "undefined") return false

  const isiPadOS = window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1
  return /iPad|iPhone|iPod/.test(window.navigator.userAgent) || isiPadOS
}

const isFocusableInput = (element) => {
  if (!element) return false
  const tagName = element.tagName

  return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT" || element.isContentEditable
}

const DialogContent = React.forwardRef(({ className, children, style, ...props }, ref) => {
  const contentRef = React.useRef(null)
  const [keyboardOffset, setKeyboardOffset] = React.useState(0)

  const setRefs = React.useCallback((node) => {
    contentRef.current = node

    if (typeof ref === "function") {
      ref(node)
      return
    }

    if (ref) {
      ref.current = node
    }
  }, [ref])

  React.useEffect(() => {
    if (!isIosDevice() || !window.visualViewport) return undefined

    const visualViewport = window.visualViewport
    let frameId

    const updateOffset = () => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(() => {
        const activeElement = document.activeElement
        const currentContent = contentRef.current
        const focusedInsideDialog = currentContent?.contains(activeElement) && isFocusableInput(activeElement)

        if (!focusedInsideDialog) {
          setKeyboardOffset(0)
          return
        }

        const keyboardHeight = Math.max(0, window.innerHeight - visualViewport.height - visualViewport.offsetTop)
        const nextOffset = keyboardHeight > 80 ? Math.min(Math.round(keyboardHeight * 0.55), 280) : 0
        setKeyboardOffset(nextOffset)
      })
    }

    updateOffset()
    visualViewport.addEventListener("resize", updateOffset)
    visualViewport.addEventListener("scroll", updateOffset)
    document.addEventListener("focusin", updateOffset)
    document.addEventListener("focusout", updateOffset)
    window.addEventListener("orientationchange", updateOffset)

    return () => {
      cancelAnimationFrame(frameId)
      visualViewport.removeEventListener("resize", updateOffset)
      visualViewport.removeEventListener("scroll", updateOffset)
      document.removeEventListener("focusin", updateOffset)
      document.removeEventListener("focusout", updateOffset)
      window.removeEventListener("orientationchange", updateOffset)
    }
  }, [])

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={setRefs}
        style={{
          ...style,
          marginTop: keyboardOffset ? `-${keyboardOffset}px` : style?.marginTop,
        }}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg max-h-[calc(100dvh-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto overscroll-contain border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        {...props}>
        {children}
        <DialogPrimitive.Close
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props} />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
