import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary:
        "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105",
      secondary:
        "border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white",
      ghost: "text-gray-300 hover:text-white hover:bg-white/5",
      destructive: "bg-red-600 hover:bg-red-700 text-white shadow-lg",
      outline:
        "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-900 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800",
    };

    const sizes = {
      sm: "h-9 px-4 py-2 text-sm",
      md: "h-11 px-6 py-3 text-base",
      lg: "h-13 px-8 py-4 text-lg",
      xl: "h-15 px-10 py-5 text-xl",
    };

    const iconSizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-7 h-7",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
        )}

        {icon && iconPosition === "left" && !loading && (
          <span className={cn("mr-2", iconSizes[size])}>{icon}</span>
        )}

        {children}

        {icon && iconPosition === "right" && !loading && (
          <span className={cn("ml-2", iconSizes[size])}>{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
