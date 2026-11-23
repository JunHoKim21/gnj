(function () {
  // 1. Sticky Header
  const header = document.getElementById('siteHeader');
  if (header && !header.classList.contains('sub-header')) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // 2. Channel Dropdown & Mobile Drawer
  const channelBtn = document.getElementById('channelBtn');
  const channelMenu = document.getElementById('channelMenu');
  if (channelBtn && channelMenu) {
    channelBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      channelMenu.classList.toggle('open');
    });
    document.addEventListener('click', () => channelMenu.classList.remove('open'));
  }

  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  if (mobileDrawer && mobileMenuBtn && closeDrawerBtn) {
    mobileMenuBtn.addEventListener('click', () => mobileDrawer.classList.add('open'));
    closeDrawerBtn.addEventListener('click', () => mobileDrawer.classList.remove('open'));
    document.querySelectorAll('.drawer-link').forEach((el) => {
      el.addEventListener('click', () => mobileDrawer.classList.remove('open'));
    });
  }

  // 3. Dual Layer Popups (오늘 하루 그만보기 / 닫기)
  const todayKey = new Date().toISOString().slice(0, 10);
  ['layerPopup1', 'layerPopup2'].forEach((id) => {
    const el = document.getElementById(id);
    if (el && localStorage.getItem('gnj_hide_' + id) === todayKey) {
      el.classList.add('hidden');
    }
  });
  document.querySelectorAll('.popup-close-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetId = btn.dataset.target;
      const card = document.getElementById(targetId);
      const chk = document.querySelector(`.popup-today-chk[data-target="${targetId}"]`);
      if (chk && chk.checked) localStorage.setItem('gnj_hide_' + targetId, todayKey);
      if (card) card.classList.add('hidden');
    });
  });

  // 4. Hero Slider
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  const heroIdxEl = document.getElementById('heroIndex');
  if (slides.length) {
    let currentSlide = 0;
    const goSlide = (idx) => {
      currentSlide = (idx + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
      dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
      if (heroIdxEl) heroIdxEl.textContent = String(currentSlide + 1);
    };
    document.getElementById('heroPrev')?.addEventListener('click', () => goSlide(currentSlide - 1));
    document.getElementById('heroNext')?.addEventListener('click', () => goSlide(currentSlide + 1));
    dots.forEach((d) => d.addEventListener('click', () => goSlide(Number(d.dataset.idx))));
    setInterval(() => goSlide(currentSlide + 1), 6500);
  }

  // 5. Clinics Accordion
  const clinicCards = Array.from(document.querySelectorAll('.clinic-card'));
  clinicCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      clinicCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // 6. Special Strengths Track
  const speTrack = document.getElementById('speTrack');
  document.getElementById('spePrev')?.addEventListener('click', () => speTrack?.scrollBy({ left: -384, behavior: 'smooth' }));
  document.getElementById('speNext')?.addEventListener('click', () => speTrack?.scrollBy({ left: 384, behavior: 'smooth' }));

  // 7. Search Routing to Subpages
  function routeSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) return;
    if (q.includes('결석')) return (window.location.href = 'landing6.html');
    if (q.includes('전립') || q.includes('holep') || q.includes('유로')) return (window.location.href = 'landing2.html');
    if (q.includes('임플란트') || q.includes('combi')) return (window.location.href = 'landing1.html');
    if (q.includes('만곡')) return (window.location.href = 'landing3.html');
    if (q.includes('이물질')) return (window.location.href = 'landing4.html');
    if (q.includes('확대') || q.includes('성형') || q.includes('길이') || q.includes('함몰')) return (window.location.href = 'landing5.html');
    if (q.includes('조루') || q.includes('발기')) return (window.location.href = 'sexual.html');
    if (q.includes('정관') || q.includes('포경')) return (window.location.href = 'vasectomy.html');
    if (q.includes('시간') || q.includes('오시는') || q.includes('박천진') || q.includes('이웅희') || q.includes('비급여')) return (window.location.href = 'hospital.html');
    window.location.href = 'consult.html';
  }
  document.getElementById('floatSearchForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    routeSearch(document.getElementById('floatSearchInput').value);
  });
  document.getElementById('mainSearchForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    routeSearch(document.getElementById('mainSearchInput').value);
  });
  document.getElementById('quickSearchBtn')?.addEventListener('click', () => {
    const inp = document.getElementById('mainSearchInput');
    if (inp) {
      inp.focus();
      document.querySelector('.ai_search_sect')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = 'index.html#search';
    }
  });

  // 8. Curation Tabs
  const curationGrid = document.getElementById('curationGrid');
  if (curationGrid) {
    const imgBase = '../assets/img/';
    const curationData = {
      tour: [
        { img: imgBase + 'clinic_tour_1.jpg', cat: 'CLINIC TOUR 01', title: '독립된 5개의 개인진료실', desc: '프라이버시 침해 없이 충분한 시간 동안 상담과 진료가 이루어집니다.' },
        { img: imgBase + 'clinic_tour_2.jpg', cat: 'CLINIC TOUR 02', title: '아늑한 대기 공간 · 2개 접수창구', desc: '신속한 접수와 편안한 대기 환경을 제공합니다.' },
        { img: imgBase + 'clinic_tour_3.jpg', cat: 'CLINIC TOUR 03', title: '2개의 전용 수술방 · 멸균 시스템', desc: '2대의 첨단 소독기계와 자외선 소독기로 안전한 수술 환경을 유지합니다.' },
        { img: imgBase + 'clinic_tour_4.jpg', cat: 'CLINIC TOUR 04', title: '첨단 진단·모니터링 인프라', desc: '종합병원급 비뇨기 진단기기와 실시간 활력증후 모니터링을 갖췄습니다.' }
      ],
      press: [
        { img: imgBase + 'doctor_park.jpg', cat: '교육자 박천진', title: '박천진 원장 논문 및 학술발표', desc: '국내외 학회 활동과 연구를 통해 최신 비뇨의학 지견을 진료에 반영합니다.' },
        { img: imgBase + 'hero_prostate.jpg', cat: '전립선 시술', title: 'HoLEP 및 유로리프트 치료 안내', desc: '전립선비대증 환자의 상태에 따른 맞춤형 수술·비수술 솔루션을 제시합니다.' },
        { img: imgBase + 'hero_surgery.jpg', cat: '수술 철학', title: '3S · No3 남성의학 수술 원칙', desc: '최소한의 국소 신경 마취와 IOM 음악요법으로 편안한 수술을 지향합니다.' },
        { img: imgBase + 'hero_building.jpg', cat: '병원 소식', title: '1999년부터 이어온 온라인·유선 상담', desc: '홈페이지와 카카오톡(gnjurology)으로 궁금증을 직접 답변해 드립니다.' }
      ],
      faq: [
        { img: imgBase + 'clinic_tour_5.jpg', cat: 'FAQ 01 · 예약', title: '평일 오전 진료는 어떻게 받나요?', desc: '오전진료는 예약제로 진행되니 내원 전 02-3018-7575로 예약 확인 바랍니다.' },
        { img: imgBase + 'clinic_tour_1.jpg', cat: 'FAQ 02 · 프라이버시', title: '수술 및 검사 시 스태프 구성은?', desc: '모든 시술과 검사에는 의사와 남자 간호사들만 참여하여 심리적 부담을 덜어드립니다.' },
        { img: imgBase + 'hero_stone.jpg', cat: 'FAQ 03 · 주차', title: '차량 방문 시 주차가 가능한가요?', desc: '네, 병원 빌딩 내 충분한 주차 공간을 갖춘 지하 주차장이 별도 마련되어 있습니다.' },
        { img: imgBase + 'clinic_tour_2.jpg', cat: 'FAQ 04 · 진료시간', title: '의료진별 휴진 요일이 있나요?', desc: '박천진 원장(월·목 오후 휴진), 이웅희 원장(목요일 휴진) 등 진료시간표를 확인해 주세요.' }
      ]
    };
    const renderCuration = (key) => {
      curationGrid.innerHTML = curationData[key].map((item) => `
        <a href="hospital.html" class="curation-card">
          <div class="curation-thumb"><img src="${item.img}" alt="${item.title}" /></div>
          <div class="curation-body">
            <span class="curation-cat">${item.cat}</span>
            <h4>${item.title}</h4>
            <p>${item.desc}</p>
          </div>
        </a>
      `).join('');
    };
    renderCuration('tour');
    document.querySelectorAll('.curation-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.curation-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        renderCuration(tab.dataset.tab);
      });
    });
  }

  // 9. Modal (Self-diagnosis / Kakao)
  const modal = document.getElementById('infoModal');
  const modalContent = document.getElementById('modalContent');
  const openModal = (html) => {
    if (!modal || !modalContent) return;
    modalContent.innerHTML = html;
    modal.classList.add('open');
  };
  document.getElementById('closeModalBtn')?.addEventListener('click', () => modal?.classList.remove('open'));
  modal?.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

  const diagSets = {
    bph: { title: '전립선비대증 자가진단', link: 'landing2.html', qs: ['소변을 본 후에도 덜 본 듯한 잔뇨감이 있다.', '소변을 보고 2시간 이내에 다시 마렵다.', '소변 줄기가 가늘어지거나 중간에 끊긴다.', '밤에 잠을 자다 소변 때문에 2회 이상 깬다.'] },
    stone: { title: '요로결석 자가진단', link: 'landing6.html', qs: ['갑작스럽고 심한 옆구리·하복부 통증이 있다.', '소변 색이 붉거나 검붉게(혈뇨) 보인다.', '배뇨 시 찌릿한 통증이나 잔뇨감이 있다.', '메스꺼움이나 구토 증상이 동반된다.'] },
    prostatitis: { title: '전립선염 · 전립선통 자가진단', link: 'landing2.html', qs: ['회음부(항문과 고환 사이)가 묵직하고 불편하다.', '소변을 자주 보고 급하게 마렵다.', '아랫배나 허리, 고환 부위에 뻐근한 통증이 있다.', '피로나 음주 후 증상이 심해진다.'] },
    ed: { title: '발기부전 자가진단', link: 'sexual.html', qs: ['발기 강직도가 만족스럽지 않다.', '관계 도중 발기가 유지되지 않는 경우가 있다.', '성적 자극에 대한 반응이 예전보다 느리다.'] },
    pe: { title: '조루증 자가진단', link: 'sexual.html', qs: ['삽입 전후 짧은 시간 내에 사정하게 된다.', '사정 시점을 스스로 조절하기 어렵다.', '이로 인해 심리적 스트레스나 자신감 저하가 있다.'] }
  };
  document.querySelectorAll('.self-row').forEach((row) => {
    row.addEventListener('click', () => {
      const d = diagSets[row.dataset.diag];
      if (!d) return;
      openModal(`
        <h3>${d.title}</h3>
        <p>해당되는 항목을 체크해 보세요. 2개 이상 해당될 경우 비뇨의학과 전문의 상담을 권장합니다.</p>
        <div class="diag-check-list">
          ${d.qs.map((q) => `<label class="diag-check-item"><input type="checkbox" class="diag-chk" /><span>${q}</span></label>`).join('')}
        </div>
        <div class="diag-result" id="diagResultMsg">항목을 선택하면 안내 메시지가 표시됩니다.</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <a href="${d.link}" class="btn-black-pill" style="justify-content:center;padding:13px;background:#F2F2F2;color:#111;">질환 상세보기</a>
          <a href="consult.html" class="btn-black-pill" style="justify-content:center;padding:13px;">상담 예약하기 →</a>
        </div>
      `);
      document.querySelectorAll('.diag-chk').forEach((chk) => {
        chk.addEventListener('change', () => {
          const cnt = document.querySelectorAll('.diag-chk:checked').length;
          const msg = document.getElementById('diagResultMsg');
          if (msg) {
            msg.textContent = cnt >= 2
              ? `현재 ${cnt}개 항목이 선택되었습니다. 정확한 원인 확인을 위해 1:1 비공개 진료를 권장합니다.`
              : `현재 ${cnt}개 항목이 선택되었습니다. 증상이 지속된다면 가벼운 상담부터 받아보세요.`;
          }
        });
      });
    });
  });

  // Kakao Copy
  const copyKakao = () => {
    navigator.clipboard?.writeText('gnjurology').catch(() => {});
    openModal(`
      <h3>카카오톡 상담 안내</h3>
      <p>카카오톡 ID <strong>gnjurology</strong>가 복사되었습니다.<br />카카오톡 친구 추가 후 편하신 시간에 비공개 1:1 상담을 남겨주세요.</p>
      <div class="diag-result">상담시간: 월~금 09:00 ~ 18:00 / 토요일 09:00 ~ 13:00<br />(상담시간 외 문자는 순차적으로 답변해 드립니다)</div>
    `);
  };
  ['copyKakaoBtn', 'copyKakaoBtn2', 'quickKakaoBtn'].forEach((id) => {
    document.getElementById(id)?.addEventListener('click', copyKakao);
  });

  // 10. Consult Form Preset & Submit
  const params = new URLSearchParams(window.location.search);
  const presetClinic = params.get('clinic');
  const consultClinicSelect = document.getElementById('consultClinicSelect');
  if (presetClinic && consultClinicSelect) {
    consultClinicSelect.value = presetClinic;
  }
  document.getElementById('consultForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    openModal(`
      <h3>간편 상담 · 예약 접수가 완료되었습니다</h3>
      <p>남겨주신 연락처로 강남J비뇨기과 전담 상담팀이 확인 후 순차적으로 연락드리겠습니다.<br />빠른 확인이 필요하신 경우 대표전화(02-3018-7575)로 연락 부탁드립니다.</p>
      <div class="diag-result">가급적 02-3018-7575로 사전 예약 및 예약 확인 후 내원해 주시면 감사하겠습니다.</div>
    `);
    e.target.reset();
  });
})();
