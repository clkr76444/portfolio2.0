const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

const targets = new Set();

document.querySelectorAll('main section:not(.hero)').forEach(el => {
    el.classList.add('fade-in');
    targets.add(el);
});

document.querySelectorAll('.fade-in').forEach(el => {
    targets.add(el);
});

targets.forEach(el => {
    observer.observe(el);
});
