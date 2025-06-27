import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/app/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "destructive"
    | "outline"
    | "nude";
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
      "inline-flex items-center justify-center rounded-full font-body font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-nude-50 disabled:pointer-events-none disabled:opacity-50 tracking-wide";

    const variants = {
      primary:
        "bg-gradient-to-r from-primary via-primary-hover to-brown-600 hover:from-primary-hover hover:to-brown-700 text-white shadow-elegant hover:shadow-elegant-lg transform hover:scale-105 hover:-translate-y-0.5",
      secondary:
        "border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-elegant hover:shadow-elegant-lg transform hover:scale-105",
      nude: "bg-gradient-to-r from-nude-200 to-cream-200 hover:from-nude-300 hover:to-cream-300 text-brown-800 shadow-elegant hover:shadow-elegant-lg transform hover:scale-105",
      ghost: "text-brown-700 hover:text-primary hover:bg-nude-100 rounded-full",
      destructive:
        "bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white shadow-elegant",
      outline:
        "border-2 border-nude-300 bg-transparent hover:bg-nude-100 text-brown-800 hover:border-primary hover:text-primary shadow-elegant",
    };

    const sizes = {
      sm: "h-10 px-6 py-2 text-sm",
      md: "h-12 px-8 py-3 text-base",
      lg: "h-14 px-10 py-4 text-lg",
      xl: "h-16 px-12 py-5 text-xl",
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
        {loading && <div className="loading-spinner small mr-3"></div>}

        {icon && iconPosition === "left" && !loading && (
          <span className={cn("mr-3", iconSizes[size])}>{icon}</span>
        )}

        <span className="relative">{children}</span>

        {icon && iconPosition === "right" && !loading && (
          <span className={cn("ml-3", iconSizes[size])}>{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
