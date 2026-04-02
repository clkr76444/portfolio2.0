(() => {
    const body = document.body;
    const loader = document.querySelector('.page-loader');
    const minimumAnimationMs = 2000;

    if (!body || !loader || !body.classList.contains('home-page')) {
        return;
    }

    let isPageLoaded = document.readyState === 'complete';
    let hasMinimumAnimationElapsed = false;
    let hasFinished = false;

    const finishLoading = () => {
        if (hasFinished || !isPageLoaded || !hasMinimumAnimationElapsed) {
            return;
        }

        hasFinished = true;
        body.classList.add('is-loaded');
    };

    if (!isPageLoaded) {
        window.addEventListener('load', () => {
            isPageLoaded = true;
            requestAnimationFrame(finishLoading);
        }, { once: true });
    }

    window.setTimeout(() => {
        hasMinimumAnimationElapsed = true;
        requestAnimationFrame(finishLoading);
    }, minimumAnimationMs);

    loader.addEventListener('transitionend', (event) => {
        if (event.propertyName === 'opacity' && body.classList.contains('is-loaded')) {
            loader.remove();
        }
    });
})();
