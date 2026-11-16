import logo from "../assets/logo.png";

function Navbar() {
    return (
        <nav className="relative flex h-14 items-center justify-between border-b border-primary bg-white/70 px-16">

            <img
                src={logo}
                alt="Foring Baby's Online Shop"
                className="absolute left-16 top-0 h-30 w-auto py-2"
            />

            <div></div>

            <div className="flex items-center gap-8 text-text">
                <a className="hover:text-hover" href="/">Home</a>
                <a className="hover:text-hover" href="/shop">Shop</a>
                <a className="hover:text-hover" href="/about">About</a>
                <a className="hover:text-hover" href="/cart">Cart</a>
            </div>

        </nav>
    );
}

export default Navbar;