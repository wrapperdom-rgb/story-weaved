const Navbar = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background border-b border-border">
      <h1 className="text-xl font-bold tracking-[0.3em] text-foreground">M V S T R</h1>
      <nav className="flex items-center gap-2">
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
    </header>
  );
};

export default Navbar;
