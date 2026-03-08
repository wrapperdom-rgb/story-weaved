import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background border-b border-border relative">
      <h1 className="text-xl font-bold tracking-[0.3em] text-foreground">M V S T R</h1>

      {/* Desktop nav */}
      <nav className="hidden sm:flex items-center gap-2">
        <button className="px-4 py-2 text-xs font-bold tracking-wider text-foreground border border-border hover:bg-accent transition-colors">
          HOW IT WORKS
        </button>
        <button className="px-4 py-2 text-xs font-bold tracking-wider text-primary-foreground bg-primary hover:opacity-90 transition-opacity">
          SIGN UP
        </button>
        <button className="px-4 py-2 text-xs font-bold tracking-wider text-foreground border border-foreground hover:bg-accent transition-colors">
          SIGN IN
        </button>
      </nav>

      {/* Mobile hamburger */}
      <button className="sm:hidden text-foreground" onClick={() => setOpen(!open)}>
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border flex flex-col p-4 gap-2 z-50 sm:hidden">
          <button className="w-full px-4 py-3 text-xs font-bold tracking-wider text-foreground border border-border hover:bg-accent transition-colors">
            HOW IT WORKS
          </button>
          <button className="w-full px-4 py-3 text-xs font-bold tracking-wider text-primary-foreground bg-primary hover:opacity-90 transition-opacity">
            SIGN UP
          </button>
          <button className="w-full px-4 py-3 text-xs font-bold tracking-wider text-foreground border border-foreground hover:bg-accent transition-colors">
            SIGN IN
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
