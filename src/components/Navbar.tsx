import { useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

type NavbarProps = {
    cartCount: number;
};

function Navbar({ cartCount }: NavbarProps) {

    const [menuOpen, setMenuOpen] = useState(false);

    function closeMenu() {
        setMenuOpen(false);
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-primary bg-white/90 shadow-sm backdrop-blur-md">

            {/* Main navbar */}
            <div className="relative flex h-14 items-center justify-between px-4 md:px-16">

                {/* Logo */}
                <Link to="/" onClick={closeMenu}>
                    <img
                        src={logo}
                        alt="Foring Baby's Online Shop"
                        className="h-16 w-auto md:absolute md:left-16 md:top-0 md:h-30 md:py-2"
                    />
                </Link>

                {/* Desktop spacer */}
                <div className="hidden md:block"></div>

                {/* Desktop navigation */}
                <div className="hidden items-center gap-8 text-text md:flex">

                    <Link
                        className="hover:text-hover"
                        to="/"
                    >
                        Home
                    </Link>

                    <Link
                        className="hover:text-hover"
                        to="/shop"
                    >
                        Shop
                    </Link>

                    <Link
                        className="hover:text-hover"
                        to="/about"
                    >
                        About
                    </Link>

                    <Link
                        className="hover:text-hover"
                        to="/cart"
                    >
                        Cart ({cartCount})
                    </Link>

                </div>

                {/* Mobile controls */}
                <div className="flex items-center gap-4 md:hidden">

                    <Link
                        to="/cart"
                        onClick={closeMenu}
                        className="text-sm font-medium text-text"
                    >
                        Cart ({cartCount})
                    </Link>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
                        aria-label="Open navigation menu"
                    >
                        <span className="h-0.5 w-6 bg-text"></span>
                        <span className="h-0.5 w-6 bg-text"></span>
                        <span className="h-0.5 w-6 bg-text"></span>
                    </button>

                </div>

            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">

                    <div className="flex flex-col gap-4">

                        <Link
                            to="/"
                            onClick={closeMenu}
                            className="font-medium text-text hover:text-hover"
                        >
                            Home
                        </Link>

                        <Link
                            to="/shop"
                            onClick={closeMenu}
                            className="font-medium text-text hover:text-hover"
                        >
                            Shop
                        </Link>

                        <Link
                            to="/about"
                            onClick={closeMenu}
                            className="font-medium text-text hover:text-hover"
                        >
                            About
                        </Link>

                    </div>

                </div>
            )}

        </nav>
    );
}

export default Navbar;