const toolMeta = {
    Ai: { mark: 'Ai', label: 'Illustrator' },
    Ps: { mark: 'Ps', label: 'Photoshop' },
    Figma: { mark: '', label: 'Figma', iconSrc: 'img/figma-logo-o.svg' },
    HTML: { mark: '</>', label: 'HTML' },
    CSS: { mark: '{ }', label: 'CSS' },
    JS: { mark: 'JS', label: 'JavaScript' }
};

const createToolMark = (tool, meta) => {
    const toolMark = document.createElement('span');

    toolMark.className = 'project-tool-mark';

    if (meta.iconSrc) {
        const icon = document.createElement('img');

        toolMark.classList.add('project-tool-mark-figma');

        icon.className = 'project-tool-icon';
        icon.src = meta.iconSrc;
        icon.alt = `${meta.label} logo`;
        toolMark.appendChild(icon);

        return toolMark;
    }

    toolMark.textContent = meta.mark || tool;
    return toolMark;
};

// Gør det muligt at linke et helt card til en HTML-side ved at wrappe det i et <a>-tag, hvis der er angivet et link
const createProjectCard = ({ label, title, description, tools = [], link, imageSrc = 'img/baggrund.webp', imageAlt }) => {
    const article = document.createElement('article');
    const content = document.createElement('div');
    const toolList = document.createElement('div');
    const labelElement = document.createElement('p');
    const descriptionElement = document.createElement('p');

    article.className = 'project-card';
    content.className = 'project-card-content';
    toolList.className = 'project-card-tools';
    labelElement.className = 'project-label';
    descriptionElement.className = 'project-card-description';

    tools.forEach((tool) => {
        const toolBadge = document.createElement('span');
        const toolText = document.createElement('span');
        const meta = toolMeta[tool] || { mark: tool, label: tool };
        const toolMark = createToolMark(tool, meta);

        toolBadge.className = `project-tool project-tool-${tool.toLowerCase()}`;
        toolText.className = 'project-tool-text';
        toolText.textContent = meta.label;
        toolBadge.append(toolMark, toolText);
        toolList.appendChild(toolBadge);
    });

    labelElement.textContent = label;
    descriptionElement.innerHTML = description;

    const imageSlot = document.createElement('div');
    const image = document.createElement('img');
    imageSlot.className = 'project-card-image';
    image.src = imageSrc;
    image.alt = imageAlt || `${title || label} projekt`;
    image.loading = 'lazy';
    imageSlot.appendChild(image);

    content.append(labelElement, descriptionElement, toolList);
    article.append(content, imageSlot);

    // Hvis der er et link, gør cardet klikbart og naviger til linket ved klik
    if (link) {
        article.addEventListener('click', () => {
            window.location.href = link;
        });
        article.style.cursor = 'pointer';
    }
    return article;
};

const projects = [
    {
        label: 'Illustration',
        description: 'En illustration lavet i Adobe Illustrator. <br>Lavet med pen-tool og maaaange lag.',
        tools: ['Ai'],
        link: 'index.html'
    },
    {
        label: 'Frontend',
        description: 'En responsiv prototype med tydeligt hierarki, rolige overgange og fokus pa brugeroplevelsen.',
        tools: ['Ps'],
        link: 'index.html'
    },
    {
        label: 'Design',
        description: 'Et skoleprojekt, som udviklede sig til et virkeligt produkt: En app til planlægning af frivilligvagter for en festival, designet i Figma og implementeret i React Native.',
        tools: ['Figma', 'HTML', 'CSS', 'JS'],
        link: 'design.html',
        imageSrc: 'img/word.png',
        imageAlt: 'Eksempel på projekt: Word Festival',
    },
    {
        label: 'Kode',
        description: 'Plads til et projekt bygget med HTML, CSS og JavaScript med fokus pa struktur, styling og interaktion.',
        tools: ['HTML', 'CSS', 'JS'],
        link: 'index.html'
    },
    {
        label: 'UX',
        description: 'En analyse af brugerbehov og adfaerd med wireframes og testresultater som grundlag for design.',
        tools: ['Figma'],
        link: 'index.html'
    }
];

const projectsGrid = document.querySelector('.projects-grid');

if (projectsGrid) {
    projects.forEach((project) => {
        const card = createProjectCard(project);
        card.classList.add('fade-in');
        projectsGrid.appendChild(card);
    });
    // Observer for fade-in
    if (window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        projectsGrid.querySelectorAll('.project-card').forEach(card => {
            observer.observe(card);
        });
    }
}

const projectCarousel = document.querySelector('.projects-carousel');

if (projectCarousel) {
    const projectTrack = projectCarousel.querySelector('.project-track');
    const projectPagination = projectCarousel.querySelector('.project-pagination');
    const previousArrow = projectCarousel.querySelector('.project-arrow-prev');
    const nextArrow = projectCarousel.querySelector('.project-arrow-next');
    const mobileBreakpoint = 699;
    const tabletBreakpoint = 1023;
    let slidesPerView = 3;
    let activeIndex = 0;
    let cloneCount = 0;
    let isTransitioning = false;
    let startX = 0;

    projects.slice(0, 4).forEach((project) => {
        projectTrack.appendChild(createProjectCard(project));
    });

    const originalSlides = Array.from(projectTrack.children);

    const getSlidesPerView = () => {
        if (window.innerWidth <= mobileBreakpoint) {
            return 1;
        }

        if (window.innerWidth <= tabletBreakpoint) {
            return 2;
        }

        return 3;
    };
    const setTrackTransition = (enabled) => {
        projectTrack.style.transition = enabled ? 'transform 0.5s ease' : 'none';
    };

    const updatePagination = () => {
        const dots = projectPagination.querySelectorAll('.project-dot');

        dots.forEach((dot, index) => {
            const isActive = index === activeIndex;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    };

    const slideWidth = () => {
        const firstSlide = projectTrack.children[0];

        if (!firstSlide) {
            return 0;
        }

        const styles = window.getComputedStyle(projectTrack);
        const gap = parseFloat(styles.columnGap || styles.gap || '0');

        return firstSlide.getBoundingClientRect().width + gap;
    };

    const applyTransform = (index, animate = true) => {
        const offset = slideWidth() * index;

        setTrackTransition(animate);
        projectTrack.style.transform = `translateX(${-offset}px)`;

        if (!animate) {
            requestAnimationFrame(() => {
                setTrackTransition(true);
            });
        }
    };

    const syncLoopPosition = () => {
        if (activeIndex >= originalSlides.length) {
            activeIndex = 0;
        }

        if (activeIndex < 0) {
            activeIndex = originalSlides.length - 1;
        }

        applyTransform(activeIndex + cloneCount, false);
    };

    const goToLogicalIndex = (index) => {
        isTransitioning = true;
        applyTransform(index + cloneCount);
        updatePagination();
    };

    const buildPagination = () => {
        projectPagination.innerHTML = '';

        originalSlides.forEach((slide, index) => {
            const heading = slide.querySelector('.project-label');
            const dot = document.createElement('button');

            dot.className = 'project-dot';
            dot.type = 'button';
            dot.setAttribute('aria-label', `Gaa til ${heading ? heading.textContent : `projekt ${index + 1}`}`);
            dot.addEventListener('click', () => {
                if (isTransitioning) {
                    return;
                }

                activeIndex = index;
                goToLogicalIndex(activeIndex);
            });

            projectPagination.appendChild(dot);
        });

        updatePagination();
    };

    const clearClones = () => {
        Array.from(projectTrack.querySelectorAll('[data-clone="true"]')).forEach((slide) => {
            slide.remove();
        });
    };

    const rebuildCarousel = () => {
        slidesPerView = getSlidesPerView();
        cloneCount = slidesPerView;

        clearClones();

        const prependSlides = originalSlides.slice(-cloneCount).map((slide) => {
            const clone = slide.cloneNode(true);
            clone.dataset.clone = 'true';
            return clone;
        });

        const appendSlides = originalSlides.slice(0, cloneCount).map((slide) => {
            const clone = slide.cloneNode(true);
            clone.dataset.clone = 'true';
            return clone;
        });

        prependSlides.forEach((slide) => {
            projectTrack.insertBefore(slide, projectTrack.firstChild);
        });

        appendSlides.forEach((slide) => {
            projectTrack.appendChild(slide);
        });

        applyTransform(activeIndex + cloneCount, false);
        buildPagination();
    };

    const moveSlides = (direction) => {
        if (isTransitioning) {
            return;
        }

        activeIndex += direction;
        goToLogicalIndex(activeIndex);
    };

    previousArrow?.addEventListener('click', () => moveSlides(-1));
    nextArrow?.addEventListener('click', () => moveSlides(1));

    projectTrack.addEventListener('transitionend', () => {
        if (!isTransitioning) {
            return;
        }

        syncLoopPosition();
        isTransitioning = false;
        updatePagination();
    });

    projectCarousel.addEventListener('touchstart', (event) => {
        startX = event.touches[0].clientX;
    }, { passive: true });

    projectCarousel.addEventListener('touchend', (event) => {
        const endX = event.changedTouches[0].clientX;
        const deltaX = endX - startX;

        if (Math.abs(deltaX) < 40 || isTransitioning) {
            return;
        }

        moveSlides(deltaX < 0 ? 1 : -1);
    });

    let resizeTimeout;

    window.addEventListener('resize', () => {
        window.clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(() => {
            const nextSlidesPerView = getSlidesPerView();

            if (nextSlidesPerView !== slidesPerView) {
                rebuildCarousel();
                return;
            }

            syncLoopPosition();
        }, 120);
    });

    rebuildCarousel();
}
