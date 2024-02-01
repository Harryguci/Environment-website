function NavbarVertical() {
    const [navbarItems, setNavbarItems] = useState([
        {
            display: 'Home',
            name: 'home',
            href: '/home',
            icon: faHome,
        },
        {
            display: 'Travel Maps',
            name: 'maps',
            href: '/maps',
            icon: faMap,
        },
        {
            display: 'Products',
            name: 'products',
            href: '/products',
            icon: faBagShopping,
        },
        {
            display: 'Contact',
            name: 'contact',
            href: '/contact',
            icon: faNewspaper,
        },
    ]);

    return (
        <>
            <div className="container-fluid">
                <ul className="nav navbar navbar-verticle">
                    {navbarItems.map(item => (
                        <li key={item.name} className="navbar-item">
                            <Link className={
                                ({ isActive, isPending }) =>
                                    isActive
                                        ? "nav-link active"
                                        : isPending
                                            ? "nav-link pending"
                                            : "nav-link"} to={item.href}>
                                {item.display}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}