const hamburger = document.querySelector('.hamburger');
const offScreenMenu = document.querySelector('.off-screen-menu');
const menuOverlay = document.querySelector('.menu-overlay');
const menuLinks = document.querySelectorAll('.off-screen-menu a');

if (hamburger && offScreenMenu && menuOverlay) {
    const isMenuOpen = () => offScreenMenu.classList.contains('active');

    const setActiveMenuLink = (selectedLink) => {
        menuLinks.forEach((link) => {
            const isActive = link === selectedLink;
            link.classList.toggle('is-active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    const setMenuState = (isOpen) => {
        hamburger.classList.toggle('active', isOpen);
        offScreenMenu.classList.toggle('active', isOpen);
        menuOverlay.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    };

    const closeMenu = () => setMenuState(false);

    hamburger.addEventListener('click', (event) => {
        event.stopPropagation();
        setMenuState(!isMenuOpen());
    });

    offScreenMenu.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    menuOverlay.addEventListener('click', closeMenu);

    menuLinks.forEach((link) => {
        link.addEventListener('click', () => {
            setActiveMenuLink(link);
            closeMenu();
        });
    });

    setActiveMenuLink(menuLinks[0]);

    document.addEventListener('click', (event) => {
        if (isMenuOpen() && !offScreenMenu.contains(event.target) && !hamburger.contains(event.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
}
