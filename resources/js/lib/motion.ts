/**
 * InspireWrite scroll-reveal driver (vanilla, self-hosted).
 *
 * Watches every `.motion-reveal` element — including ones mounted by
 * later Inertia page navigations, via MutationObserver — and adds
 * `.is-visible` when it enters the viewport. Reduced-motion users and
 * browsers without IntersectionObserver get the final state immediately.
 */
export function initMotion(): void {
    const revealAll = () => {
        document.querySelectorAll<HTMLElement>('.motion-reveal').forEach((el) => {
            el.classList.add('is-visible');
        });
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        revealAll();
        return;
    }

    if (!('IntersectionObserver' in window)) {
        revealAll();
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );

    const observe = (root: ParentNode) => {
        root.querySelectorAll('.motion-reveal:not(.is-visible)').forEach((el) => {
            observer.observe(el);
        });
    };

    observe(document);

    new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node instanceof Element) {
                    if (node.classList.contains('motion-reveal')) {
                        observer.observe(node);
                    }
                    observe(node);
                }
            });
        });
    }).observe(document.body, { childList: true, subtree: true });
}
