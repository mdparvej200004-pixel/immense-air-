(() => {
  // 1. Sticky Header Scroll State & Mobile Menu
  const header = document.getElementById('siteHeader');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  let lastScrolled = null;
  function updateHeaderScroll() {
    if (!header) return;
    const isScrolled = window.scrollY > 24;
    if (isScrolled === lastScrolled) return;
    lastScrolled = isScrolled;
    header.classList.toggle('is-scrolled', isScrolled);
  }

  window.addEventListener('scroll', updateHeaderScroll, { passive: true });
  updateHeaderScroll();

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

  const heroCard = document.getElementById('heroCard');
  const phoneStageEl = document.querySelector('.phone-stage');

  function syncMobilePhoneStageScale() {
    if (!heroCard || !phoneStageEl) return;
    if (window.innerWidth > 809) {
      phoneStageEl.style.transform = '';
      phoneStageEl.style.marginBottom = '';
      return;
    }
    const cardInner = heroCard.clientWidth ? heroCard.clientWidth - 28 : window.innerWidth - 60;
    const avail = Math.max(240, Math.min(cardInner, window.innerWidth - 48));
    const baseW = 616;
    const scale = Math.min(1, avail / baseW);
    phoneStageEl.style.transform = `scale(${scale.toFixed(4)})`;
    const fullH = phoneStageEl.offsetHeight || 592;
    phoneStageEl.style.marginBottom = `${Math.round(-fullH * (1 - scale))}px`;
  }

  window.addEventListener('resize', syncMobilePhoneStageScale, { passive: true });
  requestAnimationFrame(syncMobilePhoneStageScale);

  const heroTitleEl = document.getElementById('heroRotatingTitle');
  if (heroTitleEl) {
    const heroCaptions = [
      ['Start your journey', 'with Immense Air.'],
      ['Get more leads &', 'reach with Immense Air.'],
      ['Start your campaign', 'with Immense Air.']
    ];
    let captionIdx = 0;
    setInterval(() => {
      heroTitleEl.classList.add('is-fading');
      setTimeout(() => {
        captionIdx = (captionIdx + 1) % heroCaptions.length;
        const [line1, line2] = heroCaptions[captionIdx];
        heroTitleEl.innerHTML = `<span class="title-primary">${line1}</span><span class="title-accent">${line2}</span>`;
        heroTitleEl.classList.remove('is-fading');
      }, 340);
    }, 3400);
  }

  // 2. Hero Phone Channel Preview Switcher (Tabs + Hero Chips + Pop-out Cards + Auto-Cycle)
  const phoneTabs = Array.from(document.querySelectorAll('.phone-tab'));
  const channelChips = Array.from(document.querySelectorAll('.channel-chip'));
  const phonePreviewBody = document.getElementById('phonePreviewBody');
  const popoutStack = document.getElementById('popoutStack');
  const popoutLeft = document.getElementById('popoutLeft');
  const chatBrandSub = document.querySelector('.chat-brand-sub');
  const inputPlaceholder = document.querySelector('.input-placeholder');
  const phoneChatHeader = document.querySelector('.phone-chat-header');

  const channelData = {
    rcs: {
      brandName: 'Immense Air',
      verified: true,
      sub: 'Business Account',
      input: 'RCS message',
      readonlyInput: false,
      type: 'rcs',
      bannerKicker: 'EXCLUSIVE OFFER',
      bannerHeadline: 'Exclusive Winter Sale',
      bannerSub: 'Flat 20% Off · Shop Now',
      bannerClass: '',
      popBadge: 'Verified Sender & Branding',
      popBadgeTick: false,
      popBadgeKicker: 'Blue Tick Trust',
      popBadgeSub: 'Boost trust with your brand name, logo, and blue tick verified status.',
      pop1Kicker: 'Interactive Media',
      pop1Title: 'Rich Media & Carousels',
      pop1Desc: 'Captivate with high-quality images, catalogs, and interactive media.',
      pop2Kicker: 'Direct Response',
      pop2Title: 'Interactive CTA Buttons',
      pop2Desc: 'Drive higher conversions with direct response & quick-action buttons.'
    },
    whatsapp: {
      brandName: 'Immense Air',
      verified: true,
      tickColor: '#22C55E',
      sub: 'Business Account',
      input: 'WhatsApp message',
      readonlyInput: false,
      type: 'whatsapp',
      popBadgeKicker: 'Green Tick Trust',
      popBadge: 'Verified Brand Identity',
      popBadgeTick: false,
      popBadgeGreenTick: true,
      popBadgeSub: 'Instant trust with your brand name, logo, and verification badge.',
      pop1Kicker: 'No Hidden Fees',
      pop1Title: 'No Rental & Processing Charges',
      pop1Desc: 'Send unlimited promotional and transactional alerts with zero rental or processing fees.',
      pop2Kicker: 'Direct Engagement',
      pop2Title: 'Interactive CTA Buttons',
      pop2Desc: 'Drive higher engagement with direct-response buttons for website and store.'
    },
    sms: {
      brandName: 'AX-IMMAIR-P',
      verified: false,
      sub: '6-Character DLT Sender ID',
      input: "Sender can't accept replies",
      readonlyInput: true,
      type: 'sms',
      smsTime: 'Today · 10:30 AM',
      smsBody: 'Festive vibes are here with Immense Air! Launch high-converting Bulk SMS, RCS &amp; WhatsApp campaigns with 99.9% DLT delivery. TnC apply<br />👉 <span class="sms-link">immenseair.in/offers</span>',
      popBadge: '6-Character Header',
      popBadgeTick: false,
      popBadgeSub: 'Your unique brand name on every message',
      pop1Kicker: 'Fastest Campaign Go-Live',
      pop1Title: '15-20 Min Template Approval',
      pop1Desc: 'Quick DLT header &amp; template setup',
      pop2Kicker: 'Clickable &amp; Tracking CTA',
      pop2Title: 'Drive Visitors Directly',
      pop2Ctas: ['Track Clicks', 'Launch SMS']
    },
    voice: {
      brandName: 'Immense Air Call Assistant',
      verified: true,
      tickColor: '#FF5A00',
      sub: 'Cloud IVR & OBD Voice',
      input: 'Active Voice Call · DTMF Enabled',
      readonlyInput: true,
      hideHeader: true,
      hideInputBar: true,
      type: 'voice',
      popBadgeKicker: 'Cloud IVR Menu',
      popBadge: 'Smart IVR Systems',
      popBadgeTick: false,
      popBadgeSub: 'Route callers with custom voice menus and press-key (DTMF) to the right agent.',
      pop1Kicker: 'Automated Voice Blast',
      pop1Title: 'Outbound Dialing (OBD)',
      pop1Desc: 'Broadcast pre-recorded calls, reminders, and OTPs to thousands of customers instantly.',
      pop2Kicker: 'Live Agent Connect',
      pop2Title: 'Call Routing & Analytics',
      pop2Desc: 'Connect callers to live agents instantly and monitor call duration & performance.'
    },
    intro: {
      brandName: 'Immense Air',
      verified: true,
      sub: 'Omnichannel Platform',
      input: 'Immense Air',
      hideHeader: true,
      hideInputBar: true,
      type: 'intro',
      popBadgeKicker: 'DLT & Meta Partner',
      popBadge: 'Trusted by 2,500+ Brands',
      popBadgeTick: false,
      popBadgeSub: '4.9★ rated enterprise Bulk SMS, RCS, WhatsApp, IVR & OBD platform.',
      pop1Kicker: 'Omnichannel Reach',
      pop1Title: 'All Channels in One Place',
      pop1Desc: 'Launch RCS, Meta WhatsApp, Bulk SMS, Cloud IVR & OBD campaigns.',
      pop2Kicker: 'Instant Go-Live',
      pop2Title: '99.9% High-Speed Delivery',
      pop2Desc: 'Smart operator routing with live delivery & click analytics.'
    }
  };

  const chatBrandNameSpan = document.querySelector('.chat-brand-name span');
  const chatBrandTick = document.querySelector('.chat-brand-name .blue-tick-svg');
  const phoneInputBar = document.querySelector('.phone-input-bar');

  let phoneIntroTimer = null;

  function switchChannel(key) {
    const data = channelData[key];
    if (!data || !phonePreviewBody) return;
    if (phoneIntroTimer) {
      clearInterval(phoneIntroTimer);
      phoneIntroTimer = null;
    }

    phoneTabs.forEach((t) => {
      const active = t.getAttribute('data-channel') === key;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', String(active));
    });

    channelChips.forEach((c) => {
      c.classList.toggle('active', c.getAttribute('data-channel') === key);
    });

    if (phoneChatHeader) phoneChatHeader.style.display = data.hideHeader ? 'none' : '';
    if (chatBrandNameSpan) chatBrandNameSpan.textContent = data.brandName;
    if (chatBrandTick) {
      chatBrandTick.style.display = data.verified ? 'inline-block' : 'none';
      const tickCircle = chatBrandTick.querySelector('circle');
      if (tickCircle) tickCircle.setAttribute('fill', data.tickColor || '#1D9BF0');
    }
    if (chatBrandSub) chatBrandSub.textContent = data.sub;
    if (inputPlaceholder) inputPlaceholder.textContent = data.input;
    if (phoneInputBar) {
      phoneInputBar.classList.toggle('phone-input-bar--readonly', Boolean(data.readonlyInput));
      phoneInputBar.style.display = data.hideInputBar ? 'none' : '';
    }

    if (data.type === 'intro') {
      const introCaptions = [
        ['Start your journey', 'with Immense Air.'],
        ['Get more leads &', 'reach with Immense Air.'],
        ['Start your campaign', 'with Immense Air.']
      ];
      let introIdx = 0;
      phonePreviewBody.innerHTML = `
        <div class="zion-phone-intro">
          <div class="zion-intro-badge">
            <span class="zion-intro-badge-dot" aria-hidden="true"></span>
            <span>IMMENSE AIR</span>
          </div>
          <div class="zion-intro-title" id="phoneIntroTitle">
            <span class="title-primary">${introCaptions[0][0]}</span>
            <span class="title-accent">${introCaptions[0][1]}</span>
          </div>
          <p class="zion-intro-sub">
            Immense Air unifies Bulk SMS, RCS, Meta WhatsApp, Cloud IVR, and OBD voice campaigns in one high-speed platform.
          </p>
          <div class="zion-intro-pills">
            <span>RCS</span>
            <span>WhatsApp</span>
            <span>Bulk SMS</span>
            <span>OBD &amp; IVR</span>
          </div>
        </div>
      `;
      const phoneIntroTitleEl = document.getElementById('phoneIntroTitle');
      if (phoneIntroTitleEl) {
        phoneIntroTimer = setInterval(() => {
          phoneIntroTitleEl.classList.add('is-fading');
          setTimeout(() => {
            introIdx = (introIdx + 1) % introCaptions.length;
            const [l1, l2] = introCaptions[introIdx];
            phoneIntroTitleEl.innerHTML = `<span class="title-primary">${l1}</span><span class="title-accent">${l2}</span>`;
            phoneIntroTitleEl.classList.remove('is-fading');
          }, 260);
        }, 1400);
      }
    } else if (data.type === 'sms') {
      phonePreviewBody.innerHTML = `
        <div class="sms-bubble-wrap">
          <div class="sms-time">${data.smsTime}</div>
          <div class="sms-bubble">${data.smsBody}</div>
        </div>
      `;
    } else if (data.type === 'voice') {
      phonePreviewBody.innerHTML = `
        <div class="voice-call-screen">
          <div class="voice-call-top">
            <div class="voice-call-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div class="voice-caller-name">Immense Air Call Assistant</div>
            <div class="voice-call-timer"><span class="voice-live-dot"></span>00:45 · Active IVR</div>
          </div>

          <div class="voice-prompt-box">
            <div>Press <strong>1</strong> for Sales</div>
            <div>Press <strong>2</strong> for Support</div>
          </div>

          <div class="voice-keypad">
            <span class="voice-key voice-key--active">1</span>
            <span class="voice-key">2</span>
            <span class="voice-key">3</span>
            <span class="voice-key">4</span>
            <span class="voice-key voice-key--ring">5</span>
            <span class="voice-key">6</span>
            <span class="voice-key">7</span>
            <span class="voice-key">8</span>
            <span class="voice-key">9</span>
            <span class="voice-key">*</span>
            <span class="voice-key">0</span>
            <span class="voice-key">#</span>
            <div class="voice-dtmf-pill voice-dtmf-pill--1">Press 1 for Sales</div>
            <div class="voice-dtmf-pill voice-dtmf-pill--2">Press 2 for Support</div>
          </div>

          <div class="voice-controls">
            <span class="voice-ctrl-btn" title="Speaker">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            </span>
            <span class="voice-ctrl-btn voice-ctrl-btn--end" title="End Call">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="23" y1="1" x2="1" y2="23"/></svg>
            </span>
            <span class="voice-ctrl-btn" title="Keypad">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
            </span>
          </div>
        </div>
      `;
    } else if (data.type === 'whatsapp') {
      phonePreviewBody.innerHTML = `
        <div class="wa-chat-canvas">
          <div class="wa-date-pill">Today</div>
          <div class="wa-bubble wa-bubble--text">
            <div>Hi Laura! &#x1F60A; Our exclusive <strong>collection</strong> is now live. Enjoy <strong>15% off</strong> on selected luxury pieces.</div>
            <div class="wa-msg-time">10:30 AM</div>
          </div>
          <div class="wa-bubble wa-bubble--card">
            <div class="wa-media-wrap">
              <img src="./assets/wa-luxury-collection.jpg" alt="Exclusive Luxury Collection" class="wa-media-img" />
            </div>
            <div class="wa-card-body">
              <div class="wa-card-title">Exclusive Luxury Collection</div>
              <div class="wa-card-sub">Discover our new arrivals. Timeless style, crafted for you.</div>
              <div class="wa-msg-time">10:30 AM</div>
            </div>
            <div class="wa-cta-list">
              <span class="wa-cta-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                View Collection
              </span>
              <span class="wa-cta-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Book an Appointment
              </span>
              <span class="wa-cta-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Visit Our Store
              </span>
            </div>
          </div>
        </div>
      `;
    } else if (data.type === 'rcs') {
      phonePreviewBody.innerHTML = `
        <div class="preview-card">
          <div class="rcs-mini-sender">
            <span>Immense Air</span>
            <svg class="blue-tick-svg" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="#1D9BF0" />
              <path d="M8.5 12.3l2.3 2.3 4.8-5.1" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="preview-banner preview-banner--photo">
            <img src="./assets/rcs-winter-banner.jpg" alt="Exclusive Winter Sale" class="preview-banner-img" />
            <div class="banner-headline banner-headline--lg">${data.bannerHeadline}</div>
            <span class="banner-shop-pill">Shop Now</span>
          </div>
          <div class="rcs-carousel">
            <div class="rcs-prod-card">
              <div class="rcs-prod-thumb">
                <img src="./assets/rcs-cozy-jacket.jpg" alt="Cozy Jacket" />
              </div>
              <div class="rcs-prod-title">Cozy Jacket - Flat 20% Off</div>
            </div>
            <div class="rcs-prod-card">
              <div class="rcs-prod-thumb">
                <img src="./assets/rcs-warm-hoodie.jpg" alt="Warm Hoodie" />
              </div>
              <div class="rcs-prod-title">Warm Hoodie</div>
            </div>
          </div>
          <div class="rcs-cta-stack">
            <span class="rcs-cta-pill rcs-cta-pill--primary">Shop Now</span>
            <span class="rcs-cta-pill">View Catalog</span>
            <span class="rcs-cta-pill">Visit Website</span>
          </div>
        </div>
      `;
    } else {
      phonePreviewBody.innerHTML = `
        <div class="preview-card">
          <div class="preview-banner ${data.bannerClass}">
            <div class="banner-kicker">${data.bannerKicker}</div>
            <div class="banner-headline">${data.bannerHeadline}</div>
            <div class="banner-sub">${data.bannerSub}</div>
          </div>
          <div class="preview-msg">${data.msg}</div>
          <div class="preview-action-grid">
            <span class="action-tile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 12h6M12 9v6"/></svg>
              ${data.actions[0]}
            </span>
            <span class="action-tile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              ${data.actions[1]}
            </span>
            <span class="action-tile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              ${data.actions[2]}
            </span>
          </div>
        </div>
      `;
    }

    if (popoutLeft) {
      popoutLeft.setAttribute('data-channel', key);
      const midAction = data.pop1Btn
        ? `<a href="#contact" class="popout-btn popout-btn--navy">${data.pop1Btn}</a>`
        : `<div class="popout-kicker" style="margin-bottom:0">${data.pop1Desc}</div>`;

      popoutLeft.innerHTML = `
        <div class="popout-card">
          <div class="popout-connector"></div>
          <div class="popout-card-row">
            <div>
              <div class="popout-kicker">${data.pop1Kicker}</div>
              <div class="popout-title">${data.pop1Title}</div>
            </div>
            <span class="popout-icon-circle popout-icon-circle--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </span>
          </div>
          ${midAction}
        </div>
      `;
    }

    if (popoutStack) {
      popoutStack.setAttribute('data-channel', key);
      const topTickIcon = key === 'rcs'
        ? `<svg class="blue-tick-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#1D9BF0" /><path d="M8.5 12.3l2.3 2.3 4.8-5.1" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" /></svg>`
        : data.popBadgeGreenTick
          ? `<svg class="blue-tick-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#22C55E" /><path d="M8.5 12.3l2.3 2.3 4.8-5.1" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" /></svg>`
          : '';

      const topCard = data.popBadgeTick
        ? `<div class="popout-badge-pill">
            <span class="popout-connector"></span>
            <span>${data.popBadge}</span>
            <svg class="blue-tick-svg" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="#1D9BF0" />
              <path d="M8.5 12.3l2.3 2.3 4.8-5.1" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>`
        : `<div class="popout-card">
            <div class="popout-connector"></div>
            <div class="popout-card-row">
              <div>
                <div class="popout-kicker">${data.popBadgeKicker || 'DLT Sender Header'}</div>
                <div class="popout-title">${data.popBadge}</div>
              </div>
              ${topTickIcon}
            </div>
            <div class="popout-kicker" style="margin-bottom:0">${data.popBadgeSub}</div>
          </div>`;

      const botAction = data.pop2Ctas
        ? `<div class="popout-mini-buttons">
            <span class="mini-cta mini-cta--orange">${data.pop2Ctas[0]}</span>
            <span class="mini-cta mini-cta--blue">${data.pop2Ctas[1]}</span>
          </div>`
        : `<div class="popout-kicker" style="margin-bottom:0">${data.pop2Desc}</div>`;

      popoutStack.innerHTML = `
        ${topCard}

        <div class="popout-card">
          <div class="popout-connector"></div>
          <div class="popout-card-row">
            <div>
              <div class="popout-kicker">${data.pop2Kicker}</div>
              <div class="popout-title">${data.pop2Title}</div>
            </div>
            <span class="popout-icon-circle popout-icon-circle--orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </span>
          </div>
          ${botAction}
        </div>
      `;
    }

    requestAnimationFrame(syncMobilePhoneStageScale);
  }

  const isMobileViewport = window.innerWidth <= 809;
  const channelKeys = isMobileViewport
    ? ['intro', 'rcs', 'whatsapp', 'sms', 'voice']
    : ['rcs', 'whatsapp', 'sms', 'voice'];
  let cycleIdx = 0;
  if (isMobileViewport) {
    switchChannel('intro');
  }
  let autoCycle = setInterval(() => {
    cycleIdx = (cycleIdx + 1) % channelKeys.length;
    switchChannel(channelKeys[cycleIdx]);
  }, 4500);

  [...phoneTabs, ...channelChips].forEach((el) => {
    el.addEventListener('click', () => {
      clearInterval(autoCycle);
      const key = el.getAttribute('data-channel');
      if (key) switchChannel(key);
    });
  });

  // 3. "Industries we serve" 3D Cascading Deck + Micro-Animations (OneXtel Style)
  const industryTabs = Array.from(document.querySelectorAll('.industry-tab'));
  const industriesStage = document.getElementById('industriesStage');
  const indDropdown = document.getElementById('industriesMobileDropdown');
  const indTrigger = document.getElementById('indDropdownTrigger');
  const indTriggerIcon = document.getElementById('indTriggerIcon');
  const indTriggerLabel = document.getElementById('indTriggerLabel');
  const indMenu = document.getElementById('indDropdownMenu');

  const industriesData = {
    banking: [
      {
        title: 'Secure Transaction Alerts',
        visual: `
          <div class="ind-mock ind-mock--tx">
            <span class="ind-shield ind-pulse ind-float-soft"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg></span>
            <svg class="ind-flow-svg" viewBox="0 0 40 54" aria-hidden="true">
              <path class="ind-flow-line" d="M2 27 H18 V12 H38" />
              <path class="ind-flow-line" d="M2 27 H18 V42 H38" />
            </svg>
            <div class="ind-tx-window">
              <div class="ind-win-dots"><span></span><span></span><span></span></div>
              <div class="ind-tx-row">
                <span class="ind-tx-arrow ind-tx-arrow--in">↙</span>
                <div class="ind-tx-meta"><strong>₹6,000 credited</strong><span>Balance: ₹25,400</span></div>
                <span class="ind-mini-btn">View</span>
              </div>
              <div class="ind-tx-row">
                <span class="ind-tx-arrow ind-tx-arrow--out">↗</span>
                <div class="ind-tx-meta"><strong>₹5,000 debited</strong><span>Balance: ₹20,400</span></div>
                <span class="ind-mini-btn">View</span>
              </div>
            </div>
          </div>`
      },
      {
        title: 'Automated Loan & EMI Reminders',
        visual: `
          <div class="ind-mock ind-mock--emi">
            <div class="ind-float-pill">
              <span class="ind-svg-badge ind-svg-badge--navy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V9"/><path d="M19 21V9"/><path d="M9 21v-8h6v8"/><path d="M2 9l10-6 10 6H2z"/></svg></span>
              <div class="ind-tx-meta"><strong>₹5,000 debited</strong><span>Balance: ₹25,400</span></div>
              <span class="ind-mini-btn">View</span>
            </div>
            <div class="ind-float-pill ind-float-pill--offset">
              <span class="ind-svg-badge ind-svg-badge--orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg></span>
              <div class="ind-tx-meta"><strong>EMI ₹8,500 due on Mar 30</strong><span>Avoid late fees!</span></div>
              <span class="ind-mini-btn ind-mini-btn--orange">Pay</span>
            </div>
          </div>`
      },
      {
        title: 'AI Chatbots for 24/7 Query Resolution',
        visual: `
          <div class="ind-mock ind-mock--bot">
            <div class="ind-bot-badge">
              <span class="ind-svg-badge ind-svg-badge--navy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4"/><circle cx="12" cy="3" r="1"/><circle cx="9" cy="14" r="1" fill="currentColor"/><circle cx="15" cy="14" r="1" fill="currentColor"/></svg></span>
              <div class="ind-bot-typing"><span></span><span></span><span></span></div>
            </div>
            <div class="ind-bot-caption">Instant Balance, KYC &amp; Card Support via WhatsApp &amp; RCS</div>
          </div>`
      },
      {
        title: 'Encrypted Document Sharing and E-Approval',
        visual: `
          <div class="ind-mock ind-mock--doc">
            <span class="ind-doc-ok ind-pulse">✓</span>
            <div class="ind-doc-card">
              <strong>Loan Agreement · PDF</strong>
              <span>256-bit Verified E-Sign</span>
            </div>
            <span class="ind-mini-btn ind-mini-btn--navy">Approve</span>
          </div>`
      }
    ],
    realestate: [
      {
        title: 'Site Visit Scheduling on WhatsApp',
        visual: `
          <div class="ind-mock ind-mock--tx">
            <span class="ind-shield ind-pulse"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/></svg></span>
            <div class="ind-tx-window">
              <div class="ind-tx-row">
                <div class="ind-tx-meta"><strong>Site Visit · Sat 11:00 AM</strong><span>Immense Skyview Residences</span></div>
                <span class="ind-mini-btn ind-mini-btn--orange">Confirm</span>
              </div>
            </div>
          </div>`
      },
      {
        title: 'Rich RCS Property Brochures & Floor Plans',
        visual: `
          <div class="ind-mock ind-mock--emi">
            <div class="ind-float-pill">
              <span class="ind-svg-badge ind-svg-badge--navy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/></svg></span>
              <div class="ind-tx-meta"><strong>2 &amp; 3 BHK Luxury Towers</strong><span>Floor Plan + Price Sheet PDF</span></div>
              <span class="ind-mini-btn">View</span>
            </div>
          </div>`
      },
      {
        title: 'Automated OBD Launch & Pre-Booking Calls',
        visual: `
          <div class="ind-mock ind-mock--bot">
            <div class="ind-bot-badge">
              <span class="ind-svg-badge ind-svg-badge--orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
              <div class="ind-bot-typing"><span></span><span></span><span></span></div>
            </div>
            <div class="ind-bot-caption">Press 1 for instant callback with Senior Property Advisor</div>
          </div>`
      },
      {
        title: 'Payment Milestone & Possession Alerts',
        visual: `
          <div class="ind-mock ind-mock--doc">
            <span class="ind-doc-ok ind-pulse">✓</span>
            <div class="ind-doc-card">
              <strong>Booking Confirmed · Unit A-902</strong>
              <span>DLT SMS &amp; WhatsApp Receipt</span>
            </div>
            <span class="ind-mini-btn ind-mini-btn--navy">Receipt</span>
          </div>`
      }
    ],
    government: [
      {
        title: 'Verified Citizen Broadcasts & Alerts',
        visual: `
          <div class="ind-mock ind-mock--tx">
            <span class="ind-shield ind-pulse"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span>
            <div class="ind-tx-window">
              <div class="ind-tx-row">
                <div class="ind-tx-meta"><strong>Official Public Advisory</strong><span>DLT Gov Sender ID · Regional</span></div>
                <span class="ind-mini-btn">Read</span>
              </div>
            </div>
          </div>`
      },
      {
        title: 'Multilingual Cloud IVR Helplines',
        visual: `
          <div class="ind-mock ind-mock--emi">
            <div class="ind-float-pill">
              <span class="ind-svg-badge ind-svg-badge--orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
              <div class="ind-tx-meta"><strong>Press 1: Hindi · Press 2: English</strong><span>10,000+ Concurrent Calls</span></div>
              <span class="ind-mini-btn ind-mini-btn--orange">Route</span>
            </div>
          </div>`
      },
      {
        title: 'WhatsApp Document & Certificate Bot',
        visual: `
          <div class="ind-mock ind-mock--bot">
            <div class="ind-bot-badge">
              <span class="ind-svg-badge ind-svg-badge--navy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg></span>
              <div class="ind-bot-typing"><span></span><span></span><span></span></div>
            </div>
            <div class="ind-bot-caption">Download certificates &amp; track applications 24/7</div>
          </div>`
      },
      {
        title: 'Emergency OBD Voice Mass Reach',
        visual: `
          <div class="ind-mock ind-mock--doc">
            <span class="ind-doc-ok ind-pulse">!</span>
            <div class="ind-doc-card">
              <strong>Weather &amp; Civic Voice Alert</strong>
              <span>Pan-District Instant OBD</span>
            </div>
            <span class="ind-mini-btn ind-mini-btn--navy">Live</span>
          </div>`
      }
    ],
    ecommerce: [
      {
        title: 'Cart Recovery on WhatsApp & RCS',
        visual: `
          <div class="ind-mock ind-mock--tx">
            <span class="ind-shield ind-pulse"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></span>
            <div class="ind-tx-window">
              <div class="ind-tx-row">
                <div class="ind-tx-meta"><strong>2 Items Left in Cart</strong><span>Extra 15% OFF · Code: IMMENSE15</span></div>
                <span class="ind-mini-btn ind-mini-btn--orange">Checkout</span>
              </div>
            </div>
          </div>`
      },
      {
        title: 'COD Confirmation via Automated IVR',
        visual: `
          <div class="ind-mock ind-mock--emi">
            <div class="ind-float-pill">
              <span class="ind-svg-badge ind-svg-badge--orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></span>
              <div class="ind-tx-meta"><strong>Confirm COD Order #8492</strong><span>Press 1 to Confirm · Reduce RTO</span></div>
              <span class="ind-mini-btn">Confirm</span>
            </div>
          </div>`
      },
      {
        title: 'Interactive Product Catalog Carousels',
        visual: `
          <div class="ind-mock ind-mock--bot">
            <div class="ind-bot-badge">
              <span class="ind-svg-badge ind-svg-badge--orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></span>
              <div class="ind-tx-meta"><strong>Winter Collection · Flat 20% Off</strong><span>Shop in-chat via RCS &amp; WA</span></div>
            </div>
            <div class="ind-bot-caption">Direct-response Shop Now &amp; Catalog buttons</div>
          </div>`
      },
      {
        title: 'Real-Time Shipping & Delivery Alerts',
        visual: `
          <div class="ind-mock ind-mock--doc">
            <span class="ind-doc-ok ind-pulse">✓</span>
            <div class="ind-doc-card">
              <strong>Out for Delivery Today</strong>
              <span>Live Tracking Link Included</span>
            </div>
            <span class="ind-mini-btn ind-mini-btn--navy">Track</span>
          </div>`
      }
    ],
    media: [
      {
        title: 'New Release & Premiere Notifications',
        visual: `
          <div class="ind-mock ind-mock--tx">
            <span class="ind-shield ind-pulse"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg></span>
            <div class="ind-tx-window">
              <div class="ind-tx-row">
                <div class="ind-tx-meta"><strong>Season Finale Now Streaming</strong><span>Rich RCS Poster + Watch CTA</span></div>
                <span class="ind-mini-btn ind-mini-btn--orange">Watch</span>
              </div>
            </div>
          </div>`
      },
      {
        title: 'Subscription Renewal Nudges',
        visual: `
          <div class="ind-mock ind-mock--emi">
            <div class="ind-float-pill">
              <span class="ind-svg-badge ind-svg-badge--navy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="10 9 16 12 10 15 10 9"/></svg></span>
              <div class="ind-tx-meta"><strong>Plan Expires in 2 Days</strong><span>Renew at ₹199 · 1-Click</span></div>
              <span class="ind-mini-btn ind-mini-btn--orange">Renew</span>
            </div>
          </div>`
      },
      {
        title: 'Audience Polls & Interactive Trivia',
        visual: `
          <div class="ind-mock ind-mock--bot">
            <div class="ind-bot-badge">
              <span class="ind-svg-badge ind-svg-badge--orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></span>
              <div class="ind-bot-typing"><span></span><span></span><span></span></div>
            </div>
            <div class="ind-bot-caption">Live voting &amp; engagement on Meta WhatsApp</div>
          </div>`
      },
      {
        title: 'Celebrity OBD Voice Campaigns',
        visual: `
          <div class="ind-mock ind-mock--doc">
            <span class="ind-svg-badge ind-svg-badge--orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg></span>
            <div class="ind-doc-card">
              <strong>Pre-Recorded Promo Call</strong>
              <span>76.2% Average Call Pickup</span>
            </div>
            <span class="ind-mini-btn ind-mini-btn--navy">Listen</span>
          </div>`
      }
    ],
    logistics: [
      {
        title: 'Live Dispatch & Waybill SMS Alerts',
        visual: `
          <div class="ind-mock ind-mock--tx">
            <span class="ind-shield ind-pulse"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/></svg></span>
            <div class="ind-tx-window">
              <div class="ind-tx-row">
                <div class="ind-tx-meta"><strong>AWB #ZN9042 Dispatched</strong><span>ETA: Today 4:30 PM</span></div>
                <span class="ind-mini-btn">Track</span>
              </div>
            </div>
          </div>`
      },
      {
        title: 'Automated Delivery Rescheduling',
        visual: `
          <div class="ind-mock ind-mock--emi">
            <div class="ind-float-pill">
              <span class="ind-svg-badge ind-svg-badge--navy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></span>
              <div class="ind-tx-meta"><strong>Pick Delivery Slot</strong><span>Morning · Afternoon · Evening</span></div>
              <span class="ind-mini-btn ind-mini-btn--orange">Select</span>
            </div>
          </div>`
      },
      {
        title: 'Driver-Customer Masked IVR Calling',
        visual: `
          <div class="ind-mock ind-mock--bot">
            <div class="ind-bot-badge">
              <span class="ind-svg-badge ind-svg-badge--navy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
              <div class="ind-bot-typing"><span></span><span></span><span></span></div>
            </div>
            <div class="ind-bot-caption">Privacy-safe cloud bridging &amp; call recording</div>
          </div>`
      },
      {
        title: 'Digital Proof of Delivery (e-POD)',
        visual: `
          <div class="ind-mock ind-mock--doc">
            <span class="ind-doc-ok ind-pulse">✓</span>
            <div class="ind-doc-card">
              <strong>Delivered · OTP Verified</strong>
              <span>Signed Receipt Sent on WhatsApp</span>
            </div>
            <span class="ind-mini-btn ind-mini-btn--navy">PDF</span>
          </div>`
      }
    ],
    education: [
      {
        title: 'Admission & Counseling Follow-ups',
        visual: `
          <div class="ind-mock ind-mock--tx">
            <span class="ind-shield ind-pulse"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10L12 5 2 10l10 5 10-5z"/></svg></span>
            <div class="ind-tx-window">
              <div class="ind-tx-row">
                <div class="ind-tx-meta"><strong>2026 Admissions Open</strong><span>Download Brochure on WhatsApp</span></div>
                <span class="ind-mini-btn ind-mini-btn--orange">Apply</span>
              </div>
            </div>
          </div>`
      },
      {
        title: 'Fee Due & Exam Schedule Reminders',
        visual: `
          <div class="ind-mock ind-mock--emi">
            <div class="ind-float-pill">
              <span class="ind-svg-badge ind-svg-badge--navy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></span>
              <div class="ind-tx-meta"><strong>Semester Fee Due May 10</strong><span>Pay Online in 1 Tap</span></div>
              <span class="ind-mini-btn">Pay</span>
            </div>
          </div>`
      },
      {
        title: '24/7 Student Helpdesk Chatbot',
        visual: `
          <div class="ind-mock ind-mock--bot">
            <div class="ind-bot-badge">
              <span class="ind-svg-badge ind-svg-badge--orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
              <div class="ind-bot-typing"><span></span><span></span><span></span></div>
            </div>
            <div class="ind-bot-caption">Instant course, timetable &amp; scholarship answers</div>
          </div>`
      },
      {
        title: 'Parent OBD Attendance Alerts',
        visual: `
          <div class="ind-mock ind-mock--doc">
            <span class="ind-svg-badge ind-svg-badge--orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
            <div class="ind-doc-card">
              <strong>Automated Parent Voice Call</strong>
              <span>Regional Language OBD Updates</span>
            </div>
            <span class="ind-mini-btn ind-mini-btn--navy">Active</span>
          </div>`
      }
    ],
    travel: [
      {
        title: 'Flight, Train & Hotel PNR Updates',
        visual: `
          <div class="ind-mock ind-mock--tx">
            <span class="ind-shield ind-pulse"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2"/></svg></span>
            <div class="ind-tx-window">
              <div class="ind-tx-row">
                <div class="ind-tx-meta"><strong>Flight AI-602 · Gate 14</strong><span>Boarding starts at 06:15 AM</span></div>
                <span class="ind-mini-btn">Pass</span>
              </div>
            </div>
          </div>`
      },
      {
        title: 'Rich RCS Boarding Passes & Itineraries',
        visual: `
          <div class="ind-mock ind-mock--emi">
            <div class="ind-float-pill">
              <span class="ind-svg-badge ind-svg-badge--navy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2"/></svg></span>
              <div class="ind-tx-meta"><strong>Goa Holiday Package</strong><span>3N/4D · Flat 20% Early Bird</span></div>
              <span class="ind-mini-btn ind-mini-btn--orange">Book</span>
            </div>
          </div>`
      },
      {
        title: 'WhatsApp Concierge & Booking Bot',
        visual: `
          <div class="ind-mock ind-mock--bot">
            <div class="ind-bot-badge">
              <span class="ind-svg-badge ind-svg-badge--navy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span>
              <div class="ind-bot-typing"><span></span><span></span><span></span></div>
            </div>
            <div class="ind-bot-caption">Reschedule trips, upgrade seats &amp; check-in</div>
          </div>`
      },
      {
        title: 'Instant Feedback & Post-Trip IVR',
        visual: `
          <div class="ind-mock ind-mock--doc">
            <span class="ind-doc-ok ind-pulse">★</span>
            <div class="ind-doc-card">
              <strong>Rate Your Stay (1–5)</strong>
              <span>Automated WhatsApp &amp; IVR Survey</span>
            </div>
            <span class="ind-mini-btn ind-mini-btn--navy">4.9★</span>
          </div>`
      }
    ]
  };

  const industryKeys = Object.keys(industriesData);
  const industryPanels = {};

  function buildIndustryDeck() {
    if (!industriesStage) return;
    industriesStage.innerHTML = industryKeys
      .map((key) => {
        const cardsHtml = industriesData[key]
          .map(
            (card) => `
              <article class="industry-feature-card">
                <h4>${card.title}</h4>
                <div class="industry-card-visual">${card.visual}</div>
              </article>`
          )
          .join('');
        return `
          <div class="industry-deck-panel" data-industry-panel="${key}" data-slot="hidden">
            <div class="industry-deck-bg">
              <div class="industries-cards-grid">${cardsHtml}</div>
            </div>
          </div>`;
      })
      .join('');

    industryKeys.forEach((key) => {
      industryPanels[key] = industriesStage.querySelector(`[data-industry-panel="${key}"]`);
    });
  }

  function renderIndustry(key) {
    const activeIdx = industryKeys.indexOf(key);
    if (activeIdx === -1 || !industriesStage) return;

    industryTabs.forEach((tab) => {
      const active = tab.getAttribute('data-industry') === key;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      if (active && indTriggerIcon && indTriggerLabel) {
        const iconEl = tab.querySelector('.industry-icon');
        const labelEl = tab.querySelector('span:last-child');
        if (iconEl) indTriggerIcon.innerHTML = iconEl.innerHTML;
        if (labelEl) indTriggerLabel.innerHTML = labelEl.innerHTML;
      }
    });

    if (indMenu) {
      indMenu.querySelectorAll('.ind-dropdown-option').forEach((opt) => {
        opt.classList.toggle('active', opt.getAttribute('data-industry') === key);
      });
    }

    const total = industryKeys.length;
    industryKeys.forEach((k, idx) => {
      const panel = industryPanels[k];
      if (!panel) return;
      const offset = (idx - activeIdx + total) % total;
      if (offset === 0) panel.setAttribute('data-slot', '0');
      else if (offset === 1) panel.setAttribute('data-slot', '1');
      else if (offset === 2) panel.setAttribute('data-slot', '2');
      else panel.setAttribute('data-slot', 'hidden');
    });
  }

  if (industryTabs.length > 0 && industriesStage) {
    if (indMenu) {
      indMenu.innerHTML = industryTabs
        .map((tab) => {
          const k = tab.getAttribute('data-industry');
          const iconHtml = tab.querySelector('.industry-icon')?.innerHTML || '';
          const labelHtml = tab.querySelector('span:last-child')?.innerHTML || '';
          return `<button type="button" class="ind-dropdown-option" data-industry="${k}" role="option"><span class="industry-icon">${iconHtml}</span><span>${labelHtml}</span></button>`;
        })
        .join('');

      indMenu.querySelectorAll('.ind-dropdown-option').forEach((opt) => {
        opt.addEventListener('click', () => {
          const k = opt.getAttribute('data-industry');
          if (k) renderIndustry(k);
          if (indDropdown && indTrigger) {
            indDropdown.classList.remove('open');
            indTrigger.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }

    if (indTrigger && indDropdown) {
      indTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = indDropdown.classList.toggle('open');
        indTrigger.setAttribute('aria-expanded', String(isOpen));
      });
      document.addEventListener('click', (e) => {
        if (!indDropdown.contains(e.target)) {
          indDropdown.classList.remove('open');
          indTrigger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    buildIndustryDeck();
    renderIndustry('realestate');
    industryTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.getAttribute('data-industry');
        if (key) renderIndustry(key);
      });
    });
  }

  // 4. Testimonials Scroll Reveal
  const revealCards = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealCards.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 }
    );
    revealCards.forEach((card) => revealObserver.observe(card));
  } else {
    revealCards.forEach((card) => card.classList.add('is-visible'));
  }

  // 5. FAQ Accordion
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');

      faqItems.forEach((other) => {
        if (other !== item && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          const otherTrigger = other.querySelector('.faq-trigger');
          const otherPanel = other.querySelector('.faq-panel');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.style.maxHeight = '0px';
        }
      });

      item.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', String(willOpen));
      panel.style.maxHeight = willOpen ? `${panel.scrollHeight}px` : '0px';
    });
  });

  // 5. Connect India Style Review Deck Scroll Spread & Interactive Focus (Desktop + Mobile)
  const reviewsDeck = document.getElementById('reviewsDeck');
  if (reviewsDeck) {
    const deckCards = Array.from(reviewsDeck.querySelectorAll('.review-deck-card'));
    const desktopPoses = {
      1: { start: [-36, 12, -8], end: [-92, -10, -6] },
      2: { start: [-4, -14, -5], end: [-12, -38, -7] },
      3: { start: [34, -8, 6], end: [82, -14, 10] },
      4: { start: [10, 14, -3], end: [18, 36, -2] },
      5: { start: [-8, 6, 9], end: [-28, 28, 12] }
    };
    const mobilePoses = {
      1: { start: [-18, 8, -7], end: [-42, -12, -8] },
      2: { start: [-2, -10, -4], end: [-4, -34, -5] },
      3: { start: [18, -6, 6], end: [42, -10, 8] },
      4: { start: [6, 10, -3], end: [18, 30, -3] },
      5: { start: [-6, 4, 7], end: [-20, 24, 9] }
    };
    let activeCard = null;
    let deckRaf = null;
    let deckInView = true;

    function updateDeckTransforms() {
      deckRaf = null;
      const isMob = window.innerWidth <= 809;
      const poses = isMob ? mobilePoses : desktopPoses;
      const rect = reviewsDeck.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const raw = (vh - rect.top) / (vh * 0.85);
      const p = Math.max(0, Math.min(1, raw));

      deckCards.forEach((card) => {
        const pos = Number(card.getAttribute('data-pos'));
        const cfg = poses[pos];
        if (!cfg) return;
        const x = cfg.start[0] + (cfg.end[0] - cfg.start[0]) * p;
        const y = cfg.start[1] + (cfg.end[1] - cfg.start[1]) * p;
        const r = cfg.start[2] + (cfg.end[2] - cfg.start[2]) * p;
        if (card === activeCard) {
          card.style.transform = `translate3d(${(x * 0.45).toFixed(1)}%, ${(y * 0.45).toFixed(1)}%, 0) scale(${isMob ? '1.12' : '1.06'}) rotate(0deg)`;
        } else {
          card.style.transform = `translate3d(${x.toFixed(1)}%, ${y.toFixed(1)}%, 0) rotate(${r.toFixed(1)}deg)`;
        }
      });
    }

    function requestDeckUpdate() {
      if (!deckInView && !activeCard) return;
      if (!deckRaf) deckRaf = requestAnimationFrame(updateDeckTransforms);
    }

    if ('IntersectionObserver' in window) {
      const deckObs = new IntersectionObserver(
        (entries) => {
          deckInView = entries[0]?.isIntersecting ?? true;
          if (deckInView) requestDeckUpdate();
        },
        { rootMargin: '240px 0px' }
      );
      deckObs.observe(reviewsDeck);
    }

    deckCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        if (window.innerWidth <= 809) return;
        activeCard = card;
        deckCards.forEach((c) => c.classList.toggle('is-active', c === card));
        requestDeckUpdate();
      });
      card.addEventListener('mouseleave', () => {
        if (window.innerWidth <= 809) return;
        if (activeCard === card) activeCard = null;
        card.classList.remove('is-active');
        requestDeckUpdate();
      });
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        activeCard = activeCard === card ? null : card;
        deckCards.forEach((c) => c.classList.toggle('is-active', c === activeCard));
        requestDeckUpdate();
      });
    });

    document.addEventListener('click', () => {
      if (!activeCard) return;
      activeCard = null;
      deckCards.forEach((c) => c.classList.remove('is-active'));
      requestDeckUpdate();
    });

    window.addEventListener('scroll', requestDeckUpdate, { passive: true });
    window.addEventListener('resize', requestDeckUpdate, { passive: true });
    updateDeckTransforms();
  }
})();
