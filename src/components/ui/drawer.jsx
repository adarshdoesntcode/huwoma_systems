import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

const isIosPwa = () => {
  if (typeof window === "undefined") return false

  const isiPadOS = window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1
  const isIos = /iPad|iPhone|iPod/.test(window.navigator.userAgent) || isiPadOS
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true

  return isIos && isStandalone
}

const Drawer = ({
  shouldScaleBackground,
  fixed,
  preventScrollRestoration,
  repositionInputs,
  ...props
}) => {
  const iosPwa = isIosPwa()
  const resolvedShouldScaleBackground = shouldScaleBackground ?? !iosPwa
  const resolvedFixed = fixed ?? iosPwa
  const resolvedPreventScrollRestoration = preventScrollRestoration ?? iosPwa
  const resolvedRepositionInputs = repositionInputs ?? !iosPwa

  return (
    <DrawerPrimitive.Root
      shouldScaleBackground={resolvedShouldScaleBackground}
      fixed={resolvedFixed}
      preventScrollRestoration={resolvedPreventScrollRestoration}
      repositionInputs={resolvedRepositionInputs}
      {...props}
    />
  )
}
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props} />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto max-h-[calc(100dvh-1.5rem)] flex-col overflow-y-auto overscroll-contain rounded-t-[10px] border bg-background pb-[max(env(safe-area-inset-bottom),1rem)]",
        className
      )}
      {...props}>
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props} />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
  className,
  ...props
}) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props} />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
