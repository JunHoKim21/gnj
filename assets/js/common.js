(function () {
  // 1. Scroll Progress & Header State
  const progressBar = document.getElementById('progress_bar');
  const header = document.getElementById('gnj-hd');
  let lastY = window.scrollY;

  if (progressBar && header) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const maxH = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (maxH > 0 ? (y / maxH) * 100 : 0) + '%';
      if (y > 60) {
        header.classList.add('gnj--sc');
        if (y > lastY && y > 220) {
          header.classList.add('gnj--hide');
          header.classList.remove('gnj--peek');
        } else {
          header.classList.remove('gnj--hide');
          header.classList.add('gnj--peek');
        }
      } else {
        header.classList.remove('gnj--sc', 'gnj--hide', 'gnj--peek');
      }
      lastY = y;
    }, { passive: true });
  }

  // 2. Top Notice Bar
  const notice = document.getElementById('topNotice');
  if (notice) {
    const closeNotice = () => {
      notice.classList.add('is-hidden');
      document.body.classList.add('notice-closed');
    };
    if (localStorage.getItem('gnj_hide_notice') === new Date().toDateString()) closeNotice();
    document.getElementById('closeNotice')?.addEventListener('click', closeNotice);
    document.getElementById('hideNoticeToday')?.addEventListener('click', () => {
      localStorage.setItem('gnj_hide_notice', new Date().toDateString());
      closeNotice();
    });
  }

  // 3. Mobile Drawer
  const drawer = document.getElementById('mobileDrawer');
  if (drawer) {
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => drawer.classList.add('is-open'));
    document.getElementById('mobileDrawerClose')?.addEventListener('click', () => drawer.classList.remove('is-open'));
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('is-open')));
  }

  // 4. Copy Address & Floating UI
  document.getElementById('copyAddrBtn')?.addEventListener('click', async () => {
    const txt = '서울시 강남구 학동로 203 4F';
    try { await navigator.clipboard.writeText(txt); alert('병원 주소가 복사되었습니다: ' + txt); }
    catch { alert(txt); }
  });
  document.getElementById('scrollTopBtn')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const quickList = document.getElementById('quickList');
  const quickToggle = document.getElementById('quickToggle');
  quickToggle?.addEventListener('click', () => {
    const collapsed = quickList.classList.toggle('is-collapsed');
    quickToggle.textContent = collapsed ? '+' : '×';
  });

  // 5. Subpage Tabs (supports ?tab=xxx query parameter)
  const subTabs = Array.from(document.querySelectorAll('.sub-tab[data-tab]'));
  const subPanels = Array.from(document.querySelectorAll('.sub-panel[data-panel]'));
  if (subTabs.length && subPanels.length) {
    const activateTab = (tabId) => {
      subTabs.forEach(t => t.classList.toggle('is-active', t.dataset.tab === tabId));
      subPanels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === tabId));
    };
    subTabs.forEach(t => t.addEventListener('click', () => activateTab(t.dataset.tab)));
    const qTab = new URLSearchParams(window.location.search).get('tab');
    if (qTab && subTabs.some(t => t.dataset.tab === qTab)) activateTab(qTab);
  }

  // 6. Common Consultation & Kakao Modal
  const modal = document.getElementById('gnjModal');
  if (modal) {
    const mEyebrow = document.getElementById('modalEyebrow');
    const mTitle = document.getElementById('modalTitle');
    const mBody = document.getElementById('modalBody');

    const modalData = {
      kakao: {
        e: 'KAKAO TALK CONSULTATION',
        t: '카카오톡 상담 안내',
        b: '카카오톡 친구찾기에서 ID <strong>gnjurology</strong> 를 검색해 주세요.<br/><br/>• 상담시간: 월~금 09:00 ~ 18:00 / 토요일 09:00 ~ 13:00<br/>• 모바일·문자상담: <strong>010-9190-7575</strong> (상담시간 외 문자 남겨주시면 순차 상담)'
      },
      consult: {
        e: 'ONLINE CONSULTATION',
        t: '온라인 간편 상담 · 예약',
        b: `<p>평일 오전진료는 예약제로만 진행되며, 오후 진료도 예약우선제를 시행합니다.</p>
            <form class="gnj-form" id="consultForm">
              <input type="text" class="gnj-input" placeholder="성함 (가명 가능)" required />
              <input type="tel" class="gnj-input" placeholder="연락처 (예: 010-0000-0000)" required />
              <select class="gnj-select" id="consultCategory">
                <option value="요로결석">진료분야: 요로결석</option>
                <option value="전립선">진료분야: 전립선 (HoLEP/유로리프트)</option>
                <option value="음경임플란트">진료분야: 음경임플란트</option>
                <option value="남성성형">진료분야: 남성성형</option>
                <option value="성기능장애">진료분야: 성기능장애 (조루/발기부전)</option>
                <option value="정관/포경">진료분야: 정관수술 / 포경수술</option>
              </select>
              <textarea class="gnj-textarea" rows="3" placeholder="상담 원하시는 증상이나 희망 예약 일시를 남겨주세요."></textarea>
              <button type="submit" class="gnj-submit">상담 예약 신청하기</button>
            </form>`
      }
    };

    window.openCommonModal = (key, preset) => {
      const d = modalData[key];
      if (!d) return;
      mEyebrow.textContent = d.e;
      mTitle.textContent = d.t;
      mBody.innerHTML = d.b;
      modal.classList.add('is-open');
      if (key === 'consult' && preset) {
        const sel = document.getElementById('consultCategory');
        if (sel) sel.value = preset;
      }
      const form = document.getElementById('consultForm');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          alert('상담 예약 요청이 접수되었습니다. 빠른 확인 후 연락드리겠습니다. (대표전화 02-3018-7575)');
          modal.classList.remove('is-open');
        });
      }
    };

    document.querySelectorAll('[data-open-modal]').forEach(el => {
      el.addEventListener('click', (e) => {
        const key = el.dataset.openModal;
        if (modalData[key]) {
          e.preventDefault();
          window.openCommonModal(key, el.dataset.preset);
        }
      });
    });
    document.getElementById('modalClose')?.addEventListener('click', () => modal.classList.remove('is-open'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('is-open'); });
  }
})();
