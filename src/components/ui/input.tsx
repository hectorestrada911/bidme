import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border bg-blue-950/30 px-4 py-2 text-sm text-white transition-all duration-200",
          "border-blue-900/50 shadow-sm shadow-blue-900/20",
          "placeholder:text-blue-300/50",
          "focus:border-blue-400 focus:bg-blue-950/50 focus:shadow-blue-400/20 focus:ring-0 focus:outline-none",
          "hover:border-blue-800 hover:bg-blue-950/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input } 