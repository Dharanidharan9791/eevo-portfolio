import React, { useState, useEffect, useRef } from 'react';
import eevoLogo from '../assets/eevo-no-bg.png';
import './ComingSoon.css';

export default function ComingSoon() {
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedType, setCopiedType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    eventType: 'Wedding',
    date: '',
    notes: '',
  });

  const canvasRef = useRef(null);

  // Background subtle star particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Subtle 4-point star particles matching brand theme
    const particleCount = Math.min(32, Math.floor(window.innerWidth / 40));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.2 + 1.2,
      opacity: Math.random() * 0.45 + 0.15,
      speedY: -(Math.random() * 0.25 + 0.08),
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.speedY;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        const currentOpacity =
          p.opacity * (0.65 + 0.35 * Math.sin(tick * p.twinkleSpeed + p.twinkleOffset));

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.fillStyle = `rgba(180, 142, 68, ${currentOpacity})`;

        // Draw elegant 4-point star shape
        const r = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -r * 2);
        ctx.quadraticCurveTo(0, 0, r * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, r * 2);
        ctx.quadraticCurveTo(0, 0, -r * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r * 2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleCopy = (text, type, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedType(type);
      setToastMessage(`${label} copied to clipboard`);
      setTimeout(() => {
        setCopiedType(null);
      }, 2500);
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    // Graceful fallback to mailto if access key is not yet configured in .env
    if (!accessKey || accessKey === 'your_access_key_here') {
      const subject = encodeURIComponent(`Celebration Enquiry: ${formData.eventType} - ${formData.name}`);
      const body = encodeURIComponent(
        `Hi eevo Team,\n\nI would like to enquire about your curation services:\n\n` +
        `Name: ${formData.name}\n` +
        `Contact: ${formData.contact}\n` +
        `Occasion: ${formData.eventType}\n` +
        `Preferred Date/Season: ${formData.date || 'TBD'}\n` +
        `Vision / Notes: ${formData.notes || 'N/A'}\n\n` +
        `Looking forward to hearing from you!`
      );
      window.location.href = `mailto:enquiry@eevo.events?subject=${subject}&body=${body}`;
      setFormSubmitted(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        access_key: accessKey,
        subject: `Celebration Enquiry: ${formData.eventType} - ${formData.name}`,
        from_name: 'eevo enquiry',
        name: formData.name,
        contact: formData.contact,
        occasion: formData.eventType,
        preferred_date: formData.date || 'TBD',
        vision_notes: formData.notes || 'N/A',
      };

      if (formData.contact && formData.contact.includes('@')) {
        payload.replyto = formData.contact.trim();
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setFormSubmitted(true);
      } else {
        setSubmitError(result.message || 'Unable to transmit brief. Please reach us directly at enquiry@eevo.events.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError('Network connection issue. Please contact enquiry@eevo.events or call 9445274264.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pillars = [
    {
      number: '01',
      title: 'Bespoke Celebrations',
      description:
        'Milestone birthdays, intimate nuptials, and heritage anniversaries curated with poetic elegance and personal narrative.',
    },
    {
      number: '02',
      title: 'Curated Experiences',
      description:
        'Atmospheric private soirées, sensory chef table dinners, retreats, and bespoke brand experiences designed to linger in memory.',
    },
    {
      number: '03',
      title: 'Complete Orchestration',
      description:
        'Seamless end-to-end stewardship—from conceptual aesthetics and venue harmony to vendor coordination and flawless on-day execution.',
    },
  ];

  return (
    <div className="eevo-page-wrapper">
      {/* Subtle Star Particle Canvas */}
      <canvas ref={canvasRef} className="eevo-ambient-canvas" aria-hidden="true" />
      <div className="eevo-ambient-glow" aria-hidden="true" />

      {/* Main Content */}
      <main className="eevo-content-container">
        {/* Status Pill Badge with Starlight & Shimmer Animation */}


        {/* Brand Logo Presentation */}
        <div className="eevo-logo-wrapper">
          <img
            src={eevoLogo}
            alt="eevo - Your Celebration Partner"
            className="eevo-brand-logo"
            width="220"
            height="auto"
          />
        </div>
        <div className="eevo-divider-line" aria-hidden="true" />

        <div className="eevo-status-badge" role="status">
          <span className="eevo-status-star" aria-hidden="true">
            ✦
          </span>
          <span className="eevo-status-text">Digital Portfolio Arriving Soon</span>
          <span className="eevo-status-gleam" aria-hidden="true" />
        </div>
        {/* Delicate Gold Gleam Divider */}

        {/* Main Editorial Headline */}
        <h1 className="eevo-hero-title">
          Where Meaningful Moments Become <em>Timeless Memories</em>.
        </h1>

        {/* Brand Explanation */}
        <p className="eevo-hero-description">
          <strong>eevo</strong> is an experiential celebration and event curation studio. We specialize in designing
          bespoke gatherings, milestone celebrations, and immersive occasions with quiet luxury, intentional aesthetics, and effortless grace.
        </p>

        {/* Core Pillars / Service Explanations */}
        <section className="eevo-pillars-grid" aria-label="Our Curation Services">
          {pillars.map((pillar) => (
            <article key={pillar.number} className="eevo-pillar-card">
              <div className="eevo-pillar-number">
                <span aria-hidden="true">✦</span> {pillar.number}
              </div>
              <h2 className="eevo-pillar-title">{pillar.title}</h2>
              <p className="eevo-pillar-text">{pillar.description}</p>
            </article>
          ))}
        </section>

        {/* Direct Contact & Enquiry Section */}
        <section className="eevo-contact-wrapper" aria-label="Enquiries and Reservations">
          <h2 className="eevo-contact-heading">Begin Your Celebration</h2>
          <p className="eevo-contact-sub">
            While our full digital lookbook is under crafting, our concierge calendar is open for reservations and early planning.
          </p>

          <div className="eevo-contact-grid">
            {/* Email Contact Card */}
            <div className="eevo-contact-item">
              <div className="eevo-contact-meta">
                <svg className="eevo-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span className="eevo-contact-label">Enquiry Email</span>
              </div>
              <div className="eevo-contact-value">enquiry@eevo.events</div>
              <div className="eevo-contact-actions">
                <a
                  href="mailto:enquiry@eevo.events?subject=Celebration%20Enquiry%20-%20eevo"
                  className="eevo-btn-primary"
                  id="email-enquiry-link"
                  title="Open in default mail client"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  Email
                </a>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=enquiry@eevo.events&su=Celebration%20Enquiry%20-%20eevo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eevo-btn-secondary"
                  id="gmail-enquiry-link"
                  title="Open directly in Gmail Web"
                >
                  Gmail
                </a>
                <button
                  type="button"
                  className={`eevo-btn-copy ${copiedType === 'email' ? 'copied' : ''}`}
                  onClick={() => handleCopy('enquiry@eevo.events', 'email', 'Email')}
                  title="Copy email address"
                  id="copy-email-btn"
                  aria-label="Copy email address"
                >
                  {copiedType === 'email' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Phone Contact Card */}
            <div className="eevo-contact-item">
              <div className="eevo-contact-meta">
                <svg className="eevo-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span className="eevo-contact-label">Direct Line / WhatsApp</span>
              </div>
              <div className="eevo-contact-value">+91 94452 74264</div>
              <div className="eevo-contact-actions">
                <a
                  href="tel:+919445274264"
                  className="eevo-btn-primary"
                  id="phone-call-link"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  Call
                </a>
                <a
                  href="https://wa.me/919445274264?text=Hello%20team%20eevo,%20I'd%20love%20to%20enquire%20about%20planning%20an%20upcoming%20celebration."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eevo-btn-secondary"
                  id="whatsapp-chat-link"
                  title="Chat on WhatsApp"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  WhatsApp
                </a>
                <button
                  type="button"
                  className={`eevo-btn-copy ${copiedType === 'phone' ? 'copied' : ''}`}
                  onClick={() => handleCopy('9445274264', 'phone', 'Contact number')}
                  title="Copy contact number"
                  id="copy-phone-btn"
                  aria-label="Copy phone number"
                >
                  {copiedType === 'phone' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Instagram Contact Card */}
            <div className="eevo-contact-item">
              <div className="eevo-contact-meta">
                <svg className="eevo-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span className="eevo-contact-label">Instagram / Lookbook</span>
              </div>
              <div className="eevo-contact-value">@eevo.events</div>
              <div className="eevo-contact-actions">
                <a
                  href="https://www.instagram.com/eevo.events/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eevo-btn-primary"
                  id="instagram-profile-link"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  Follow
                </a>
                <button
                  type="button"
                  className={`eevo-btn-copy ${copiedType === 'instagram' ? 'copied' : ''}`}
                  onClick={() => handleCopy('https://www.instagram.com/eevo.events/', 'instagram', 'Instagram URL')}
                  title="Copy Instagram link"
                  id="copy-instagram-btn"
                  aria-label="Copy Instagram link"
                >
                  {copiedType === 'instagram' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Consultation Request CTA */}
          <div className="eevo-inquiry-trigger-box">
            <span className="eevo-inquiry-text">
              Have a specific event date or occasion in mind?
            </span>
            <button
              type="button"
              className="eevo-inquiry-trigger-btn"
              onClick={() => {
                setIsModalOpen(true);
                setFormSubmitted(false);
              }}
              id="open-inquiry-modal-btn"
            >
              <span>Submit Early Brief</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </section>
      </main>

      {/* Early Inquiry Modal */}
      {isModalOpen && (
        <div
          className="eevo-modal-backdrop"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="eevo-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="eevo-modal-close-btn"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
              id="close-modal-btn"
            >
              ✕
            </button>

            <div className="eevo-modal-header">
              <h3 className="eevo-modal-title" id="modal-title">
                Enquire for Your Celebration
              </h3>
              <p className="eevo-modal-desc">
                Share a few early notes about your gathering. Our curation team will review and respond promptly.
              </p>
            </div>

            {formSubmitted ? (
              <div className="eevo-success-message">
                <h4>Brief Received</h4>
                <p>
                  Thank you! Your celebration brief has been transmitted directly to our curation team. We will review your vision and connect promptly. Alternatively, reach us directly at <strong>enquiry@eevo.events</strong> or <strong>9445274264</strong>.
                </p>
                <button
                  type="button"
                  className="eevo-modal-submit-btn"
                  style={{ marginTop: '1.2rem' }}
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormSubmitted(false);
                    setSubmitError(null);
                    setFormData({
                      name: '',
                      contact: '',
                      eventType: 'Wedding',
                      date: '',
                      notes: '',
                    });
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                {/* Anti-spam honeypot */}
                <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />
                <div className="eevo-form-group">
                  <label className="eevo-form-label" htmlFor="client-name">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="client-name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    className="eevo-form-input"
                    placeholder="e.g. Eleanor Vance"
                  />
                </div>

                <div className="eevo-form-row">
                  <div className="eevo-form-group">
                    <label className="eevo-form-label" htmlFor="client-contact">
                      Contact / Phone
                    </label>
                    <input
                      type="text"
                      id="client-contact"
                      name="contact"
                      required
                      value={formData.contact}
                      onChange={handleFormChange}
                      className="eevo-form-input"
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>

                  <div className="eevo-form-group">
                    <label className="eevo-form-label" htmlFor="client-type">
                      Occasion
                    </label>
                    <select
                      id="client-type"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleFormChange}
                      className="eevo-form-select"
                    >
                      <option value="Wedding">Wedding / Reception</option>
                      <option value="Milestone Birthday">Milestone Birthday</option>
                      <option value="Anniversary">Heritage Anniversary</option>
                      <option value="Private Soirée">Private Soirée / Dining</option>
                      <option value="Brand Experience">Brand Launch / Gala</option>
                      <option value="Other Celebration">Other Celebration</option>
                    </select>
                  </div>
                </div>

                <div className="eevo-form-group">
                  <label className="eevo-form-label" htmlFor="client-date">
                    Approximate Date or Season
                  </label>
                  <input
                    type="text"
                    id="client-date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className="eevo-form-input"
                    placeholder="e.g. Late Autumn 2026 or Dec 15"
                  />
                </div>

                <div className="eevo-form-group">
                  <label className="eevo-form-label" htmlFor="client-notes">
                    Vision or Specific Requirements
                  </label>
                  <textarea
                    id="client-notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    className="eevo-form-textarea"
                    placeholder="Tell us about the atmosphere, approximate guest count, or venue ideas..."
                  />
                </div>

                {submitError && (
                  <div className="eevo-form-error-box" role="alert">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  className="eevo-modal-submit-btn"
                  id="submit-inquiry-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="eevo-spinner" aria-hidden="true"></span>
                      <span>Transmitting Brief...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Enquiry to Concierge</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="eevo-toast" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="eevo-footer">
        <div>
          © {new Date().getFullYear()} eevo. All rights reserved.
        </div>
        <div className="eevo-footer-social">
          <a
            href="https://www.instagram.com/eevo.events/"
            target="_blank"
            rel="noopener noreferrer"
            className="eevo-footer-link"
            aria-label="Follow eevo on Instagram"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span>@eevo.events</span>
          </a>
        </div>
        <div className="eevo-footer-tagline">
          YOUR CELEBRATION PARTNER.
        </div>
      </footer>
    </div>
  );
}
