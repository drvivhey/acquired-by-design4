import logo from "@/assets/Wellspring_Logo_Cropped.svg";

const Navbar = () => (
  <nav className="border-b border-border bg-card">
    <div className="container mx-auto flex h-16 items-center justify-between px-4">
      <div className="flex items-center">
        <img src={logo} alt="Wellspring" className="h-10 w-auto" />
      </div>
    </div>
  </nav>
);

export default Navbar;
