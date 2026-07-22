document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.navbar');
  const progress = document.querySelector('.scroll-progress span');
  const topButton = document.querySelector('.back-to-top');
  const portfolioLink = document.querySelector('.portfolio-link');
  const primaryNav = document.getElementById('primaryNav');
  const themeToggle = document.querySelector('.theme-toggle');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  let scrollSpy;
  const setNavigationHeight = () => {
    document.documentElement.style.setProperty('--nav-height', `${nav.offsetHeight}px`);
  };
  const initialiseScrollSpy = () => {
    scrollSpy?.dispose();
    bootstrap.ScrollSpy.getInstance(document.body)?.dispose();
    scrollSpy = new bootstrap.ScrollSpy(document.body, {
      target: '#primaryNavList',
      rootMargin: `-${nav.offsetHeight}px 0px -40%`
    });
    scrollSpy.refresh();
  };
  const applyTheme = theme => {
    const isLight = theme === 'light';
    document.documentElement.dataset.theme = theme;
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
    themeToggle.querySelector('i').className = `bi bi-${isLight ? 'sun-fill' : 'moon-stars-fill'}`;
    themeColor.setAttribute('content', isLight ? '#f5f9ff' : '#07111f');
  };
  const showPortfolioLinkForValidReferrer = () => {
    if (!document.referrer) return;
    try {
      const referrer = new URL(document.referrer);
      if (referrer.protocol === 'https:' && referrer.hostname === 'greshan.securedigitallabs.com') {
        portfolioLink.hidden = false;
      }
    } catch { /* Ignore malformed referrers. */ }
  };
  const updateScrollUI = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
    const shouldBeScrolled = window.scrollY > 20;
    const navStateChanged = nav.classList.contains('scrolled') !== shouldBeScrolled;
    nav.classList.toggle('scrolled', shouldBeScrolled);
    if (navStateChanged) {
      setNavigationHeight();
      initialiseScrollSpy();
    }
    topButton.classList.toggle('visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  window.addEventListener('resize', () => {
    setNavigationHeight();
    initialiseScrollSpy();
  });
  primaryNav.addEventListener('shown.bs.collapse', () => {
    setNavigationHeight();
    initialiseScrollSpy();
  });
  primaryNav.addEventListener('hidden.bs.collapse', () => {
    setNavigationHeight();
    initialiseScrollSpy();
  });
  showPortfolioLinkForValidReferrer();
  applyTheme(document.documentElement.dataset.theme || 'dark');
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('sdl-theme', nextTheme);
    applyTheme(nextTheme);
  });
  setNavigationHeight();
  initialiseScrollSpy();
  window.addEventListener('load', () => {
    setNavigationHeight();
    initialiseScrollSpy();
  }, { once: true });
  updateScrollUI();
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  document.querySelectorAll('#primaryNav .nav-link, #primaryNav .btn-nav-contact').forEach(link => link.addEventListener('click', () => {
    bootstrap.Collapse.getOrCreateInstance(primaryNav).hide();
    requestAnimationFrame(() => scrollSpy.refresh());
  }));
  document.getElementById('currentYear').textContent = new Date().getFullYear();
});
