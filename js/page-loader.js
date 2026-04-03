(() => {
    const body = document.body;
    const loader = document.querySelector('.page-loader');
    const minimumAnimationMs = 2000;
    const loaderSeenKey = 'homeLoaderSeen';

    if (!body || !loader || !body.classList.contains('home-page')) {
        return;
    }

    let hasSeenLoader = false;

    try {
        hasSeenLoader = window.localStorage.getItem(loaderSeenKey) === 'true';
    } catch {
        hasSeenLoader = false;
    }

    if (hasSeenLoader) {
        body.classList.add('is-loaded');
        loader.remove();
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

        try {
            window.localStorage.setItem(loaderSeenKey, 'true');
        } catch {
            // Ignore storage errors and continue with normal behavior.
        }
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
