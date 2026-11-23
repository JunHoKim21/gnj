'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================
     1. 헤더 스크롤 전환 (투명 -> 솔리드 #161513)
  ========================================================= */
  const siteHeader = document.getElementById('siteHeader');
  const handleScrollHeader = () => {
    if (!siteHeader || siteHeader.classList.contains('solid-always')) return;
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  handleScrollHeader();
  window.addEventListener('scroll', handleScrollHeader, { passive: true });

  /* =========================================================
     2. 모바일 드로어 메뉴
  ========================================================= */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  const toggleDrawer = (open) => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.toggle('open', open);
    mobileDrawer.setAttribute('aria-hidden', String(!open));
    mobileMenuBtn?.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  mobileMenuBtn?.addEventListener('click', () => toggleDrawer(true));
  mobileCloseBtn?.addEventListener('click', () => toggleDrawer(false));
  mobileDrawer?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  /* =========================================================
     3. 스크롤 페이드인 (IntersectionObserver)
  ========================================================= */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* =========================================================
     4. 서브페이지 ?tab= 파라미터 & 탭 전환
  ========================================================= */
  const tabButtons = document.querySelectorAll('.sub-tab-btn[data-tab]');
  const tabPanels = document.querySelectorAll('.tab-panel[data-tab-panel]');

  const activateTab = (tabName, updateUrl = false) => {
    if (!tabButtons.length || !tabPanels.length) return;
    let matched = false;
    tabButtons.forEach((btn) => {
      const isMatch = btn.dataset.tab === tabName;
      btn.classList.toggle('active', isMatch);
      if (isMatch) matched = true;
    });

    if (!matched) {
      tabName = tabButtons[0].dataset.tab;
      tabButtons[0].classList.add('active');
    }

    tabPanels.forEach((panel) => {
      const active = panel.dataset.tabPanel === tabName;
      panel.classList.toggle('active', active);
      if (active) {
        panel.querySelectorAll('.reveal').forEach((r) => r.classList.add('is-visible'));
      }
    });

    if (updateUrl && window.history?.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabName);
      window.history.replaceState({}, '', url.toString());
    }
  };

  if (tabButtons.length) {
    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get('tab') || tabButtons[0].dataset.tab;
    activateTab(initialTab, false);

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        activateTab(btn.dataset.tab, true);
        window.scrollTo({ top: 180, behavior: 'smooth' });
      });
    });
  }

  /* =========================================================
     5. 원내 공간 갤러리 가로 슬라이더
  ========================================================= */
  const galleryViewport = document.getElementById('galleryViewport');
  const galleryTrack = document.getElementById('galleryTrack');
  const galleryPrev = document.getElementById('galleryPrev');
  const galleryNext = document.getElementById('galleryNext');
  const galleryCounter = document.getElementById('galleryCounter');
  const slides = galleryTrack ? Array.from(galleryTrack.querySelectorAll('.gallery-slide')) : [];
  let currentSlide = 0;

  const updateSlider = () => {
    if (!slides.length || !galleryTrack || !galleryViewport) return;
    const gap = 24;
    const slideWidth = slides[0].getBoundingClientRect().width + gap;
    const maxOffset = Math.max(0, galleryTrack.scrollWidth - galleryViewport.clientWidth);
    const targetOffset = Math.min(currentSlide * slideWidth, maxOffset);
    galleryTrack.style.transform = `translateX(-${targetOffset}px)`;
    if (galleryCounter) {
      galleryCounter.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    }
  };

  galleryPrev?.addEventListener('click', () => {
    currentSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
    updateSlider();
  });

  galleryNext?.addEventListener('click', () => {
    currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
    updateSlider();
  });

  let touchStartX = 0;
  galleryViewport?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  galleryViewport?.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
      } else {
        currentSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
      }
      updateSlider();
    }
  }, { passive: true });

  window.addEventListener('resize', updateSlider);

  /* =========================================================
     6. 토스트 알림 & 카카오톡 ID 복사
  ========================================================= */
  const toastEl = document.getElementById('toastMsg');
  let toastTimer = null;

  const showToast = (message) => {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  };

  const copyKakaoId = async () => {
    const kakaoId = 'gnjurology';
    try {
      await navigator.clipboard.writeText(kakaoId);
      showToast(`카카오톡 ID '${kakaoId}'가 복사되었습니다.`);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = kakaoId;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(`카카오톡 ID '${kakaoId}'가 복사되었습니다.`);
    }
  };

  document.getElementById('copyKakaoFloat')?.addEventListener('click', copyKakaoId);
  document.getElementById('copyKakaoInline')?.addEventListener('click', copyKakaoId);

  /* =========================================================
     7. TOP 플로팅 버튼
  ========================================================= */
  document.getElementById('scrollTopBtn')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =========================================================
     8. 비급여 모달 & 테이블 필터 (모달/페이지 공용)
  ========================================================= */
  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
  });

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal(backdrop.id);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach((m) => closeModal(m.id));
    }
  });

  ['openFeeModalTop', 'openFeeModalMobile', 'openFeeModalMain', 'openFeeModalFooter'].forEach((id) => {
    document.getElementById(id)?.addEventListener('click', () => {
      if (mobileDrawer?.classList.contains('open')) toggleDrawer(false);
      if (document.getElementById('feeModal')) {
        openModal('feeModal');
      } else {
        const isInPages = window.location.pathname.includes('/pages/');
        window.location.href = (isInPages ? '' : 'pages/') + 'hospital.html?tab=nonbenefit';
      }
    });
  });

  document.querySelectorAll('[data-fee-filter-group]').forEach((tabGroup) => {
    const tableId = tabGroup.dataset.feeFilterGroup;
    const rows = document.querySelectorAll(`#${tableId} tbody tr`);
    tabGroup.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      tabGroup.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      rows.forEach((row) => {
        if (filter === 'all' || row.dataset.cat === filter) {
          row.classList.remove('hidden-row');
        } else {
          row.classList.add('hidden-row');
        }
      });
    });
  });

  /* =========================================================
     9. FAQ 아코디언
  ========================================================= */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      item?.classList.toggle('open');
    });
  });

  /* =========================================================
     10. 프라이빗 간편 상담 4개 필드 폼 처리
  ========================================================= */
  const consultForm = document.getElementById('consultForm');
  const formFeedback = document.getElementById('formFeedback');

  consultForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('consultName').value.trim();
    const phone = document.getElementById('consultPhone').value.trim();
    const category = document.getElementById('consultCategory').value;
    const message = document.getElementById('consultMessage').value.trim();

    if (!name || !phone || !category || !message) {
      formFeedback.textContent = '성함, 연락처, 관심 진료 분야, 상담 내용을 모두 입력해 주세요.';
      return;
    }

    formFeedback.textContent = `${name}님의 비공개 상담 요청이 접수되었습니다. 확인 후 ${phone}으로 순차 안내드리겠습니다. (빠른 예약 확인: 02-3018-7575)`;
    showToast('비공개 상담 신청이 접수되었습니다.');
    consultForm.reset();
  });
});


/* =========================================================
   SAMPLE C V2 INTERACTIONS
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  /* 1. 서브페이지 1:1 비공개 수술상담 폼 (consult.html) */
  const cExpertForm = document.getElementById('cExpertForm');
  const cExpertFeedback = document.getElementById('cExpertFeedback');
  if (cExpertForm && cExpertFeedback) {
    cExpertForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('ceName').value.trim();
      const phone = document.getElementById('cePhone').value.trim();
      const cat = document.getElementById('ceCategory').value;
      const content = document.getElementById('ceContent').value.trim();
      const agree = document.getElementById('ceAgree').checked;

      if (!name || !phone || !cat || !content) {
        cExpertFeedback.textContent = '성함, 연락처, 상담 분야, 상담 내용을 모두 입력해 주세요.';
        cExpertFeedback.style.color = '#B91C1C';
        return;
      }
      if (!agree) {
        cExpertFeedback.textContent = '개인정보 수집 및 이용에 동의해 주세요.';
        cExpertFeedback.style.color = '#B91C1C';
        return;
      }
      cExpertFeedback.textContent = `${name}님의 [${cat}] 1:1 비공개 수술상담이 접수되었습니다. 확인 후 ${phone}로 회신드리겠습니다.`;
      cExpertFeedback.style.color = '#8C6D3F';
      cExpertForm.reset();
    });
  }

  if (!document.body.classList.contains('home-c3')) return;

  /* 2. 스크롤 프로그레스바 */
  const progress = document.getElementById('c3Progress');
  if (progress) {
    window.addEventListener('scroll', () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      progress.style.width = `${max > 0 ? Math.min(100, (doc.scrollTop / max) * 100) : 0}%`;
    }, { passive: true });
  }

  /* 3. 공식 공지 레이어 팝업 2종 */
  const todayKey = new Date().toISOString().slice(0, 10);
  document.querySelectorAll('.c3-popup').forEach((p) => {
    try {
      if (localStorage.getItem(`c3_hide_${p.id}`) === todayKey) p.classList.add('is-hidden');
    } catch {}
  });
  document.querySelectorAll('.c3-popup__close').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = btn.closest('.c3-popup');
      if (!p) return;
      const chk = p.querySelector('.c3-popup__chk');
      if (chk && chk.checked) {
        try { localStorage.setItem(`c3_hide_${p.id}`, todayKey); } catch {}
      }
      p.classList.add('is-hidden');
    });
  });

  /* 4. 100vh 캐러셀 히어로 */
  const slides = Array.from(document.querySelectorAll('.c3-hero__slide'));
  const numEl = document.getElementById('c3HeroNum');
  const fillEl = document.getElementById('c3HeroFill');
  const prevBtn = document.getElementById('c3HeroPrev');
  const nextBtn = document.getElementById('c3HeroNext');
  if (slides.length) {
    let cur = 0;
    let timer = null;
    const go = (n) => {
      cur = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === cur));
      if (numEl) numEl.textContent = `0${cur + 1} — 0${slides.length}`;
      if (fillEl) fillEl.style.width = `${((cur + 1) / slides.length) * 100}%`;
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

  /* 5. 언더라인 퀵상담 바 */
  const qForm = document.getElementById('c3QuickForm');
  const qFeedback = document.getElementById('c3QuickFeedback');
  if (qForm && qFeedback) {
    qForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('c3Name').value.trim();
      const phone = document.getElementById('c3Phone').value.trim();
      const subj = document.getElementById('c3Subject').value;
      const time = document.getElementById('c3Time').value;
      const agree = document.getElementById('c3Agree').checked;
      if (!name || !phone) {
        qFeedback.textContent = '성함과 연락처를 입력해 주세요.';
        return;
      }
      if (!agree) {
        qFeedback.textContent = '개인정보 수집 및 이용에 동의해 주세요.';
        return;
      }
      qFeedback.textContent = `${name}님, [${subj} · ${time}] 빠른 상담이 접수되었습니다. 순차적으로 ${phone}로 연락드리겠습니다.`;
      qForm.reset();
    });
  }
});
