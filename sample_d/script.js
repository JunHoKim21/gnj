document.addEventListener('DOMContentLoaded', () => {
  /* 1. Sidebar & Mobile Drawer Accordion */
  document.querySelectorAll('.nav-group__head').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.nav-group');
      group?.classList.toggle('is-open');
    });
  });

  const mobileDrawer = document.getElementById('mobileDrawer');
  const openDrawerBtn = document.getElementById('openDrawerBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const closeDrawerBackdrop = document.getElementById('closeDrawerBackdrop');

  const toggleDrawer = (open) => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.toggle('is-open', open);
    mobileDrawer.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  openDrawerBtn?.addEventListener('click', () => toggleDrawer(true));
  closeDrawerBtn?.addEventListener('click', () => toggleDrawer(false));
  closeDrawerBackdrop?.addEventListener('click', () => toggleDrawer(false));

  /* 2. URL ?tab= Parameter & Subpage Tab Switching */
  const subTabs = document.querySelectorAll('.sub-tab');
  const tabPanels = document.querySelectorAll('.tab-panel');

  const activateTab = (tabId) => {
    if (!tabId || subTabs.length === 0) return;
    let found = false;
    subTabs.forEach((t) => {
      const match = t.dataset.tab === tabId;
      t.classList.toggle('is-active', match);
      if (match) found = true;
    });
    tabPanels.forEach((p) => {
      p.classList.toggle('is-active', p.id === `tab-${tabId}`);
    });
    if (!found && subTabs[0]) {
      subTabs[0].click();
    }
  };

  if (subTabs.length > 0) {
    subTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const id = tab.dataset.tab;
        activateTab(id);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', id);
        window.history.replaceState({}, '', url);
      });
    });

    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get('tab');
    if (initialTab) {
      activateTab(initialTab);
    }
  }

  /* 3. Horizontal Slider (Main Page) */
  const track = document.getElementById('sliderTrack');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const counterEl = document.getElementById('sliderCounter');
  const slides = track ? Array.from(track.children) : [];
  let currentIndex = 0;

  const getVisible = () => {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1099) return 2;
    return 3;
  };

  const updateSlider = () => {
    if (!track || slides.length === 0) return;
    const maxIdx = Math.max(0, slides.length - getVisible());
    if (currentIndex > maxIdx) currentIndex = 0;
    if (currentIndex < 0) currentIndex = maxIdx;
    const w = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * (w + 18)}px)`;
    if (counterEl) {
      counterEl.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    }
  };

  prevBtn?.addEventListener('click', () => {
    const maxIdx = Math.max(0, slides.length - getVisible());
    currentIndex = currentIndex <= 0 ? maxIdx : currentIndex - 1;
    updateSlider();
  });

  nextBtn?.addEventListener('click', () => {
    const maxIdx = Math.max(0, slides.length - getVisible());
    currentIndex = currentIndex >= maxIdx ? 0 : currentIndex + 1;
    updateSlider();
  });

  window.addEventListener('resize', updateSlider);
  updateSlider();

  /* 4. Non-benefit Fee Table Filter (hospital.html) */
  const feeTabs = document.querySelectorAll('.fee-tab');
  const feeRows = document.querySelectorAll('#feeTable tbody tr');

  feeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      feeTabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const cat = tab.dataset.cat;
      feeRows.forEach((row) => {
        row.style.display = (cat === 'all' || row.dataset.cat === cat) ? '' : 'none';
      });
    });
  });

  /* 5. Video Modal */
  const videoModal = document.getElementById('videoModal');
  const videoContainer = document.getElementById('videoContainer');
  const videoModalTitle = document.getElementById('videoModalTitle');

  const closeVideoModal = () => {
    videoModal?.classList.remove('is-open');
    if (videoContainer) videoContainer.innerHTML = '';
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.js-play-video').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.videoId;
      const title = btn.dataset.videoTitle || '강남J비뇨기과 영상';
      if (videoModalTitle) videoModalTitle.textContent = title;
      if (videoContainer && id) {
        videoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1" title="${title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      }
      videoModal?.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  document.querySelectorAll('.js-close-modal').forEach((el) => {
    el.addEventListener('click', closeVideoModal);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeVideoModal();
      toggleDrawer(false);
    }
  });

  /* 6. Toast & Kakao ID Copy ('gnjurology') */
  const toastEl = document.getElementById('toast');
  let toastTimer = null;

  const showToast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 2400);
  };

  document.querySelectorAll('.js-copy-kakao').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const kakaoId = 'gnjurology';
      try {
        await navigator.clipboard.writeText(kakaoId);
        showToast('카카오톡 ID (gnjurology)가 복사되었습니다.');
      } catch {
        const temp = document.createElement('textarea');
        temp.value = kakaoId;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast('카카오톡 ID (gnjurology)가 복사되었습니다.');
      }
    });
  });

  /* 7. Reservation Form (4 Fields) */
  const resForm = document.getElementById('reservationForm');
  const formFeedback = document.getElementById('formFeedback');

  resForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('resName')?.value.trim();
    const phone = document.getElementById('resPhone')?.value.trim();
    const dept = document.getElementById('resDept')?.value;
    const memo = document.getElementById('resMemo')?.value.trim();
    if (!name || !phone || !dept || !memo) return;

    if (formFeedback) {
      formFeedback.className = 'form-feedback is-success';
      formFeedback.textContent = `${name}님, [${dept}] 사전 예약 문의가 접수되었습니다. 확인 후 ${phone}으로 순차 안내드리겠습니다. (빠른 문의: 02-3018-7575)`;
    }
    resForm.reset();
    showToast('간편 예약 문의가 접수되었습니다.');
  });

  /* 8. Scroll Reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
});


/* =========================================================
   SAMPLE D V2 INTERACTIONS
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  /* 1. 서브페이지 1:1 비공개 수술상담 폼 (consult.html) */
  const dExpertForm = document.getElementById('dExpertForm');
  const dExpertFeedback = document.getElementById('dExpertFeedback');
  if (dExpertForm && dExpertFeedback) {
    dExpertForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('deName').value.trim();
      const phone = document.getElementById('dePhone').value.trim();
      const cat = document.getElementById('deCategory').value;
      const content = document.getElementById('deContent').value.trim();
      const agree = document.getElementById('deAgree').checked;
      if (!name || !phone || !cat || !content) {
        dExpertFeedback.textContent = '성함, 연락처, 상담 분야, 상담 내용을 모두 입력해 주세요.';
        dExpertFeedback.style.color = '#DC2626';
        return;
      }
      if (!agree) {
        dExpertFeedback.textContent = '개인정보 수집 및 이용에 동의해 주세요.';
        dExpertFeedback.style.color = '#DC2626';
        return;
      }
      dExpertFeedback.textContent = `${name}님의 [${cat}] 1:1 비공개 수술상담이 접수되었습니다. 확인 후 ${phone}로 회신드리겠습니다.`;
      dExpertFeedback.style.color = '#163A6B';
      dExpertForm.reset();
    });
  }

  if (!document.body.classList.contains('home-d1')) return;

  /* 2. 스크롤 프로그레스바 */
  const pBar = document.getElementById('d1ProgressBar');
  if (pBar) {
    window.addEventListener('scroll', () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      pBar.style.width = `${max > 0 ? Math.min(100, (doc.scrollTop / max) * 100) : 0}%`;
    }, { passive: true });
  }

  /* 3. 공지 팝업 2종 */
  const todayKey = new Date().toISOString().slice(0, 10);
  document.querySelectorAll('.d1-popup').forEach((p) => {
    try {
      if (localStorage.getItem(`d1_hide_${p.id}`) === todayKey) p.classList.add('is-hidden');
    } catch {}
  });
  document.querySelectorAll('.d1-popup__close').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = btn.closest('.d1-popup');
      if (!p) return;
      const chk = p.querySelector('.d1-popup__chk');
      if (chk && chk.checked) {
        try { localStorage.setItem(`d1_hide_${p.id}`, todayKey); } catch {}
      }
      p.classList.add('is-hidden');
    });
  });

  /* 4. 우측 풀폭 히어로 슬라이더 */
  const slides = Array.from(document.querySelectorAll('.d1-hero__slide'));
  const idxEl = document.getElementById('d1HeroIdx');
  const prevBtn = document.getElementById('d1HeroPrev');
  const nextBtn = document.getElementById('d1HeroNext');
  if (slides.length) {
    let cur = 0;
    let timer = null;
    const go = (n) => {
      cur = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === cur));
      if (idxEl) idxEl.textContent = `0${cur + 1}`;
    };
    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => go(cur + 1), 5500);
    };
    prevBtn?.addEventListener('click', () => { go(cur - 1); restart(); });
    nextBtn?.addEventListener('click', () => { go(cur + 1); restart(); });
    go(0);
    restart();
  }

  /* 5. 증상 빠른 검색 라우팅 */
  const sForm = document.getElementById('d1SearchForm');
  const sInput = document.getElementById('d1SearchInput');
  if (sForm && sInput) {
    const routes = [
      { keys: ['결석', '옆구리', '혈뇨', '쇄석', 'eswl', 'urs', 'rirs'], url: 'pages/stone.html' },
      { keys: ['전립선', '홀렙', 'holep', '유로리프트', '배뇨', '야간뇨', '잔뇨'], url: 'pages/prostate.html' },
      { keys: ['임플란트', '보형물', '콤비', 'combi'], url: 'pages/implant.html' },
      { keys: ['확대', '성형', '만곡', '이물질', '바세린', '함몰'], url: 'pages/plastic.html' },
      { keys: ['조루', '발기', '성기능', '도플러', '진동각'], url: 'pages/sexual.html' },
      { keys: ['정관', '무도', '복원'], url: 'pages/vasectomy.html' },
      { keys: ['포경', '레이저', '소매법'], url: 'pages/circumcision.html' },
      { keys: ['비급여', '비용', '시간', '위치', '원장'], url: 'pages/hospital.html' }
    ];
    sForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = sInput.value.trim().toLowerCase();
      if (!q) { sInput.focus(); return; }
      const hit = routes.find((r) => r.keys.some((k) => q.includes(k)));
      window.location.href = hit ? hit.url : 'pages/consult.html?tab=reserve';
    });
  }

  /* 6. 1분 증상 자가체크 */
  const checkData = {
    prostate: {
      title: '전립선 클리닉 (HoLEP · 유로리프트)',
      desc: '소변 줄기가 가늘어지거나 야간뇨·잔뇨감이 지속된다면 전립선비대증 정밀 진단 후 약물, 유로리프트(결찰술), HoLEP 홀뮴레이저 적출술 중 맞춤 치료를 안내합니다.',
      href: 'pages/prostate.html'
    },
    stone: {
      title: '요로결석 클리닉 (전용 장비 7종)',
      desc: '갑작스러운 옆구리·하복부 통증과 혈뇨가 있다면 KUB·초음파·CT 영상 진단 후 ESWL(체외충격파쇄석술) 또는 URS·RIRS 내시경 결석제거술을 시행합니다.',
      href: 'pages/stone.html'
    },
    implant: {
      title: '음경임플란트 · COMBI-OPERATION',
      desc: '약물치료에 반응하지 않는 발기부전의 수술적 해결을 돕는 AMS Spectra 굴곡형·3-Piece 팽창형 보형물 및 전립선 HoLEP 동시 수술을 시행합니다.',
      href: 'pages/implant.html'
    },
    plastic: {
      title: '남성성형 · 만곡증 · 이물질 제거',
      desc: 'SGA 귀두직하확대, NPA 음경확대, 주름법·기하학적 백막이식술 만곡증 교정 및 바세린·파라핀 등 이물질 제거와 피부이식 재건을 시행합니다.',
      href: 'pages/plastic.html'
    },
    sexual: {
      title: '성기능장애 · 정관 · 포경 클리닉',
      desc: '성기능검사·음경혈관 도플러검사·진동각검사 등 객관적 진단을 바탕으로 조루·발기부전 치료, 2mm 무도정관수술, 레이저 포경수술을 안내합니다.',
      href: 'pages/sexual.html'
    }
  };
  const cChips = document.querySelectorAll('.d1-check-chip');
  const cTitle = document.getElementById('d1CheckTitle');
  const cDesc = document.getElementById('d1CheckDesc');
  const cLink = document.getElementById('d1CheckLink');
  if (cChips.length) {
    cChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const d = checkData[chip.dataset.check];
        if (!d) return;
        cChips.forEach((c) => c.classList.toggle('is-active', c === chip));
        if (cTitle) cTitle.textContent = d.title;
        if (cDesc) cDesc.textContent = d.desc;
        if (cLink) cLink.href = d.href;
      });
    });
  }

  /* 7. 호버 확장형 6대 진료센터 아코디언 */
  const accCards = document.querySelectorAll('.d1-acc-card');
  if (accCards.length) {
    accCards.forEach((card) => {
      const act = () => accCards.forEach((c) => c.classList.toggle('is-active', c === card));
      card.addEventListener('mouseenter', act);
      card.addEventListener('focus', act);
    });
  }

  /* 8. 하단 간편 예약 바 */
  const qForm = document.getElementById('d1QuickForm');
  const qFeedback = document.getElementById('d1QuickFeedback');
  if (qForm && qFeedback) {
    qForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('d1Name').value.trim();
      const phone = document.getElementById('d1Phone').value.trim();
      const subj = document.getElementById('d1Subject').value;
      const time = document.getElementById('d1Time').value;
      const agree = document.getElementById('d1Agree').checked;
      if (!name || !phone) {
        qFeedback.textContent = '성함과 연락처를 입력해 주세요.';
        return;
      }
      if (!agree) {
        qFeedback.textContent = '개인정보 수집 및 이용에 동의해 주세요.';
        return;
      }
      qFeedback.textContent = `${name}님, [${subj} · ${time}] 빠른 예약이 접수되었습니다. 확인 후 ${phone}로 연락드리겠습니다.`;
      qForm.reset();
    });
  }
});
