const hamburger = document.querySelector('.hamburger');
const offScreenMenu = document.querySelector('.off-screen-menu');
const menuOverlay = document.querySelector('.menu-overlay');
const menuLinks = document.querySelectorAll('.off-screen-menu a');

const setActiveMenuLink = (selectedLink) => {
    menuLinks.forEach((link) => {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
    });

    if (selectedLink) {
        selectedLink.classList.add('is-active');
        selectedLink.setAttribute('aria-current', 'page');
    }
};

const setMenuState = (isOpen) => {
    hamburger.classList.toggle('active', isOpen);
    offScreenMenu.classList.toggle('active', isOpen);
    menuOverlay.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
};

hamburger.addEventListener('click', (event) => {
    event.stopPropagation();
    setMenuState(!offScreenMenu.classList.contains('active'));
});

offScreenMenu.addEventListener('click', (event) => {
    event.stopPropagation();
});

menuOverlay.addEventListener('click', () => {
    setMenuState(false);
});

menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
        setActiveMenuLink(link);
        setMenuState(false);
    });
});

setActiveMenuLink(menuLinks[0]);

document.addEventListener('click', (event) => {
    if (!offScreenMenu.classList.contains('active')) {
        return;
    }

    if (!offScreenMenu.contains(event.target) && !hamburger.contains(event.target)) {
        setMenuState(false);
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        setMenuState(false);
    }
});
