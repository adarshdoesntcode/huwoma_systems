import { useEffect } from 'react';

/**
 * Custom hook to lock body scroll when a component is mounted (e.g., when a drawer/modal is open)
 * This prevents the parent container from scrolling and jumping when interacting with overlays
 * 
 * @param {boolean} isLocked - Whether scroll should be locked
 */
export const useScrollLock = (isLocked) => {
    useEffect(() => {
        if (!isLocked) return;

        // Store original values
        const originalOverflow = document.body.style.overflow;
        const originalPosition = document.body.style.position;
        const originalTop = document.body.style.top;
        const originalWidth = document.body.style.width;
        const scrollY = window.scrollY;

        // Lock body scroll and maintain scroll position
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        return () => {
            // Restore body scroll
            document.body.style.overflow = originalOverflow;
            document.body.style.position = originalPosition;
            document.body.style.top = originalTop;
            document.body.style.width = originalWidth;

            // Restore scroll position
            window.scrollTo(0, scrollY);
        };
    }, [isLocked]);
};
