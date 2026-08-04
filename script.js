// EmiOps — resilient logo fallback and accessible mobile navigation
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelectorAll('.nav-links a');
  const logo = document.querySelector('.logo');
  const logoImage = document.querySelector('.logo-img');

  if (logo && logoImage) {
    const showLogoFallback = () => logo.classList.add('image-failed');

    logoImage.addEventListener('error', showLogoFallback);
    if (logoImage.complete && logoImage.naturalWidth === 0) {
      showLogoFallback();
    }
  }

  if (nav && toggle) {
    const setMenuOpen = (isOpen) => {
      nav.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    };

    toggle.addEventListener('click', () => {
      setMenuOpen(!nav.classList.contains('open'));
    });

    links.forEach(link => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        setMenuOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    });
  }

  const calculator = document.querySelector('[data-calculator]');

  if (calculator) {
    const pageInput = calculator.querySelector('#page-count');
    const pageOutput = calculator.querySelector('#page-count-output');
    const databaseInput = calculator.querySelector('#database');
    const seoInput = calculator.querySelector('#seo-level');
    const featureInputs = [...calculator.querySelectorAll('input[name="feature"]')];
    const presetButtons = [...calculator.querySelectorAll('[data-preset]')];
    const estimateRange = calculator.querySelector('#estimate-range');
    const estimateNote = calculator.querySelector('#estimate-note');
    const estimateSummary = calculator.querySelector('#estimate-summary');
    const estimateCta = calculator.querySelector('#estimate-cta');

    const featurePrices = {
      worker: 350,
      admin: 500,
      auth: 350,
      booking: 650,
      uploads: 200,
      integration: 250
    };

    const featureLabels = {
      worker: 'Cloudflare Worker API',
      admin: 'Admin dashboard',
      auth: 'User accounts & permissions',
      booking: 'Booking or payment flow',
      uploads: 'Secure file uploads',
      integration: 'External service integration'
    };

    const databaseOptions = {
      none: { price: 0, label: '' },
      content: { price: 500, label: 'Editable content system' },
      application: { price: 900, label: 'Application database & migrations' },
      advanced: { price: 1600, label: 'Advanced data model & reporting' }
    };

    const seoOptions = {
      foundation: { price: 0, label: 'Technical SEO foundation' },
      growth: { price: 250, label: 'Multi-page keyword & local SEO' },
      strategy: { price: 500, label: 'SEO content strategy' }
    };

    const presets = {
      landing: {
        pages: 1,
        database: 'none',
        seo: 'foundation',
        features: [],
        note: 'A focused, responsive one-page website with on-page and technical SEO.'
      },
      shipping: {
        pages: 7,
        database: 'application',
        seo: 'growth',
        features: ['worker', 'admin', 'auth', 'uploads', 'integration'],
        startingPrice: 3000,
        note: 'A database-backed shipping platform with tracking, customer access and operational tools.'
      },
      travel: {
        pages: 9,
        database: 'application',
        seo: 'growth',
        features: ['worker', 'admin', 'booking', 'integration'],
        startingPrice: 3000,
        note: 'A searchable travel platform with managed listings, enquiries or bookings and integrations.'
      }
    };

    const getSelectedFeatures = () => featureInputs.filter(input => input.checked).map(input => input.value);

    const updateEstimate = () => {
      const pages = Number(pageInput.value);
      const pagePrice = pages === 1 ? 700 : 1000 + Math.max(0, pages - 2) * 150;
      const database = databaseOptions[databaseInput.value];
      const seo = seoOptions[seoInput.value];
      const selectedFeatures = getSelectedFeatures();
      const featuresTotal = selectedFeatures.reduce((total, feature) => total + featurePrices[feature], 0);
      const total = pagePrice + database.price + seo.price + featuresTotal;
      const hasOnlyFoundation = databaseInput.value === 'none' && seoInput.value === 'foundation' && selectedFeatures.length === 0;
      const isFixedStarter = hasOnlyFoundation && pages <= 2;
      const activePreset = presetButtons.find(button => button.classList.contains('is-active'));
      const preset = activePreset ? presets[activePreset.dataset.preset] : null;

      pageOutput.value = pages;
      estimateRange.textContent = preset?.startingPrice
        ? `From $${preset.startingPrice.toLocaleString()}`
        : isFixedStarter
          ? `$${total.toLocaleString()}`
          : `From $${total.toLocaleString()}`;

      const summary = [
        `${pages} designed page${pages === 1 ? ' / layout' : 's / layouts'}`,
        'Responsive design & development',
        seo.label,
        'Cloudflare Pages deployment'
      ];

      if (database.label) summary.push(database.label);
      selectedFeatures.forEach(feature => summary.push(featureLabels[feature]));
      estimateSummary.innerHTML = summary.map(item => `<li>${item}</li>`).join('');

      estimateNote.textContent = activePreset
        ? presets[activePreset.dataset.preset].note
        : 'A custom website scope based on the pages, data and application features selected.';

      const subject = encodeURIComponent('Website project estimate');
      const body = encodeURIComponent(`Hi EmiOps,\n\nI'd like to discuss a website project.\nEstimated budget: ${estimateRange.textContent} USD\nUnique layouts: ${pages}\nData: ${databaseInput.options[databaseInput.selectedIndex].text}\nFeatures: ${selectedFeatures.length ? selectedFeatures.map(feature => featureLabels[feature]).join(', ') : 'None'}\nSEO: ${seoInput.options[seoInput.selectedIndex].text}\n`);
      estimateCta.href = `mailto:hello@emiops.com?subject=${subject}&body=${body}`;
    };

    const clearActivePreset = () => {
      presetButtons.forEach(button => {
        button.classList.remove('is-active');
        button.setAttribute('aria-pressed', 'false');
      });
    };

    presetButtons.forEach(button => {
      button.addEventListener('click', () => {
        const preset = presets[button.dataset.preset];
        clearActivePreset();
        button.classList.add('is-active');
        button.setAttribute('aria-pressed', 'true');
        pageInput.value = preset.pages;
        databaseInput.value = preset.database;
        seoInput.value = preset.seo;
        featureInputs.forEach(input => {
          input.checked = preset.features.includes(input.value);
        });
        updateEstimate();
      });
    });

    [pageInput, databaseInput, seoInput, ...featureInputs].forEach(input => {
      input.addEventListener('input', () => {
        clearActivePreset();
        updateEstimate();
      });
    });

    updateEstimate();
  }
});
