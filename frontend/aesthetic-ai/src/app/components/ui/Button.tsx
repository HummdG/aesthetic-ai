import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/app/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "secondary"
    | "ghost"
    | "destructive"
    | "outline"
    | "nude";
  size?: "sm" | "default" | "lg" | "icon";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-inter font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default:
        "bg-gradient-to-r from-primary to-nude-pink hover:from-nude-pink hover:to-rose-nude text-primary-foreground shadow-luxury hover:shadow-glow",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-luxury",
      nude: "bg-gradient-to-r from-nude-pink/20 to-champagne/20 hover:from-nude-pink/30 hover:to-champagne/30 text-foreground border border-primary/20 hover:border-primary/30 shadow-luxury",
      ghost: "text-warm-gray hover:text-foreground hover:bg-secondary/50",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-luxury",
      outline:
        "border border-border bg-background hover:bg-accent hover:text-accent-foreground shadow-luxury",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      default: "h-10 px-4 py-2",
      lg: "h-11 px-8 text-lg",
      icon: "h-10 w-10",
    };

    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isDisabled && "opacity-50 cursor-not-allowed",
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
