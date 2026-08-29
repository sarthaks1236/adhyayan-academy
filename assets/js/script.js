// ============================================================
// ADHYAYAN ACADEMY — MAIN SCRIPT
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- PRELOADER ---------- */
  var preloader = document.getElementById('preloader');
  function hidePreloader(){
    if (preloader){ preloader.classList.add('hide'); }
  }
  window.addEventListener('load', hidePreloader);
  // Safety fallback: never let the preloader trap the page
  setTimeout(hidePreloader, 1800);

  /* ---------- SCROLL PROGRESS BAR ---------- */
  var progressBar = document.getElementById('progressBar');
  function updateProgress(){
    if (!progressBar) return;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- MOBILE DRAWER ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var mobileDrawer = document.getElementById('mobileDrawer');
  var closeDrawer = document.getElementById('closeDrawer');

  var overlay = document.createElement('div');
  overlay.className = 'drawer-overlay';
  document.body.appendChild(overlay);

  function openDrawer(){
    if (mobileDrawer) mobileDrawer.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawerFn(){
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (closeDrawer) closeDrawer.addEventListener('click', closeDrawerFn);
  overlay.addEventListener('click', closeDrawerFn);
  if (mobileDrawer){
    mobileDrawer.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeDrawerFn);
    });
  }

  /* ---------- SCROLL REVEAL (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && revealEls.length){
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: just show everything
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- COURSE ACCORDION CARDS ---------- */
  var courseHeads = document.querySelectorAll('.course-card-head');
  courseHeads.forEach(function (head) {
    function toggleCard(){
      var card = head.closest('.course-card');
      if (!card) return;
      var isOpen = card.classList.contains('is-open');
      head.setAttribute('aria-expanded', String(!isOpen));
      card.classList.toggle('is-open');
      if (!isOpen){
        setTimeout(function(){
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 120);
      }
    }
    head.addEventListener('click', toggleCard);
    head.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        toggleCard();
      }
    });
  });

  /* ---------- FAQ ACCORDION ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      faqItems.forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---------- BACK TO TOP ---------- */
  var toTop = document.getElementById('toTop');
  if (toTop){
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) toTop.classList.add('show');
      else toTop.classList.remove('show');
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- COOKIE CONSENT ---------- */
  var cookieBar = document.getElementById('cookieBar');
  var cookieAccept = document.getElementById('cookieAccept');
  var cookieDecline = document.getElementById('cookieDecline');
  var COOKIE_KEY = 'adhyayan_cookie_choice';

  function getCookieChoice(){
    try { return localStorage.getItem(COOKIE_KEY); } catch (e) { return null; }
  }
  function setCookieChoice(val){
    try { localStorage.setItem(COOKIE_KEY, val); } catch (e) { /* ignore */ }
  }
  if (cookieBar && !getCookieChoice()){
    setTimeout(function () { cookieBar.classList.add('show'); }, 1200);
  }
  if (cookieAccept){
    cookieAccept.addEventListener('click', function () {
      setCookieChoice('accepted');
      cookieBar.classList.remove('show');
    });
  }
  if (cookieDecline){
    cookieDecline.addEventListener('click', function () {
      setCookieChoice('declined');
      cookieBar.classList.remove('show');
    });
  }

  /* ---------- CONTACT ENQUIRY FORM -> WHATSAPP ---------- */
  var enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm){
    var fName = document.getElementById('fName');
    var fPhone = document.getElementById('fPhone');
    var fCourse = document.getElementById('fCourse');
    var fTime = document.getElementById('fTime');
    var errName = document.getElementById('errName');
    var errPhone = document.getElementById('errPhone');

    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      if (errName) errName.textContent = '';
      if (errPhone) errPhone.textContent = '';

      var nameVal = (fName && fName.value || '').trim();
      var phoneVal = (fPhone && fPhone.value || '').trim();

      if (nameVal.length < 2){
        if (errName) errName.textContent = 'Kripya apna naam likhein (kam se kam 2 characters).';
        valid = false;
      }
      var phoneDigits = phoneVal.replace(/\D/g, '');
      if (phoneDigits.length < 10){
        if (errPhone) errPhone.textContent = 'Kripya valid 10-digit phone number likhein.';
        valid = false;
      }
      if (!valid) return;

      var courseVal = fCourse ? fCourse.value : '';
      var timeVal = fTime && fTime.value ? fTime.value : 'Koi bhi samay';

      var message = 'Namaste, main ' + nameVal + ' hoon.\n' +
        'Phone: ' + phoneVal + '\n' +
        'Interested course: ' + courseVal + '\n' +
        'Best time to contact: ' + timeVal + '\n' +
        'Kripya mujhe is course ke baare mein aur jaankari dein.';

      var waUrl = 'https://wa.me/916230171716?text=' + encodeURIComponent(message);
      window.open(waUrl, '_blank', 'noopener');
    });
  }

  /* ---------- HEADER SHRINK ON SCROLL (subtle) ---------- */
  var siteHeader = document.getElementById('siteHeader');
  if (siteHeader){
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) siteHeader.style.padding = '0';
      else siteHeader.style.padding = '';
    }, { passive: true });
  }

});
