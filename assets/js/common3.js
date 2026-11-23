// Sticky header scroll state
const header = document.getElementById('siteHeader');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 30);
  });
}

// Sitemap overlay
function toggleSitemap(open) {
  const el = document.getElementById('sitemapOverlay');
  if (el) el.classList.toggle('is-open', open);
}

// FAQ Accordion
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('is-open');
  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('is-open'));
  if (!wasOpen) item.classList.add('is-open');
}

// Shared Modal
function openModal(title, body) {
  const m = document.getElementById('infoModal');
  if (!m) return;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').textContent = body;
  m.classList.add('is-open');
}
function closeModal() {
  const m = document.getElementById('infoModal');
  if (m) m.classList.remove('is-open');
}

// Quick Consult Form
function submitQuickForm(e) {
  e.preventDefault();
  const name = document.getElementById('qName').value.trim();
  const subject = document.getElementById('qSubject').value;
  openModal(
    '간편 상담 신청이 접수되었습니다',
    `${name}님, [${subject}] 상담 요청이 확인되었습니다. 상담시간(평일 09:00~18:00 / 토 09:00~13:00) 내 순차적으로 연락드리며, 급하신 경우 02-3018-7575 또는 010-9190-7575로 바로 문의하실 수 있습니다.`
  );
  e.target.reset();
}

// Subpage Tab System (?tab=key)
function selectSubTab(tabKey, pushUrl = true) {
  const btns = document.querySelectorAll('.sub-tab-btn');
  const panels = document.querySelectorAll('.sub-tab-panel');
  if (!btns.length) return;

  let matched = false;
  btns.forEach((btn, idx) => {
    const key = btn.dataset.tab;
    const isMatch = key === tabKey;
    if (isMatch) matched = true;
    btn.classList.toggle('is-active', isMatch);
    if (panels[idx]) panels[idx].classList.toggle('is-active', isMatch);
  });

  if (!matched && btns[0]) {
    btns[0].classList.add('is-active');
    if (panels[0]) panels[0].classList.add('is-active');
  }

  const activeBtn = document.querySelector('.sub-tab-btn.is-active');
  const crumb = document.getElementById('crumbCurrent');
  if (activeBtn && crumb) {
    crumb.textContent = activeBtn.textContent.trim();
  }

  if (pushUrl && activeBtn) {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeBtn.dataset.tab);
    window.history.replaceState({}, '', url);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const tabParam = params.get('tab');
  if (document.querySelector('.sub-tab-btn')) {
    selectSubTab(tabParam || document.querySelector('.sub-tab-btn').dataset.tab, false);
  }
});
