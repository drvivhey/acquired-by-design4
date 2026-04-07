const Navbar = () => (
  <nav className="border-b border-border bg-card">
    <div className="container mx-auto flex h-16 items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">Logo</div>
        <span className="text-lg font-bold tracking-tight text-foreground">
          The Wellspring business value index
        </span>
      </div>
    </div>
  </nav>
);

export default Navbar;
