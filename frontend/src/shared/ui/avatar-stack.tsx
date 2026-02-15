import * as React from "react"
import { cn } from "@/shared/lib/utils"

const Avatar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { src?: string; alt?: string }
>(({ className, src, alt, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white bg-gray-100",
            className
        )}
        {...props}
    >
        {src ? (
            <img className="aspect-square h-full w-full object-cover" src={src} alt={alt || "Avatar"} />
        ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
        )}
    </div>
))
Avatar.displayName = "Avatar"

const AvatarStack = ({ className, children }: { className?: string, children: React.ReactNode }) => {
    return (
        <div className={cn("flex -space-x-3 overflow-hidden", className)}>
            {children}
        </div>
    )
}

export { Avatar, AvatarStack }
