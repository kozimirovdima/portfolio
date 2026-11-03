      // --- Мобильное меню ---
      const menuToggle = document.querySelector('.menu-toggle');
      const navPanel = document.querySelector('.nav-panel');

      if (menuToggle && navPanel) {
        const setMenu = (open) => {
          navPanel.classList.toggle('is-open', open);
          menuToggle.setAttribute('aria-expanded', String(open));
          menuToggle.setAttribute(
            'aria-label',
            open ? 'Закрыть меню' : 'Открыть меню'
          );
        };

        menuToggle.addEventListener('click', () => {
          setMenu(!navPanel.classList.contains('is-open'));
        });

        navPanel.querySelectorAll('a').forEach((link) => {
          link.addEventListener('click', () => setMenu(false));
        });

        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape' && navPanel.classList.contains('is-open')) {
            setMenu(false);
            menuToggle.focus();
          }
        });

        document.addEventListener('click', (event) => {
          if (
            navPanel.classList.contains('is-open') &&
            !navPanel.contains(event.target) &&
            !menuToggle.contains(event.target)
          ) {
            setMenu(false);
          }
        });

        window.addEventListener('resize', () => {
          if (window.innerWidth > 760) setMenu(false);
        });
      }

      // --- Прогресс скролла + тень шапки ---
      const progress = document.querySelector('.scroll-progress span');
      const topbar = document.querySelector('.topbar-wrap');

      const onScroll = () => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        if (progress) {
          progress.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
        }
        if (topbar) topbar.classList.toggle('scrolled', h.scrollTop > 8);
      };
      document.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      // --- Плавное появление секций ---
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const revealItems = document.querySelectorAll('.reveal');

      if (reduceMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach((el) => el.classList.add('is-visible'));
      } else {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.12 }
        );
        revealItems.forEach((el) => io.observe(el));
      }

      // --- Светлая / тёмная тема ---
      const themeToggle = document.querySelector('.theme-toggle');
      const root = document.documentElement;
      const themeColor = document.getElementById('theme-color');

      const applyTheme = (theme) => {
        root.setAttribute('data-theme', theme);
        const dark = theme === 'dark';
        if (themeToggle) {
          themeToggle.setAttribute('aria-pressed', String(dark));
          themeToggle.setAttribute(
            'aria-label',
            dark ? 'Включить светлую тему' : 'Включить тёмную тему'
          );
        }
        if (themeColor) themeColor.setAttribute('content', dark ? '#14110d' : '#f5f1eb');
      };

      applyTheme(root.getAttribute('data-theme') || 'light');

      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
          applyTheme(next);
          try {
            localStorage.setItem('theme', next);
          } catch (e) {}
        });
      }

      // --- Копирование e-mail ---
      const copyBtn = document.querySelector('.copy-email');
      const copyStatus = document.getElementById('copy-status');

      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          const email = 'kozimirovdima23@gmail.com';
          try {
            await navigator.clipboard.writeText(email);
            const original = copyBtn.textContent;
            copyBtn.textContent = 'Скопировано!';
            if (copyStatus) copyStatus.textContent = 'Адрес скопирован в буфер обмена';
            setTimeout(() => {
              copyBtn.textContent = original;
            }, 1600);
          } catch (e) {
            window.location.href = 'mailto:' + email;
            if (copyStatus) copyStatus.textContent = 'Не удалось скопировать, открываю почту';
          }
        });
      }
