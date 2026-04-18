import { useState, useEffect, useRef } from 'react'
import {
  Menu, X, ArrowRight, ChevronDown, Play,
  PhoneOff, Moon, ClipboardList, Zap,
  MessageSquare, Phone, MessageCircle, Globe,
  Settings, Link2, CalendarCheck,
  Check, Star, Mail, MapPin, Send,
  Users, Bot, TrendingUp, Shield, Clock, Sparkles
} from 'lucide-react'
import './App.css'

/* ─── OpenAI system prompt ──────────────────────────────────────────────────── */
const SYSTEM_PROMPT = `You are the AI assistant for WVH Developments Ltd, a UK-based AI automation agency that builds complete AI systems exclusively for mortgage brokers. You are friendly, professional and knowledgeable. Keep answers concise and helpful.

SERVICES:
We build: professional mortgage broker websites, AI website chatbots (24/7 lead qualification), AI phone assistants (answer every call 24/7), WhatsApp bots (handle WhatsApp enquiries automatically).

PACKAGES:
- Package 1: Website Only
- Package 2: Website + AI Chatbot
- Package 3: Website + AI Chatbot + AI Phone Assistant
- Package 4: Full Stack (everything — website, chatbot, phone assistant, WhatsApp bot) — MOST POPULAR
- Standalone: WhatsApp Bot + Phone Assistant
- Standalone: WhatsApp Bot only
- Standalone: Phone Assistant only

Pricing is tailored to each client based on their needs — direct anyone asking about pricing to get in touch via email or phone so we can put together a bespoke quote.

KEY FACTS:
- Setup: 5–10 working days
- No long-term contracts — cancel with 30 days notice
- No technical knowledge required — WVH handles everything
- Works alongside your existing phone number via call forwarding — no number change needed
- Runs 24/7 including nights and weekends
- Leads are qualified automatically and appointments booked into your calendar

CONTACT: will@wvhdevelopments.com

If someone wants to book a demo or get started, direct them to email will@wvhdevelopments.com. Never invent information not listed above.`

/* ─── Scroll fade-up animations ─────────────────────────────────────────────── */
function useScrollAnimations() {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-up')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

/* ─── Nav ────────────────────────────────────────────────────────────────────── */
function Nav({ onOpenChat }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const links = [
    { href: '#problem', label: 'Why WVH' },
    { href: '#solution', label: 'Solutions' },
    { href: '#how', label: 'How It Works' },
    { href: '#packages', label: 'Packages' },
    { href: '#faq', label: 'FAQ' },
  ]

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <div className="nav-inner">
          <a href="#" className="nav-brand">
            <div className="nav-brand-name">WVH <span>Developments</span></div>
            <div className="nav-brand-tag">AI Automation for Mortgage Brokers</div>
          </a>
          <div className="nav-links">
            {links.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
          </div>
          <div className="nav-right">
            <button className="nav-cta" onClick={onOpenChat}>
              Get a Free Demo <ArrowRight size={14} />
            </button>
            <button className="nav-mobile-btn" onClick={() => setOpen(o => !o)} aria-label="Menu">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        <div className={`nav-mobile${open ? '' : ' closed'}`}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <button className="nav-cta" onClick={() => { setOpen(false); onOpenChat() }}>
            Get a Free Demo <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </nav>
  )
}

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
function Hero({ onOpenChat }) {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <div className="hero-grid" />
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />
        <div className="hero-shapes">
          {[1,2,3,4,5,6].map(n => <div key={n} className={`shape shape-${n}`} />)}
        </div>
      </div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-eyebrow fade-up">
            <span className="hero-eyebrow-dot" />
            AI Systems Built Exclusively for UK Mortgage Brokers
          </div>
          <h1 className="hero-title fade-up d1">
            Stop Missing Leads.<br />
            <span className="accent-gold">Start Closing</span> Every{' '}
            <span className="accent-blue">Single One.</span>
          </h1>
          <p className="hero-sub fade-up d2">
            We build complete AI systems for mortgage brokers — professional websites, AI chatbots,
            WhatsApp bots and AI phone assistants working <strong>24 hours a day, 7 days a week</strong>,
            capturing and qualifying every enquiry automatically. You just show up to the appointments.
          </p>
          <div className="hero-actions fade-up d3">
            <button className="btn-primary" onClick={onOpenChat}>
              Book Your Free Demo <ArrowRight size={16} />
            </button>
            <a href="#solution" className="btn-secondary">
              See How It Works
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Trust Bar ──────────────────────────────────────────────────────────────── */
function TrustBar() {
  const stats = [
    { icon: <Users size={22} />, num: '40+', label: 'Mortgage Brokers Using the System' },
    { icon: <Bot size={22} />, num: '120+', label: 'AI Systems Running 24/7' },
    { icon: <TrendingUp size={22} />, num: '3,800+', label: 'Leads Captured Automatically' },
    { icon: <Clock size={22} />, num: '100%', label: 'Uptime. Every Call Answered.' },
  ]
  return (
    <div className="trust-bar">
      <div className="container">
        <div className="trust-inner">
          {stats.map((s, i) => (
            <div className={`trust-item fade-up d${i + 1}`} key={i}>
              <div className="trust-icon">{s.icon}</div>
              <div className="trust-num">{s.num}</div>
              <div className="trust-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Problem ────────────────────────────────────────────────────────────────── */
function Problem() {
  const cards = [
    { icon: <PhoneOff size={22} />, title: 'You miss calls while on appointments', desc: "Every time you're with a client, your phone rings out. That lead just called your competitor and got an answer immediately." },
    { icon: <Moon size={22} />, title: 'Enquiries come in late at night', desc: "People research mortgages at 10pm. When they contact you and hear silence, they move on. By morning, the lead is gone." },
    { icon: <ClipboardList size={22} />, title: "You're manually chasing every lead", desc: "Hours every week on follow-up calls, texts and emails. You're doing admin instead of advising clients and closing deals." },
    { icon: <Zap size={22} />, title: 'Faster brokers are stealing your clients', desc: "Speed wins in mortgage broking. If a lead gets a response in seconds from someone else, they go with them. Simple." },
  ]
  return (
    <section className="problem-section" id="problem">
      <div className="container">
        <div className="problem-header">
          <div className="section-label fade-up">The Real Problem</div>
          <h2 className="section-heading fade-up d1">You Are Losing Leads<br />Every Single Day</h2>
          <p className="section-sub fade-up d2">If you are not responding to enquiries within minutes, around the clock, you are leaving thousands of pounds on the table every month.</p>
        </div>
        <div className="problem-grid">
          {cards.map((c, i) => (
            <div className={`problem-card fade-up d${i + 1}`} key={i}>
              <div className="problem-icon-wrap">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Solution ───────────────────────────────────────────────────────────────── */
function Solution() {
  const cards = [
    { icon: <MessageSquare size={24} />, title: 'AI Website Chatbot', desc: "Embedded on your website, our AI chatbot greets every visitor, answers questions, qualifies their situation and collects their details — all day, all night, every day of the year.", tag: 'Qualifies Every Lead' },
    { icon: <Phone size={24} />, title: 'AI Phone Assistant', desc: "Answers every call you miss, 24/7. Takes details, answers common questions, qualifies the enquiry and books into your calendar automatically. No voicemail. No missed opportunity.", tag: 'Answers Every Call' },
    { icon: <MessageCircle size={24} />, title: 'WhatsApp Bot', desc: "The channel your clients actually prefer. Our WhatsApp bot handles inbound messages instantly — qualifying leads, answering FAQs and capturing contact details while you're with other clients.", tag: 'WhatsApp 24/7' },
    { icon: <Globe size={24} />, title: 'Professional Website', desc: "A fast, mobile-optimised, conversion-focused website built specifically for mortgage brokers. Designed to build trust, generate enquiries and position you as the credible, standout choice.", tag: 'Built to Convert' },
  ]
  return (
    <section className="solution-section" id="solution">
      <div className="container">
        <div className="solution-header">
          <div className="section-label fade-up">The WVH System</div>
          <h2 className="section-heading fade-up d1">Your Complete AI System,<br />Built and Managed For You</h2>
          <p className="section-sub fade-up d2">WVH Developments builds a fully integrated AI ecosystem tailored to your brokerage. Every enquiry gets captured, qualified and followed up — automatically.</p>
        </div>
        <div className="solution-grid">
          {cards.map((c, i) => (
            <div className={`solution-card fade-up d${i + 1}`} key={i}>
              <div className="solution-icon-wrap">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <div className="solution-tag"><Check size={11} /> {c.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── How It Works ───────────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { icon: <Settings size={28} />, num: '01', title: 'We Build Your Complete AI System', desc: 'We design and build your entire AI ecosystem from scratch — chatbot, phone assistant, WhatsApp bot and website, all tailored to your brokerage.' },
    { icon: <Link2 size={28} />, num: '02', title: 'We Connect Everything', desc: "We integrate your AI with your existing phone number, WhatsApp Business account and website. No technical work required from you." },
    { icon: <TrendingUp size={28} />, num: '03', title: 'Leads Flow In Automatically', desc: 'Your AI handles every enquiry — qualifying leads, collecting details and booking appointments into your calendar around the clock.' },
    { icon: <CalendarCheck size={28} />, num: '04', title: 'You Just Show Up', desc: 'Wake up to qualified appointments already in your diary. Your only job is to show up and give great advice. The AI handles everything else.' },
  ]
  return (
    <section className="how-section" id="how">
      <div className="container">
        <div className="how-header">
          <div className="section-label fade-up">Simple Process</div>
          <h2 className="section-heading fade-up d1">Up and Running<br />in Days, Not Months</h2>
          <p className="section-sub fade-up d2">We handle every step of the setup. You will be live with a fully operational AI system faster than you think.</p>
        </div>
        <div className="how-steps">
          {steps.map((s, i) => (
            <div className={`how-step fade-up d${i + 1}`} key={i}>
              <div className="how-step-num">
                {s.icon}
                <span className="how-num-label">{s.num}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Demo Video ─────────────────────────────────────────────────────────────── */
function DemoVideo() {
  return (
    <section className="demo-section" id="demo">
      <div className="container">
        <div className="demo-header">
          <div className="section-label fade-up">Live Demos</div>
          <h2 className="section-heading fade-up d1">See It In Action</h2>
        </div>
        <p className="demo-desc fade-up d2">These are real demos of the actual WVH AI system in use. Watch how it handles real enquiries — qualifying leads and booking appointments without any human involvement.</p>
        <div className="demo-grid">
          {[
            { title: 'WhatsApp Bot Demo', desc: 'Watch our WhatsApp bot qualify a live mortgage enquiry from first message to booked appointment.', label: 'WHATSAPP BOT' },
            { title: 'AI Phone Assistant Demo', desc: 'Hear how our AI phone assistant handles a cold inbound call — taking details, answering questions and booking the appointment.', label: 'PHONE ASSISTANT' },
          ].map((d, i) => (
            <div className={`demo-card fade-up d${i + 1}`} key={i}>
              <div className="demo-video-wrap">
                <div className="demo-video-placeholder">
                  <div className="demo-play-btn"><Play size={24} fill="currentColor" /></div>
                  <div className="demo-video-label">{d.label}</div>
                </div>
              </div>
              <div className="demo-card-footer">
                <div className="demo-badge"><span className="live-dot" /> Real System Demo</div>
                <h3>{d.title}</h3>
                <p>{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Packages ───────────────────────────────────────────────────────────────── */
function Packages({ onOpenChat }) {
  const main = [
    { pkg: 'Package 1', title: 'Website Only', features: ['Professional mortgage broker website', 'Mobile-optimised & fast loading', 'Built to convert visitors to enquiries', 'Monthly hosting & maintenance', 'Regular updates & support'], popular: false },
    { pkg: 'Package 2', title: 'Website + AI Chatbot', features: ['Everything in Package 1', 'AI website chatbot installed', '24/7 lead qualification on your site', 'Automatic lead capture & notifications', 'Customised to your brokerage'], popular: false },
    { pkg: 'Package 3', title: 'Website + Chatbot + Phone AI', features: ['Everything in Package 2', 'AI phone assistant (24/7 call answering)', 'Missed call handling & booking', 'Appointment booking to your calendar', 'Full monthly management included'], popular: false },
    { pkg: 'Package 4', title: 'Full Stack — Everything', features: ['Professional website', 'AI website chatbot', 'AI phone assistant (24/7)', 'WhatsApp bot (24/7)', 'Complete lead capture ecosystem', 'Priority support & management'], popular: true },
  ]
  const standalone = [
    { title: 'WhatsApp Bot + Phone Assistant' },
    { title: 'WhatsApp Bot Only' },
    { title: 'Phone Assistant Only' },
  ]
  return (
    <section className="packages-section" id="packages">
      <div className="container">
        <div className="packages-header">
          <div className="section-label fade-up">Packages</div>
          <h2 className="section-heading fade-up d1">Everything Built and Managed For You</h2>
        </div>
        <p className="section-sub packages-sub fade-up d2">Choose the package that fits your brokerage. Every system is fully built and managed by WVH Developments Ltd — no technical knowledge required. Get in touch for a bespoke quote.</p>
        <div className="packages-main">
          {main.map((p, i) => (
            <div className={`pkg-card fade-up d${i + 1}${p.popular ? ' popular' : ''}`} key={i}>
              {p.popular && <div className="pkg-popular-badge">Most Popular</div>}
              <div className="pkg-name">{p.pkg}</div>
              <div className="pkg-title">{p.title}</div>
              <div className="pkg-price-wrap">
                <div className="pkg-quote">Bespoke Pricing</div>
                <div className="pkg-quote-sub">Get in touch for a tailored quote</div>
              </div>
              <div className="pkg-divider" />
              <div className="pkg-features">
                {p.features.map((f, fi) => (
                  <div className="pkg-feature" key={fi}>
                    <Check size={14} className="pkg-check" />{f}
                  </div>
                ))}
              </div>
              <button className="pkg-cta" onClick={onOpenChat}>
                Get Started <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="packages-standalone fade-up">
          <h3>Standalone Add-Ons</h3>
          <div className="standalone-grid">
            {standalone.map((s, i) => (
              <div className="standalone-card" key={i}>
                <h4>{s.title}</h4>
                <div className="standalone-quote">Bespoke Pricing</div>
                <div className="standalone-quote-sub">Get in touch for a tailored quote</div>
              </div>
            ))}
          </div>
        </div>
        <div className="packages-note fade-up">
          <Shield size={14} style={{display:'inline',marginRight:'6px',verticalAlign:'middle'}} />
          <strong>All systems are fully built and managed by WVH Developments Ltd.</strong>{' '}No technical knowledge required. We handle setup, maintenance and ongoing management.
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials ───────────────────────────────────────────────────────────── */
function Testimonials() {
  const reviews = [
    { text: "I was genuinely sceptical about AI handling my client enquiries. Within the first week, the phone assistant had booked three appointments I would have completely missed because I was on calls. The WhatsApp bot alone has transformed how I manage leads. I cannot imagine going back.", name: 'Jack Neale', role: 'Independent Mortgage Broker', initials: 'JN' },
    { text: "WVH built our full AI system and it was seamless from start to finish. The website is exceptional and the chatbot captures leads we would never have seen before — evenings, weekends, 2am. Our enquiry volume has increased significantly and we are spending less time chasing and more time advising.", name: 'Rite Torc Services', role: 'Mortgage Brokerage, South East England', initials: 'RT' }
  ]
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <div className="section-label fade-up">Client Results</div>
          <h2 className="section-heading fade-up d1">Brokers Who Made the Switch</h2>
        </div>
        <div className="testimonials-grid">
          {reviews.map((r, i) => (
            <div className={`testimonial-card fade-up d${i + 1}`} key={i}>
              <div className="testimonial-quote-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor"><path d="M14 24h-4c0-5.5 4.5-10 10-10v4c-3.3 0-6 2.7-6 6zm16 0h-4c0-5.5 4.5-10 10-10v4c-3.3 0-6 2.7-6 6z" opacity="0.4"/></svg>
              </div>
              <div className="testimonial-stars">
                {[...Array(5)].map((_, si) => <Star key={si} size={16} />)}
              </div>
              <p className="testimonial-text">"{r.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{r.initials}</div>
                <div>
                  <div className="testimonial-name">{r.name}</div>
                  <div className="testimonial-role">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ — FIXED: fade-up is on a wrapper div, not the element that gets ────── */
/* ─── 'open' added to its class. React no longer wipes the 'visible' class. ─── */
function FAQ() {
  const [open, setOpen] = useState(null)
  const items = [
    { q: 'Do I need to change my existing phone number?', a: "Not at all. Our AI phone assistant works alongside your existing number. We set up call forwarding so that when you're unavailable, calls are seamlessly handled by the AI. Your clients always call the same number they already know." },
    { q: 'How long does it take to set everything up?', a: "Most clients are fully live within 5 to 10 working days. We handle the entire setup — website build, AI configuration, WhatsApp integration and phone assistant — so you don't need to do anything technical. We keep you updated throughout." },
    { q: 'What happens if the AI cannot answer a question?', a: "The AI is trained to handle the vast majority of mortgage enquiry questions. In the rare case it encounters something outside its knowledge, it politely takes the client's details and lets them know you will be in touch personally. No lead is ever lost or left frustrated." },
    { q: 'Is there a contract? Am I locked in?', a: "No long-term contracts. You pay a one-off build fee and then a monthly management fee. You can cancel with 30 days notice at any time. We believe in earning your business every month — not locking you in." },
    { q: 'Can I see a demo before I commit?', a: "Absolutely, and we actively encourage it. Chat with our AI assistant right now, or contact us directly. We will walk you through the full system live, show you exactly how it handles real enquiries, and answer every question you have. No obligation whatsoever." },
    { q: 'What kind of leads will the AI capture?', a: "The system captures any mortgage-related enquiry — first-time buyers, remortgages, buy-to-let, self-employed applicants, debt consolidation and more. The AI qualifies each lead based on your preferences and collects the information you need before your call." },
  ]
  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="faq-header">
          <div className="section-label fade-up">Common Questions</div>
          <h2 className="section-heading fade-up d1">Everything You Need to Know</h2>
        </div>
        <div className="faq-list">
          {items.map((item, i) => (
            /* The fade-up wrapper never changes class — React only touches the inner faq-item */
            <div className={`fade-up d${Math.min(i + 1, 5)}`} key={i}>
              <div className={`faq-item${open === i ? ' open' : ''}`}>
                <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
                  {item.q}
                  <ChevronDown size={18} className="faq-chevron" />
                </button>
                <div className="faq-answer" style={{ maxHeight: open === i ? '400px' : '0' }}>
                  <div className="faq-answer-inner">{item.a}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Contact — no form, everything through the AI chatbot ──────────────────── */
function Contact({ onOpenChat }) {
  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="contact-header">
          <div className="section-label fade-up">Get Started</div>
          <h2 className="section-heading fade-up d1">Ready to Stop Missing Leads?</h2>
          <p className="section-sub fade-up d2" style={{ margin: '0 auto' }}>
            Chat with our AI assistant right now. Ask about pricing, how it works,
            what's included — it knows everything. Or reach out directly.
          </p>
        </div>

        <div className="contact-cta-row fade-up d3">
          <div className="contact-ai-card">
            <div className="contact-ai-icon">
              <Sparkles size={28} />
            </div>
            <h3>Chat With Our AI Now</h3>
            <p>Ask anything — pricing, setup, how the phone assistant works, what's included in each package. Get an instant answer without waiting.</p>
            <button className="btn-primary contact-chat-btn" onClick={onOpenChat}>
              <Bot size={18} /> Start a Conversation
            </button>
          </div>

          <div className="contact-or">
            <div className="contact-or-line" />
            <span>or reach us directly</span>
            <div className="contact-or-line" />
          </div>

          <div className="contact-details-grid">
            {[
              { icon: <Mail size={18} />, label: 'Email', value: 'will@wvhdevelopments.com', href: 'mailto:will@wvhdevelopments.com' },
              { icon: <MapPin size={18} />, label: 'Based in', value: 'England & Wales', href: null },
              { icon: <Clock size={18} />, label: 'Response time', value: 'Within 24 hours', href: null },
            ].map((d, i) => (
              <div className="contact-detail-card" key={i}>
                <div className="contact-detail-icon">{d.icon}</div>
                <div>
                  <div className="contact-detail-label">{d.label}</div>
                  {d.href
                    ? <a className="contact-detail-value contact-detail-link" href={d.href}>{d.value}</a>
                    : <div className="contact-detail-value">{d.value}</div>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── AI Chatbot ─────────────────────────────────────────────────────────────── */
function Chatbot({ isOpen, setIsOpen }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm the WVH AI assistant. I can tell you everything about our AI systems for mortgage brokers — pricing, how it works, setup time, what's included. What would you like to know?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasNotif, setHasNotif] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setHasNotif(false)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...newMessages]
        })
      })
      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content
        ?? "Sorry, I couldn't get a response right now. Please email us at will@wvhdevelopments.com"
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having a technical issue right now. Please email will@wvhdevelopments.com and we'll get back to you shortly." }])
    }
    setLoading(false)
  }

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const suggestions = ["What's included in Package 4?", "How long does setup take?", "Do I need to change my phone number?", "How does the WhatsApp bot work?"]

  return (
    <>
      {/* Chat Window */}
      <div className={`chatbot-window${isOpen ? ' open' : ''}`} role="dialog" aria-label="WVH AI Assistant">
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-avatar"><Bot size={20} /></div>
          <div className="chatbot-header-info">
            <div className="chatbot-header-name">WVH AI Assistant</div>
            <div className="chatbot-header-status">
              <span className="live-dot" /> Online now
            </div>
          </div>
          <button className="chatbot-close" onClick={() => setIsOpen(false)} aria-label="Close chat">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((m, i) => (
            <div className={`chatbot-msg ${m.role}`} key={i}>
              {m.role === 'assistant' && (
                <div className="chatbot-msg-icon"><Bot size={14} /></div>
              )}
              <div className="chatbot-msg-bubble">{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="chatbot-msg assistant">
              <div className="chatbot-msg-icon"><Bot size={14} /></div>
              <div className="chatbot-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions (only show at start) */}
        {messages.length === 1 && (
          <div className="chatbot-suggestions">
            {suggestions.map((s, i) => (
              <button key={i} className="chatbot-suggestion" onClick={() => { setInput(s); inputRef.current?.focus() }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="chatbot-input-area">
          <textarea
            ref={inputRef}
            className="chatbot-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask me anything..."
            rows={1}
          />
          <button className="chatbot-send" onClick={send} disabled={!input.trim() || loading} aria-label="Send">
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Bubble */}
      <button className="chatbot-bubble" onClick={() => setIsOpen(o => !o)} aria-label="Open chat">
        {isOpen ? <X size={24} /> : <Bot size={24} />}
        {hasNotif && !isOpen && <span className="chatbot-notif">1</span>}
      </button>
    </>
  )
}

/* ─── Footer ─────────────────────────────────────────────────────────────────── */
function Footer() {
  const nav = ['#problem', '#solution', '#how', '#packages', '#faq', '#contact']
  const labels = ['Why WVH', 'Our Solutions', 'How It Works', 'Packages', 'FAQ', 'Contact']
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-name">WVH <span>Developments</span> Ltd</div>
            <p className="footer-tagline">The complete AI automation system built exclusively for UK mortgage brokers. Never miss another lead. Never miss another opportunity.</p>
          </div>
          <div>
            <div className="footer-nav-title">Navigation</div>
            <div className="footer-nav-links">
              {nav.map((href, i) => <a key={href} href={href}>{labels[i]}</a>)}
            </div>
          </div>
          <div>
            <div className="footer-nav-title">Contact</div>
            <div className="footer-nav-links">
              <a href="mailto:will@wvhdevelopments.com">will@wvhdevelopments.com</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© {new Date().getFullYear()} WVH Developments Ltd. All rights reserved.</div>
          <div className="footer-reg">WVH Developments Ltd is a registered company in England and Wales.</div>
        </div>
      </div>
    </footer>
  )
}

/* ─── App ────────────────────────────────────────────────────────────────────── */
export default function App() {
  const [chatOpen, setChatOpen] = useState(false)
  useScrollAnimations()
  return (
    <>
      <Nav onOpenChat={() => setChatOpen(true)} />
      <Hero onOpenChat={() => setChatOpen(true)} />
      <TrustBar />
      <Problem />
      <Solution />
      <HowItWorks />
      <DemoVideo />
      <Packages onOpenChat={() => setChatOpen(true)} />
      <Testimonials />
      <FAQ />
      <Contact onOpenChat={() => setChatOpen(true)} />
      <Footer />
      <Chatbot isOpen={chatOpen} setIsOpen={setChatOpen} />
    </>
  )
}
