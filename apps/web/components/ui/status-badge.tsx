import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Badge } from "./badge"
import { cn } from "web/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium",
  {
    variants: {
      status: {
        up: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800",
        down: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800",
      },
    },
    defaultVariants: {
      status: "up",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  status: 'up' | 'down'
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, status, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        className={cn(statusBadgeVariants({ status }), className)}
        {...props}
      >
        <div 
          className={cn(
            "w-2 h-2 rounded-full",
            status === 'up' ? "bg-green-500" : "bg-red-500"
          )}
        />
        {status === 'up' ? 'Up' : 'Down'}
      </Badge>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

export { StatusBadge, statusBadgeVariants }