import { Button } from "../ui/Button";

const Navigation = () => {
  return (
    <nav className="relative z-50 flex items-center justify-between px-8 py-6 bg-background/95 backdrop-blur-md border-b border-border/30">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-primary via-nude-pink to-rose-nude rounded-xl flex items-center justify-center shadow-glow">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-champagne rounded-full border-2 border-background"></div>
        </div>
        <div>
          <h1 className="font-playfair font-semibold text-xl text-foreground tracking-tight">
            Aesthetic AI
          </h1>
          <p className="text-xs text-warm-gray font-inter font-medium tracking-wide">
            ADVANCED BEAUTY ANALYSIS
          </p>
        </div>
      </div>

      <div className="hidden lg:flex items-center space-x-12 font-inter">
        <a
          href="#home"
          className="text-warm-gray hover:text-foreground transition-all duration-300 relative group"
        >
          Home
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
        </a>
        <a
          href="#how-it-works"
          className="text-warm-gray hover:text-foreground transition-all duration-300 relative group"
        >
          How It Works
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
        </a>
        <a
          href="#safety"
          className="text-warm-gray hover:text-foreground transition-all duration-300 relative group"
        >
          Safety
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
        </a>
        <a
          href="#contact"
          className="text-warm-gray hover:text-foreground transition-all duration-300 relative group"
        >
          Contact
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
        </a>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          className="font-inter text-warm-gray hover:text-foreground hover:bg-secondary/50"
        >
          Login
        </Button>
        <Button className="font-inter bg-gradient-to-r from-primary to-nude-pink hover:from-nude-pink hover:to-primary text-primary-foreground shadow-luxury hover:shadow-glow transition-all duration-300 px-6">
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
