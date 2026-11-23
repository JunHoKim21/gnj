document.addEventListener('DOMContentLoaded', () => {
  /* 1. 스크롤 페이드인 */
  const fadeTargets = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    fadeTargets.forEach((el) => observer.observe(el));
  } else {
    fadeTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* 2. 모바일 드로어 */
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileMenuOpen = document.getElementById('mobileMenuOpen');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileDrawerBackdrop = document.getElementById('mobileDrawerBackdrop');

  const openDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileMenuOpen) mobileMenuOpen.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileMenuOpen) mobileMenuOpen.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileMenuOpen) mobileMenuOpen.addEventListener('click', openDrawer);
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeDrawer);
  if (mobileDrawerBackdrop) mobileDrawerBackdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  /* 3. 서브페이지 탭 전환 (?tab= 파라미터 연동 포함) */
  const tabBtns = document.querySelectorAll('.sub-tab-btn[data-tab]');
  const tabPanels = document.querySelectorAll('.tab-panel[data-tab-panel]');

  const activateTab = (tabId) => {
    if (!tabBtns.length || !tabPanels.length) return;
    const exists = Array.from(tabBtns).some((b) => b.dataset.tab === tabId);
    const targetId = exists ? tabId : tabBtns[0].dataset.tab;

    tabBtns.forEach((btn) => {
      const active = btn.dataset.tab === targetId;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    tabPanels.forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.tabPanel === targetId);
    });
  };

  if (tabBtns.length) {
    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get('tab');
    if (initialTab) {
      activateTab(initialTab);
    }

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextTab = btn.dataset.tab;
        activateTab(nextTab);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', nextTab);
        window.history.replaceState({}, '', url.toString());
      });
    });
  }

  /* 4. 비급여 비용안내 필터 (hospital.html 등) */
  const filterTabs = document.querySelectorAll('.filter-tab[data-fee-filter]');
  const feeRows = document.querySelectorAll('#feeTable tbody tr');
  if (filterTabs.length && feeRows.length) {
    filterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.feeFilter;
        filterTabs.forEach((t) => t.classList.toggle('is-active', t === tab));
        feeRows.forEach((row) => {
          const match = filter === 'all' || row.dataset.category === filter;
          row.classList.toggle('is-hidden', !match);
        });
      });
    });
  }

  /* 5. 간편 예약 폼 (4개 필드 + 동의 체크) */
  const reserveForm = document.getElementById('quickReserveForm');
  const reserveFeedback = document.getElementById('reserveFeedback');
  if (reserveForm && reserveFeedback) {
    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('resName').value.trim();
      const phone = document.getElementById('resPhone').value.trim();
      const subject = document.getElementById('resSubject').value;
      const preferredTime = document.getElementById('resTime').value;
      const agree = document.getElementById('resAgree').checked;

      reserveFeedback.className = 'form-feedback';
      if (!name || !phone || !subject || !preferredTime) {
        reserveFeedback.classList.add('is-error');
        reserveFeedback.textContent = '성함, 연락처, 진료과목, 희망시간을 모두 입력해 주세요.';
        return;
      }
      if (!agree) {
        reserveFeedback.classList.add('is-error');
        reserveFeedback.textContent = '개인정보 수집 및 이용에 동의해 주세요.';
        return;
      }
      reserveFeedback.classList.add('is-success');
      reserveFeedback.textContent = `${name}님, [${subject} / ${preferredTime}] 사전 예약 요청이 접수되었습니다. 확인 후 ${phone}로 연락드리겠습니다.`;
      reserveForm.reset();
    });
  }

  /* 6. FAQ 아코디언 */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (!item) return;
      const willOpen = !item.classList.contains('is-open');
      item.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });

  /* 7. 카카오톡 ID 복사 & 토스트 */
  const toastEl = document.getElementById('toast');
  let toastTimer = null;
  const showToast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 2500);
  };

  document.querySelectorAll('[data-copy-kakao]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const kakaoId = 'gnjurology';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(kakaoId);
        } else {
          const temp = document.createElement('textarea');
          temp.value = kakaoId;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
        }
        showToast('카카오톡 상담 ID (gnjurology)가 복사되었습니다.');
      } catch {
        showToast('카카오톡 ID: gnjurology');
      }
    });
  });
});


/* =========================================================
   SAMPLE A V3 INTERACTIONS (Scoped for home-v3)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.classList.contains('home-v3')) return;

  /* 1. 스크롤 프로그레스 바 & 투명 헤더 전환 */
  const progressBar = document.getElementById('v3Progress');
  const v3Header = document.getElementById('v3Header');
  const onScroll = () => {
    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - doc.clientHeight;
    if (progressBar) {
      const pct = maxScroll > 0 ? (doc.scrollTop / maxScroll) * 100 : 0;
      progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    }
    if (v3Header) {
      v3Header.classList.toggle('is-scrolled', window.scrollY > 40);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 2. 공식 공지 레이어 팝업 2종 */
  const todayKey = new Date().toISOString().slice(0, 10);
  document.querySelectorAll('.v3-popup').forEach((popup) => {
    try {
      if (localStorage.getItem(`v3_hide_${popup.id}`) === todayKey) {
        popup.classList.add('is-hidden');
      }
    } catch {}
  });
  document.querySelectorAll('.v3-popup__close').forEach((btn) => {
    btn.addEventListener('click', () => {
      const popup = btn.closest('.v3-popup');
      if (!popup) return;
      const chk = popup.querySelector('.v3-popup__chk');
      if (chk && chk.checked) {
        try { localStorage.setItem(`v3_hide_${popup.id}`, todayKey); } catch {}
      }
      popup.classList.add('is-hidden');
    });
  });

  /* 3. 100vh 풀스크린 히어로 슬라이더 */
  const heroSlides = Array.from(document.querySelectorAll('.v3-hero__slide'));
  const heroDots = Array.from(document.querySelectorAll('.v3-hero__dot'));
  const heroIndex = document.getElementById('v3HeroIndex');
  const heroEyebrow = document.getElementById('v3HeroEyebrow');
  const heroTitle = document.getElementById('v3HeroTitle');
  const heroDesc = document.getElementById('v3HeroDesc');
  const heroPrev = document.getElementById('v3HeroPrev');
  const heroNext = document.getElementById('v3HeroNext');

  const slideCopy = [
    {
      eyebrow: 'SINCE 1999 · GANGNAM J UROLOGY',
      title: '1999년부터 지켜온<br>비뇨의학 외과 수술의 <em>정밀한 기준</em>',
      desc: '박천진 대표원장과 연세의대 세브란스 교수 출신 이웅희 원장의 2인 전문의 협진 체제로, 프라이빗하고 정밀한 비뇨의학 진료를 약속합니다.'
    },
    {
      eyebrow: '3S · NO3 SURGICAL STANDARD',
      title: '안전하고 간결하며 빠른<br><em>자체 멸균</em> 전용 수술 시스템',
      desc: '최소 국소 신경마취, 실시간 생체 활력증후 모니터링, 수술 중 음악요법(IOM)과 3인 정식 간호사 수술팀이 함께합니다.'
    },
    {
      eyebrow: 'PRIVATE RESERVATION CLINIC',
      title: '프라이버시를 배려한<br><em>독립된 공간</em>과 사전 예약 진료',
      desc: '학동역 8·9번 출구 사이 4층 독립 동선에서 요로결석·전립선 HoLEP·음경임플란트·남성성형까지 원스톱으로 진료합니다.'
    }
  ];

  if (heroSlides.length) {
    let cur = 0;
    let timer = null;

    const goSlide = (n) => {
      cur = (n + heroSlides.length) % heroSlides.length;
      heroSlides.forEach((s, i) => s.classList.toggle('is-active', i === cur));
      heroDots.forEach((d, i) => d.classList.toggle('is-active', i === cur));
      if (heroIndex) heroIndex.textContent = `0${cur + 1}`;
      const copy = slideCopy[cur];
      if (copy) {
        if (heroEyebrow) heroEyebrow.textContent = copy.eyebrow;
        if (heroTitle) heroTitle.innerHTML = copy.title;
        if (heroDesc) heroDesc.textContent = copy.desc;
      }
    };

    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => goSlide(cur + 1), 5500);
    };

    if (heroPrev) heroPrev.addEventListener('click', () => { goSlide(cur - 1); restart(); });
    if (heroNext) heroNext.addEventListener('click', () => { goSlide(cur + 1); restart(); });
    heroDots.forEach((dot, i) => dot.addEventListener('click', () => { goSlide(i); restart(); }));
    goSlide(0);
    restart();
  }

  /* 4. 증상·시술 빠른 검색 라우팅 */
  const searchForm = document.getElementById('v3SearchForm');
  const searchInput = document.getElementById('v3SearchInput');
  if (searchForm && searchInput) {
    const routes = [
      { keys: ['결석', '옆구리', '혈뇨', '쇄석', 'eswl', 'urs', 'rirs'], url: 'pages/stone.html' },
      { keys: ['전립선', '홀렙', 'holep', '유로리프트', 'urolift', '배뇨', '야간뇨', '잔뇨'], url: 'pages/prostate.html' },
      { keys: ['임플란트', '보형물', '콤비', 'combi', '팽창형', '굴곡형'], url: 'pages/implant.html' },
      { keys: ['확대', '성형', '만곡', '이물질', '바세린', '길이', '함몰'], url: 'pages/plastic.html' },
      { keys: ['조루', '발기', '성기능', '도플러', 'rigiscan'], url: 'pages/sexual.html' },
      { keys: ['정관', '무도', '피임', '복원'], url: 'pages/vasectomy.html' },
      { keys: ['포경', '레이저', '소매법', '소대'], url: 'pages/circumcision.html' },
      { keys: ['비급여', '비용', '가격'], url: 'pages/hospital.html?tab=nonbenefit' },
      { keys: ['시간', '위치', '오시는', '의료진', '원장', '박천진', '이웅희'], url: 'pages/hospital.html' }
    ];

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = searchInput.value.trim().toLowerCase();
      if (!q) {
        searchInput.focus();
        return;
      }
      const matched = routes.find((r) => r.keys.some((k) => q.includes(k)));
      window.location.href = matched ? matched.url : 'pages/consult.html?tab=reserve';
    });
  }

  /* 5. 퀵상담 폼 제출 */
  const quickForm = document.getElementById('v3QuickForm');
  const quickFeedback = document.getElementById('v3QuickFeedback');
  if (quickForm && quickFeedback) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('v3Name').value.trim();
      const phone = document.getElementById('v3Phone').value.trim();
      const subject = document.getElementById('v3Subject').value;
      const time = document.getElementById('v3Time').value;
      const agree = document.getElementById('v3Agree').checked;

      if (!name || !phone) {
        quickFeedback.textContent = '성함과 연락처를 입력해 주세요.';
        return;
      }
      if (!agree) {
        quickFeedback.textContent = '개인정보 수집 및 이용에 동의해 주세요.';
        return;
      }
      quickFeedback.textContent = `${name}님, [${subject} · ${time}] 빠른 상담이 접수되었습니다. 순차적으로 ${phone}로 연락드리겠습니다.`;
      quickForm.reset();
    });
  }

  /* 6. 호버 확장형 6대 진료센터 아코디언 */
  const accCards = document.querySelectorAll('.v3-acc-card');
  if (accCards.length) {
    accCards.forEach((card) => {
      const activate = () => {
        accCards.forEach((c) => c.classList.toggle('is-active', c === card));
      };
      card.addEventListener('mouseenter', activate);
      card.addEventListener('focus', activate);
    });
  }

  /* 7. 신뢰 지표 숫자 카운트업 */
  const counters = document.querySelectorAll('[data-count-to]');
  if (counters.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.countTo, 10);
        const start = target > 100 ? target - 30 : 0;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / 900);
          el.textContent = Math.round(start + (target - start) * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        o.unobserve(el);
      });
    }, { threshold: 0.3 });
    counters.forEach((c) => obs.observe(c));
  }

  /* 8. 원내 프라이빗 공간 투어 6컷 */
  const thumbs = document.querySelectorAll('.v3-thumb');
  const tourImg = document.getElementById('v3TourImg');
  const tourTitle = document.getElementById('v3TourTitle');
  const tourDesc = document.getElementById('v3TourDesc');
  if (thumbs.length && tourImg) {
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        thumbs.forEach((t) => t.classList.toggle('is-active', t === thumb));
        tourImg.src = thumb.dataset.src;
        tourImg.alt = thumb.dataset.title || '';
        if (tourTitle) tourTitle.textContent = thumb.dataset.title || '';
        if (tourDesc) tourDesc.textContent = thumb.dataset.desc || '';
      });
    });
  }
});
