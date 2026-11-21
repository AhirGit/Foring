import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

type NavbarProps = {
    cartCount: number;
};

function Navbar({ cartCount }: NavbarProps) {
    return (
        <nav className="relative flex h-14 items-center justify-between border-b border-primary bg-white/70 px-16">

            <img
                src={logo}
                alt="Foring Baby's Online Shop"
                className="absolute left-16 top-0 h-30 w-auto py-2"
            />

            <div></div>

            <div className="flex items-center gap-8 text-text">
                <Link className="hover:text-hover" to="/">
                    Home
                </Link>

                <Link className="hover:text-hover" to="/shop">
                    Shop
                </Link>

                <Link className="hover:text-hover" to="/about">
                    About
                </Link>

                <Link className="hover:text-hover" to="/cart">
                    Cart ({cartCount})
                </Link>
            </div>

        </nav>
    );
}

export default Navbar;