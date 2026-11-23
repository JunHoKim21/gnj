document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Reveal
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
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // 2. Main Page Treatment Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  if (tabBtns.length && tabPanels.length) {
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.tab;
        tabBtns.forEach((b) => {
          const active = b.dataset.tab === key;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-selected', String(active));
        });
        tabPanels.forEach((p) => {
          const active = p.id === `panel-${key}`;
          p.classList.toggle('is-active', active);
          p.hidden = !active;
        });
      });
    });
  }

  // 3. Subpage Tabs with ?tab= Query Parameter Support
  const subTabBtns = document.querySelectorAll('.sub-tab-btn');
  const subPanels = document.querySelectorAll('.sub-panel');
  if (subTabBtns.length && subPanels.length) {
    function activateSubTab(tabKey) {
      let matched = false;
      subTabBtns.forEach((btn) => {
        const active = btn.dataset.subtab === tabKey;
        if (active) matched = true;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', String(active));
      });
      subPanels.forEach((panel) => {
        const active = panel.id === `sub-${tabKey}`;
        panel.hidden = !active;
      });
      if (!matched && subTabBtns[0]) {
        const firstKey = subTabBtns[0].dataset.subtab;
        activateSubTab(firstKey);
      }
    }

    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get('tab');
    if (initialTab) {
      activateSubTab(initialTab);
    }

    subTabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.subtab;
        activateSubTab(key);
        if (window.history && window.history.replaceState) {
          const url = new URL(window.location.href);
          url.searchParams.set('tab', key);
          window.history.replaceState({}, '', url.toString());
        }
      });
    });
  }

  // 4. Mobile Drawer
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileMenuBtn?.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
  }

  mobileMenuBtn?.addEventListener('click', openDrawer);
  mobileDrawerClose?.addEventListener('click', closeDrawer);
  mobileDrawer?.addEventListener('click', (e) => {
    if (e.target === mobileDrawer) closeDrawer();
  });

  // 5. Non-Benefit Fee Modal & Filter
  const feeModal = document.getElementById('feeModal');
  const feeModalClose = document.getElementById('feeModalClose');
  const filterChips = document.querySelectorAll('.filter-chip');
  const feeRows = document.querySelectorAll('#feeTable tbody tr');

  function openFeeModal() {
    if (!feeModal) return;
    closeDrawer();
    feeModal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeFeeModal() {
    if (!feeModal) return;
    feeModal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.js-open-fee-modal').forEach((btn) => {
    btn.addEventListener('click', openFeeModal);
  });
  feeModalClose?.addEventListener('click', closeFeeModal);
  feeModal?.addEventListener('click', (e) => {
    if (e.target === feeModal) closeFeeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && feeModal && !feeModal.hidden) {
      closeFeeModal();
    }
  });

  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cat = chip.dataset.feeCat;
      filterChips.forEach((c) => c.classList.toggle('is-active', c === chip));
      feeRows.forEach((row) => {
        row.hidden = cat !== 'all' && row.dataset.cat !== cat;
      });
    });
  });

  // 6. Toast & KakaoTalk ID Copy
  const toastEl = document.getElementById('toast');
  let toastTimer = null;

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('is-show');
    }, 2400);
  }

  document.querySelectorAll('.js-copy-kakao').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const kakaoId = 'gnjurology';
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(kakaoId);
        } else {
          const temp = document.createElement('input');
          temp.value = kakaoId;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
        }
        showToast('카카오톡 ID (gnjurology)가 복사되었습니다.');
      } catch {
        showToast('카카오톡 ID: gnjurology');
      }
    });
  });

  // 7. Consultation Form
  const consultForm = document.getElementById('consultForm');
  const formStatus = document.getElementById('formStatus');

  consultForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cName')?.value.trim();
    const phone = document.getElementById('cPhone')?.value.trim();
    const category = document.getElementById('cCategory')?.value;
    const message = document.getElementById('cMessage')?.value.trim();
    const agree = document.getElementById('cAgree')?.checked;

    if (!name || !phone || !category || !message) {
      if (formStatus) formStatus.textContent = '성함, 연락처, 진료분야, 문의내용을 모두 입력해 주세요.';
      return;
    }
    if (!agree) {
      if (formStatus) formStatus.textContent = '개인정보 수집 및 이용 동의가 필요합니다.';
      return;
    }

    if (formStatus) {
      formStatus.textContent = `${name}님의 [${category}] 상담 예약 요청이 접수되었습니다. 순차적으로 연락드리겠습니다.`;
    }
    consultForm.reset();
    showToast('상담 예약 요청이 접수되었습니다.');
  });
});


/* =========================================================
   SAMPLE B V2 INTERACTIONS
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  /* 1. 서브페이지 1:1 비공개 수술상담 폼 (consult.html) */
  const bExpertForm = document.getElementById('bExpertForm');
  const bExpertStatus = document.getElementById('bExpertStatus');
  if (bExpertForm && bExpertStatus) {
    bExpertForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('beName').value.trim();
      const phone = document.getElementById('bePhone').value.trim();
      const cat = document.getElementById('beCategory').value;
      const content = document.getElementById('beContent').value.trim();
      const agree = document.getElementById('beAgree').checked;

      if (!name || !phone || !cat || !content) {
        bExpertStatus.textContent = '성함, 연락처, 상담 분야, 상담 내용을 모두 입력해 주세요.';
        bExpertStatus.style.color = '#DC2626';
        return;
      }
      if (!agree) {
        bExpertStatus.textContent = '개인정보 수집 및 이용에 동의해 주세요.';
        bExpertStatus.style.color = '#DC2626';
        return;
      }
      bExpertStatus.textContent = `${name}님의 [${cat}] 1:1 비공개 수술상담이 접수되었습니다. 확인 후 ${phone}로 회신드리겠습니다.`;
      bExpertStatus.style.color = '#0284C7';
      bExpertForm.reset();
    });
  }

  if (!document.body.classList.contains('home-b2')) return;

  const todayKey = new Date().toISOString().slice(0, 10);

  /* 2. 상단 공지 띠배너 */
  const topNotice = document.getElementById('b2TopNotice');
  const closeNotice = document.getElementById('b2CloseNotice');
  const hideNoticeToday = document.getElementById('b2HideNoticeToday');
  try {
    if (topNotice && localStorage.getItem('b2_hide_notice') === todayKey) {
      topNotice.classList.add('is-hidden');
      document.body.classList.add('notice-closed');
    }
  } catch {}

  const dismissNotice = (saveToday) => {
    if (!topNotice) return;
    topNotice.classList.add('is-hidden');
    document.body.classList.add('notice-closed');
    if (saveToday) {
      try { localStorage.setItem('b2_hide_notice', todayKey); } catch {}
    }
  };
  closeNotice?.addEventListener('click', () => dismissNotice(false));
  hideNoticeToday?.addEventListener('click', () => dismissNotice(true));

  /* 3. 스크롤 프로그레스바 & 투명 헤더 전환 */
  const progressBar = document.getElementById('b2Progress');
  const header = document.getElementById('b2Header');
  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    if (progressBar) {
      progressBar.style.width = `${max > 0 ? Math.min(100, (doc.scrollTop / max) * 100) : 0}%`;
    }
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 36);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 4. 공식 공지 레이어 팝업 2종 */
  document.querySelectorAll('.b2-popup').forEach((p) => {
    try {
      if (localStorage.getItem(`b2_hide_${p.id}`) === todayKey) p.classList.add('is-hidden');
    } catch {}
  });
  document.querySelectorAll('.b2-popup__close').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = btn.closest('.b2-popup');
      if (!p) return;
      const chk = p.querySelector('.b2-popup__chk');
      if (chk && chk.checked) {
        try { localStorage.setItem(`b2_hide_${p.id}`, todayKey); } catch {}
      }
      p.classList.add('is-hidden');
    });
  });

  /* 5. 100vh 풀스크린 히어로 슬라이더 */
  const slides = Array.from(document.querySelectorAll('.b2-hero__slide'));
  const idxEl = document.getElementById('b2HeroIdx');
  const prevBtn = document.getElementById('b2HeroPrev');
  const nextBtn = document.getElementById('b2HeroNext');
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

  /* 6. 장비·인프라 쇼케이스 슬라이더 탭 */
  const devTabs = document.querySelectorAll('.b2-device-tab');
  const devSlides = document.querySelectorAll('.b2-device-slide');
  if (devTabs.length && devSlides.length) {
    devTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.device;
        devTabs.forEach((t) => t.classList.toggle('is-active', t === tab));
        devSlides.forEach((s) => s.classList.toggle('is-active', s.dataset.devicePanel === key));
      });
    });
  }

  /* 7. 하단 간편 예약 바 */
  const qForm = document.getElementById('b2QuickForm');
  const qFeedback = document.getElementById('b2QuickFeedback');
  if (qForm && qFeedback) {
    qForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('b2Name').value.trim();
      const phone = document.getElementById('b2Phone').value.trim();
      const subj = document.getElementById('b2Subject').value;
      const time = document.getElementById('b2Time').value;
      const agree = document.getElementById('b2Agree').checked;
      if (!name || !phone) {
        qFeedback.textContent = '성함과 연락처를 입력해 주세요.';
        return;
      }
      if (!agree) {
        qFeedback.textContent = '개인정보 수집 및 이용에 동의해 주세요.';
        return;
      }
      qFeedback.textContent = `${name}님, [${subj} · ${time}] 사전 예약이 접수되었습니다. 확인 후 ${phone}로 연락드리겠습니다.`;
      qForm.reset();
    });
  }
});
