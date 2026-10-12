/* Lexique interactif — chargé par toutes les leçons de français */
(function () {
    function init() {
        const items = document.querySelectorAll('.lex');
        if (!items.length) return;

        const tip = document.createElement('div');
        tip.className = 'lex-tip';
        tip.setAttribute('role', 'tooltip');
        document.body.appendChild(tip);

        let active = null;

        function place(el) {
            const r = el.getBoundingClientRect();
            tip.style.left = Math.max(8, r.left + window.scrollX) + 'px';
            tip.style.top  = (r.bottom + window.scrollY + 7) + 'px';
            // évite le débordement à droite
            requestAnimationFrame(() => {
                const overflow = tip.getBoundingClientRect().right - window.innerWidth + 8;
                if (overflow > 0) tip.style.left = (parseFloat(tip.style.left) - overflow) + 'px';
            });
        }

        function show(el) {
            if (active === el) { hide(); return; }
            if (active) active.classList.remove('lex-open');
            active = el;
            tip.textContent = el.dataset.def;
            tip.style.display = 'block';
            place(el);
            el.classList.add('lex-open');
        }

        function hide() {
            if (active) active.classList.remove('lex-open');
            active = null;
            tip.style.display = 'none';
        }

        items.forEach(el => {
            el.setAttribute('tabindex', '0');
            el.setAttribute('role', 'button');
            el.setAttribute('aria-label', el.textContent + ' — ' + el.dataset.def);
            el.addEventListener('click',      e => { e.stopPropagation(); show(el); });
            el.addEventListener('mouseenter', () => show(el));
            el.addEventListener('mouseleave', () => { if (active === el) hide(); });
            el.addEventListener('keydown',    e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(el); }
            });
        });

        document.addEventListener('click',   hide);
        document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
        window.addEventListener('scroll',    () => { if (active) place(active); }, { passive: true });

        // Génère la liste "Mots du texte"
        const box = document.getElementById('mots-du-texte');
        if (box) {
            const rows = [...items].map(el =>
                `<li><strong>${el.textContent}</strong> : ${el.dataset.def}</li>`
            ).join('');
            box.innerHTML =
                `<p class="lex-glossaire-titre">📖 Mots du texte</p>` +
                `<ul class="lex-glossaire-liste">${rows}</ul>`;
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
