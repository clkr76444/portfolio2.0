const scrollTopButton = document.createElement('button');

scrollTopButton.type = 'button';
scrollTopButton.className = 'scroll-top-btn';
scrollTopButton.setAttribute('aria-label', 'Scroll til toppen');
scrollTopButton.innerHTML = `
    <svg class="scroll-top-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V5"></path>
        <polyline points="6 11 12 5 18 11"></polyline>
    </svg>
    <span class="scroll-top-btn__label">Til top</span>
`;

document.body.appendChild(scrollTopButton);

const toggleScrollTopButton = () => {
    const shouldShowButton = window.scrollY > 320;
    scrollTopButton.classList.toggle('is-visible', shouldShowButton);
};

scrollTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', toggleScrollTopButton, { passive: true });
window.addEventListener('load', toggleScrollTopButton);
toggleScrollTopButton();
