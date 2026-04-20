import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
const whatsappVideo = '/whatsapp.mp4'
const phoneVideo = '/phone.mp4'
import {
  Menu, X, ArrowRight, ChevronDown,
  PhoneOff, Moon, ClipboardList, Zap,
  MessageSquare, Phone, MessageCircle, Globe,
  Settings, Link2, CalendarCheck,
  Check, Star, Mail, MapPin, Send,
  Users, Bot, TrendingUp, Shield, Clock, Sparkles
} from 'lucide-react'
import './App.css'

/* ─── System prompt ──────────────────────────────────────────────────────────── */
const SYSTEM_PROMPT = `You are the AI assistant for WVH Developments Ltd, a UK-based AI automation agency that builds complete AI systems for businesses of all types. You are friendly, professional and concise.

SERVICES:
We build: professional websites, AI website chatbots (24/7 lead qualification), AI phone assistants (answer every call 24/7), WhatsApp bots (handle WhatsApp enquiries automatically).

PACKAGES:
- Package 1: Website Only
- Package 2: Website + AI Chatbot
- Package 3: Website + AI Chatbot + AI Phone Assistant
- Package 4: Full Stack (everything — website, chatbot, phone assistant, WhatsApp bot) — MOST POPULAR
- Standalone: WhatsApp Bot + Phone Assistant
- Standalone: WhatsApp Bot only
- Standalone: Phone Assistant only

Pricing is bespoke — direct anyone asking to email will@wvhdevelopments.com for a tailored quote.

KEY FACTS:
- Setup: 2-3 weeks
- No long-term contracts — cancel with 30 days notice
- No technical knowledge required — WVH handles everything
- AI phone assistant is flexible: can use a brand new number, work alongside an existing number via call forwarding, or handle only out-of-hours/missed calls — fully customisable
- Runs 24/7 or configured for specific hours only

CONTACT: will@wvhdevelopments.com

If someone wants a demo or quote, tell them to email will@wvhdevelopments.com. Never invent information not listed above.`

/* ─── Three.js hero canvas ───────────────────────────────────────────────────── */
function HeroCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return
    const w = el.clientWidth, h = el.clientHeight
    const mobile = w < 768
    const COUNT = mobile ? 65 : 120

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000)
    camera.position.z = 9

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    // Particles
    const pos = new Float32Array(COUNT * 3)
    const vel = new Float32Array(COUNT * 3)
    const col = new Float32Array(COUNT * 3)
    const cBlue = new THREE.Color(0x3B7DDD)
    const cGold = new THREE.Color(0xD4A853)
    const spread = mobile ? 12 : 20

    for (let i = 0; i < COUNT; i++) {
      pos[i*3]   = (Math.random() - 0.5) * spread
      pos[i*3+1] = (Math.random() - 0.5) * spread * 0.65
      pos[i*3+2] = (Math.random() - 0.5) * 5
      vel[i*3]   = (Math.random() - 0.5) * 0.007
      vel[i*3+1] = (Math.random() - 0.5) * 0.007
      const c = Math.random() > 0.8 ? cGold : cBlue
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b
    }

    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    const pMat = new THREE.PointsMaterial({ size: mobile ? 0.055 : 0.075, vertexColors: true, transparent: true, opacity: 0.9 })
    scene.add(new THREE.Points(pGeo, pMat))

    // Lines — pre-allocate buffer
    const MAX_PAIRS = COUNT * (COUNT - 1) / 2
    const lineBuf = new Float32Array(MAX_PAIRS * 6)
    const lAttr = new THREE.BufferAttribute(lineBuf, 3)
    lAttr.setUsage(THREE.DynamicDrawUsage)
    const lGeo = new THREE.BufferGeometry()
    lGeo.setAttribute('position', lAttr)
    const lMat = new THREE.LineBasicMaterial({ color: 0x3B7DDD, transparent: true, opacity: 0.1 })
    const lineObj = new THREE.LineSegments(lGeo, lMat)
    scene.add(lineObj)

    // Wireframe shapes
    const shapes = [
      { g: new THREE.IcosahedronGeometry(2.2, 0), p: [-9, 4, -4], r: [0.003, 0.005, 0] },
      { g: new THREE.OctahedronGeometry(1.8, 0),  p: [9, -3, -3], r: [0.004, 0.003, 0.002] },
      { g: new THREE.TetrahedronGeometry(2, 0),   p: [2, -6, -5], r: [0.002, 0.006, 0.001] },
    ]
    const meshes = shapes.map(s => {
      const m = new THREE.Mesh(s.g, new THREE.MeshBasicMaterial({ color: 0x3B7DDD, wireframe: true, transparent: true, opacity: 0.04 }))
      m.position.set(...s.p); m.userData.r = s.r
      scene.add(m); return m
    })

    let mx = 0, my = 0
    const onMove = e => { mx = (e.clientX / window.innerWidth - 0.5); my = -(e.clientY / window.innerHeight - 0.5) }
    window.addEventListener('mousemove', onMove, { passive: true })
    const onResize = () => {
      const nw = el.clientWidth, nh = el.clientHeight
      camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize, { passive: true })

    const threshold = mobile ? 3.5 : 4.8
    let raf
    const animate = () => {
      raf = requestAnimationFrame(animate)
      // Move particles + bounce
      for (let i = 0; i < COUNT; i++) {
        pos[i*3]   += vel[i*3]
        pos[i*3+1] += vel[i*3+1]
        if (Math.abs(pos[i*3])   > spread * 0.5) vel[i*3]   *= -1
        if (Math.abs(pos[i*3+1]) > spread * 0.35) vel[i*3+1] *= -1
      }
      pGeo.attributes.position.needsUpdate = true
      // Lines
      let lc = 0
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = pos[i*3]-pos[j*3], dy = pos[i*3+1]-pos[j*3+1]
          if (Math.sqrt(dx*dx+dy*dy) < threshold) {
            const idx = lc * 6
            lineBuf[idx]=pos[i*3]; lineBuf[idx+1]=pos[i*3+1]; lineBuf[idx+2]=pos[i*3+2]
            lineBuf[idx+3]=pos[j*3]; lineBuf[idx+4]=pos[j*3+1]; lineBuf[idx+5]=pos[j*3+2]
            lc++
          }
        }
      }
      lGeo.attributes.position.needsUpdate = true
      lGeo.setDrawRange(0, lc * 2)
      // Wireframes
      meshes.forEach(m => { m.rotation.x += m.userData.r[0]; m.rotation.y += m.userData.r[1]; m.rotation.z += m.userData.r[2] })
      // Camera parallax
      camera.position.x += (mx * 1.2 - camera.position.x) * 0.04
      camera.position.y += (my * 0.8 - camera.position.y) * 0.04
      camera.lookAt(scene.position)
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="hero-canvas-mount" />
}

/* ─── Card tilt (applied globally to .tilt-card elements) ───────────────────── */
function useTiltCards() {
  useEffect(() => {
    const cards = document.querySelectorAll('.tilt-card')
    const cleanups = []
    cards.forEach(card => {
      const onMove = e => {
        const r = card.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        card.style.transform = `perspective(900px) rotateX(${-y * 11}deg) rotateY(${x * 11}deg) scale3d(1.03,1.03,1.03)`
        card.style.transition = 'transform 0.08s ease'
      }
      const onLeave = () => {
        card.style.transform = ''
        card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)'
      }
      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)
      cleanups.push(() => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave) })
    })
    return () => cleanups.forEach(fn => fn())
  }, [])
}

/* ─── Scroll animations ──────────────────────────────────────────────────────── */
function useScrollAnimations() {
  useEffect(() => {
    const els = document.querySelectorAll('.anim')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.07, rootMargin: '0px 0px -30px 0px' }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
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
            <div className="nav-brand-tag">AI Automation Systems</div>
          </a>
          <div className="nav-links">
            {links.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
          </div>
          <div className="nav-right">
            <button className="nav-cta" onClick={onOpenChat}>Get a Free Demo <ArrowRight size={14} /></button>
            <button className="nav-mobile-btn" onClick={() => setOpen(o => !o)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>
        <div className={`nav-mobile${open ? '' : ' closed'}`}>
          {links.map(l => <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>)}
          <button className="nav-cta" onClick={() => { setOpen(false); onOpenChat() }}>Get a Free Demo <ArrowRight size={14} /></button>
        </div>
      </div>
    </nav>
  )
}

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
function Hero({ onOpenChat }) {
  return (
    <section className="hero" id="hero">
      <HeroCanvas />
      <div className="hero-overlay" />
      <div className="container hero-content-wrap">
        <div className="hero-content">
          <div className="hero-eyebrow anim">
            <span className="hero-eyebrow-dot" />
            AI Automation — Built For Your Business
          </div>
          <h1 className="hero-title anim d1">
            Never Miss<br />
            <span className="accent-gold">Another Lead.</span>
          </h1>
          <p className="hero-sub anim d2">
            We build complete AI systems — chatbots, WhatsApp bots, AI phone assistants and professional websites
            that work <strong>24 hours a day, 7 days a week</strong>, capturing and qualifying every enquiry automatically.
          </p>
          <div className="hero-actions anim d3">
            <button className="btn-primary" onClick={onOpenChat}>Book Your Free Demo <ArrowRight size={16} /></button>
            <a href="#solution" className="btn-secondary">See What We Build</a>
          </div>
          <div className="hero-badges anim d4">
            <div className="hero-badge"><Check size={13} /> No contracts</div>
            <div className="hero-badge"><Check size={13} /> Live in 2–3 weeks</div>
            <div className="hero-badge"><Check size={13} /> Fully managed</div>
          </div>
        </div>
      </div>
      <div className="hero-scroll-hint">
        <div className="hero-scroll-line" />
      </div>
    </section>
  )
}

/* ─── Problem ────────────────────────────────────────────────────────────────── */
function Problem() {
  const cards = [
    { icon: <PhoneOff size={22} />, title: 'You miss calls while you are busy', desc: "Every time you're with a client or away from your desk, your phone rings out. That lead just called someone else and got an answer." },
    { icon: <Moon size={22} />, title: 'Enquiries come in outside business hours', desc: "People research at 10pm. When they contact you and hear nothing, they move on. By morning the lead is gone and you never knew about it." },
    { icon: <ClipboardList size={22} />, title: "You're manually following up every lead", desc: "Hours every week spent on follow-up calls, emails and texts. You're doing admin instead of actually growing your business." },
    { icon: <Zap size={22} />, title: 'Faster competitors are winning your clients', desc: "Speed wins. If a lead gets a response in seconds from someone else, they go with them. It really is that simple." },
  ]
  return (
    <section className="problem-section" id="problem">
      <div className="container">
        <div className="problem-header">
          <div className="section-label anim">The Real Problem</div>
          <h2 className="section-heading anim d1">You Are Losing Leads<br />Every Single Day</h2>
          <p className="section-sub anim d2">If you are not responding to enquiries within minutes, around the clock, you are leaving serious money on the table every month.</p>
        </div>
        <div className="problem-grid">
          {cards.map((c, i) => (
            <div className={`problem-card tilt-card anim d${i+1}`} key={i}>
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
    { icon: <MessageSquare size={24} />, title: 'AI Website Chatbot', desc: "Embedded on your website, our AI chatbot greets every visitor, answers questions, qualifies leads and captures their details — 24/7, every day of the year.", tag: 'Qualifies Every Lead' },
    { icon: <Phone size={24} />, title: 'AI Phone Assistant', desc: "Answers every call you miss, 24/7. Takes details, answers questions, qualifies the lead and books appointments into your calendar automatically.", tag: 'Answers Every Call' },
    { icon: <MessageCircle size={24} />, title: 'WhatsApp Bot', desc: "Handles inbound WhatsApp messages instantly — qualifying leads, answering questions and capturing contact details while you focus on your business.", tag: 'WhatsApp 24/7' },
    { icon: <Globe size={24} />, title: 'Professional Website', desc: "A fast, mobile-optimised, conversion-focused website built to represent your business at its best and turn visitors into genuine enquiries.", tag: 'Built to Convert' },
  ]
  return (
    <section className="solution-section" id="solution">
      <div className="container">
        <div className="solution-header">
          <div className="section-label anim">The WVH System</div>
          <h2 className="section-heading anim d1">Your Complete AI System,<br />Built and Managed For You</h2>
          <p className="section-sub anim d2">We build a fully integrated AI ecosystem tailored to your business. Every enquiry gets captured, qualified and followed up — automatically.</p>
        </div>
        <div className="solution-grid">
          {cards.map((c, i) => (
            <div className={`solution-card tilt-card anim d${i+1}`} key={i}>
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
    { icon: <Settings size={28} />, num: '01', title: 'We Build Your System', desc: 'We design and build your entire AI ecosystem from scratch — tailored specifically to your business, your brand and your customers.' },
    { icon: <Link2 size={28} />, num: '02', title: 'We Connect Everything', desc: "We integrate your AI with your phone, WhatsApp and website. No technical work required from you at any point." },
    { icon: <TrendingUp size={28} />, num: '03', title: 'Leads Flow Automatically', desc: 'Your AI handles every enquiry — qualifying leads, collecting details and booking appointments into your calendar around the clock.' },
    { icon: <CalendarCheck size={28} />, num: '04', title: 'You Just Show Up', desc: 'Wake up to qualified leads already in your inbox. Your only job is to show up and close. The AI handles everything else.' },
  ]
  return (
    <section className="how-section" id="how">
      <div className="container">
        <div className="how-header">
          <div className="section-label anim">Simple Process</div>
          <h2 className="section-heading anim d1">Live in 2–3 Weeks,<br />Running Forever</h2>
          <p className="section-sub anim d2">We handle every single step. You will be live faster than you think.</p>
        </div>
        <div className="how-steps">
          {steps.map((s, i) => (
            <div className={`how-step tilt-card anim d${i+1}`} key={i}>
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
  const demos = [
    { src: whatsappVideo, type: 'video/mp4',  title: 'WhatsApp Bot Demo',        desc: 'Watch the WhatsApp bot handle a live enquiry from first message to captured lead.',                     label: 'WHATSAPP BOT' },
    { src: phoneVideo,    type: 'video/mp4',  title: 'AI Phone Assistant Demo',  desc: 'Hear the AI phone assistant handle a real inbound call — taking details and qualifying the lead.',  label: 'PHONE ASSISTANT' },
  ]
  return (
    <section className="demo-section" id="demo">
      <div className="container">
        <div className="demo-header">
          <div className="section-label anim">Live Demos</div>
          <h2 className="section-heading anim d1">See It In Action</h2>
        </div>
        <p className="demo-desc anim d2">Real demos of the actual WVH AI system. Watch how it handles enquiries — qualifying leads and booking appointments without any human involvement.</p>
        <div className="demo-grid">
          {demos.map((d, i) => (
            <div className={`demo-card tilt-card anim d${i+1}`} key={i}>
              <div className="demo-video-wrap">
                <video className="demo-video" controls playsInline preload="metadata">
                  <source src={d.src} type={d.type} />
                </video>
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
    { pkg: 'Package 1', title: 'Website Only', features: ['Professional business website', 'Mobile-optimised & fast loading', 'Built to convert visitors to enquiries', 'Monthly hosting & maintenance', 'Ongoing updates & support'], popular: false },
    { pkg: 'Package 2', title: 'Website + AI Chatbot', features: ['Everything in Package 1', 'AI website chatbot installed', '24/7 lead qualification on your site', 'Automatic lead capture & notifications', 'Customised to your business'], popular: false },
    { pkg: 'Package 3', title: 'Website + Chatbot + Phone AI', features: ['Everything in Package 2', 'AI phone assistant (24/7)', 'Missed call handling & qualification', 'Appointment booking to your calendar', 'Full monthly management'], popular: false },
    { pkg: 'Package 4', title: 'Full Stack — Everything', features: ['Professional website', 'AI website chatbot', 'AI phone assistant (24/7)', 'WhatsApp bot (24/7)', 'Complete AI lead capture system', 'Priority support & management'], popular: true },
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
          <div className="section-label anim">Packages</div>
          <h2 className="section-heading anim d1">Everything Built and Managed For You</h2>
        </div>
        <p className="section-sub packages-sub anim d2">Choose the package that fits your business. Every system is fully built and managed by WVH Developments Ltd — get in touch for a bespoke quote.</p>
        <div className="packages-main">
          {main.map((p, i) => (
            <div className={`pkg-card tilt-card anim d${i+1}${p.popular ? ' popular' : ''}`} key={i}>
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
                  <div className="pkg-feature" key={fi}><Check size={14} className="pkg-check" />{f}</div>
                ))}
              </div>
              <button className="pkg-cta" onClick={onOpenChat}>Get Started <ArrowRight size={14} /></button>
            </div>
          ))}
        </div>
        <div className="packages-standalone anim">
          <h3>Standalone Add-Ons</h3>
          <div className="standalone-grid">
            {standalone.map((s, i) => (
              <div className="standalone-card tilt-card" key={i}>
                <h4>{s.title}</h4>
                <div className="standalone-quote">Bespoke Pricing</div>
                <div className="standalone-quote-sub">Get in touch for a tailored quote</div>
              </div>
            ))}
          </div>
        </div>
        <div className="packages-note anim">
          <Shield size={14} style={{display:'inline',marginRight:'6px',verticalAlign:'middle'}} />
          <strong>All systems are fully built and managed by WVH Developments Ltd.</strong>{' '}No technical knowledge required.
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials ───────────────────────────────────────────────────────────── */
function Testimonials() {
  const reviews = [
    {
      text: "The WhatsApp bot has already started picking up enquiries I would have missed while on calls or out of the office. Having something automatically respond and collect details at any hour is exactly what I needed — excited to see where this goes.",
      name: 'Jack Neale',
      role: 'Mortgage Broker',
      initials: 'JN'
    },
    {
      text: "WVH have been handling our social media and the difference has been night and day. Consistent, professional content going out regularly without us having to think about it. Our online presence finally reflects the quality of our work.",
      name: 'Rite Torc Services',
      role: 'Client, South East England',
      initials: 'RT'
    }
  ]
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <div className="section-label anim">Results</div>
          <h2 className="section-heading anim d1">What Our Clients Say</h2>
        </div>
        <div className="testimonials-grid">
          {reviews.map((r, i) => (
            <div className={`testimonial-card tilt-card anim d${i+1}`} key={i}>
              <div className="testimonial-quote-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor"><path d="M14 24h-4c0-5.5 4.5-10 10-10v4c-3.3 0-6 2.7-6 6zm16 0h-4c0-5.5 4.5-10 10-10v4c-3.3 0-6 2.7-6 6z" opacity="0.3"/></svg>
              </div>
              <div className="testimonial-stars">{[...Array(5)].map((_, si) => <Star key={si} size={16} />)}</div>
              <p className="testimonial-text">"{r.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{r.initials}</div>
                <div><div className="testimonial-name">{r.name}</div><div className="testimonial-role">{r.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ ────────────────────────────────────────────────────────────────────── */
function FAQ() {
  const [open, setOpen] = useState(null)
  const items = [
    { q: 'Do I need to change my existing phone number?', a: "No — but you have options. The AI phone assistant can work alongside your existing number via call forwarding so nothing changes for your clients. Alternatively, we can set it up with a brand new number, or configure it to only handle out-of-hours calls so it only kicks in when you're unavailable. It's completely flexible." },
    { q: 'How long does it take to set everything up?', a: "Most clients are fully live within 2 to 3 weeks. We handle the entire setup — website build, AI configuration, WhatsApp integration and phone assistant — so you don't need to do anything technical. We keep you updated throughout." },
    { q: 'What happens if the AI cannot answer a question?', a: "The AI is trained to handle the vast majority of enquiries for your business. In the rare case it encounters something outside its knowledge, it politely takes the contact's details and lets them know you will be in touch. No lead is ever lost." },
    { q: 'Is there a contract? Am I locked in?', a: "No long-term contracts. You pay a one-off build fee and a monthly management fee. You can cancel with 30 days notice at any time. We earn your business every month — not by locking you in." },
    { q: 'Can I see a demo before I commit?', a: "Absolutely. Chat with our AI assistant right now, or get in touch directly. We will walk you through the full system live and answer every question — no obligation." },
    { q: 'Does this work for any type of business?', a: "Yes. We have built systems for businesses across a range of industries. If your business receives enquiries — by phone, WhatsApp, or website — our AI system will capture and qualify them automatically." },
  ]
  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="faq-header">
          <div className="section-label anim">Questions</div>
          <h2 className="section-heading anim d1">Everything You Need to Know</h2>
        </div>
        <div className="faq-list">
          {items.map((item, i) => (
            <div className={`anim d${Math.min(i+1,5)}`} key={i}>
              <div className={`faq-item${open === i ? ' open' : ''}`}>
                <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
                  {item.q}<ChevronDown size={18} className="faq-chevron" />
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

/* ─── Contact ────────────────────────────────────────────────────────────────── */
function Contact({ onOpenChat }) {
  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="contact-header">
          <div className="section-label anim">Get Started</div>
          <h2 className="section-heading anim d1">Ready to Automate Your Business?</h2>
          <p className="section-sub anim d2" style={{ margin: '0 auto' }}>Chat with our AI assistant right now, or reach out directly. We respond within 24 hours.</p>
        </div>
        <div className="contact-cta-row anim d3">
          <div className="contact-ai-card tilt-card">
            <div className="contact-ai-icon"><Sparkles size={28} /></div>
            <h3>Chat With Our AI Now</h3>
            <p>Ask anything — what's included, how it works, how long setup takes. Get an instant answer.</p>
            <button className="btn-primary contact-chat-btn" onClick={onOpenChat}><Bot size={18} /> Start a Conversation</button>
          </div>
          <div className="contact-or">
            <div className="contact-or-line" /><span>or reach us directly</span><div className="contact-or-line" />
          </div>
          <div className="contact-details-grid">
            {[
              { icon: <Mail size={18} />, label: 'Email', value: 'will@wvhdevelopments.com', href: 'mailto:will@wvhdevelopments.com' },
              { icon: <MapPin size={18} />, label: 'Based in', value: 'England & Wales', href: null },
              { icon: <Clock size={18} />, label: 'Response time', value: 'Within 24 hours', href: null },
            ].map((d, i) => (
              <div className="contact-detail-card tilt-card" key={i}>
                <div className="contact-detail-icon">{d.icon}</div>
                <div>
                  <div className="contact-detail-label">{d.label}</div>
                  {d.href
                    ? <a className="contact-detail-value contact-detail-link" href={d.href}>{d.value}</a>
                    : <div className="contact-detail-value">{d.value}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Chatbot ────────────────────────────────────────────────────────────────── */
function Chatbot({ isOpen, setIsOpen }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm the WVH AI assistant. Ask me anything about our packages, how it works, setup time, or what's included. What would you like to know?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasNotif, setHasNotif] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) { setHasNotif(false); setTimeout(() => inputRef.current?.focus(), 300) }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
        body: JSON.stringify({ messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...newMessages] })
      })
      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't get a response. Please email will@wvhdevelopments.com"
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having a technical issue. Please email will@wvhdevelopments.com and we'll get back to you." }])
    }
    setLoading(false)
  }

  const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }
  const suggestions = ["What's included in Package 4?", "How long does setup take?", "Do I need to change my phone number?"]

  return (
    <>
      <div className={`chatbot-window${isOpen ? ' open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-avatar"><Bot size={20} /></div>
          <div className="chatbot-header-info">
            <div className="chatbot-header-name">WVH AI Assistant</div>
            <div className="chatbot-header-status"><span className="live-dot" /> Online now</div>
          </div>
          <button className="chatbot-close" onClick={() => setIsOpen(false)}><X size={18} /></button>
        </div>
        <div className="chatbot-messages">
          {messages.map((m, i) => (
            <div className={`chatbot-msg ${m.role}`} key={i}>
              {m.role === 'assistant' && <div className="chatbot-msg-icon"><Bot size={14} /></div>}
              <div className="chatbot-msg-bubble">{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="chatbot-msg assistant">
              <div className="chatbot-msg-icon"><Bot size={14} /></div>
              <div className="chatbot-typing"><span /><span /><span /></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {messages.length === 1 && (
          <div className="chatbot-suggestions">
            {suggestions.map((s, i) => (
              <button key={i} className="chatbot-suggestion" onClick={() => { setInput(s); inputRef.current?.focus() }}>{s}</button>
            ))}
          </div>
        )}
        <div className="chatbot-input-area">
          <textarea ref={inputRef} className="chatbot-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Ask me anything..." rows={1} />
          <button className="chatbot-send" onClick={send} disabled={!input.trim() || loading}><Send size={16} /></button>
        </div>
      </div>
      <button className="chatbot-bubble" onClick={() => setIsOpen(o => !o)}>
        {isOpen ? <X size={24} /> : <Bot size={24} />}
        {hasNotif && !isOpen && <span className="chatbot-notif">1</span>}
      </button>
    </>
  )
}

/* ─── Footer ─────────────────────────────────────────────────────────────────── */
function Footer() {
  const nav = ['#problem','#solution','#how','#packages','#faq','#contact']
  const labels = ['Why WVH','Our Solutions','How It Works','Packages','FAQ','Contact']
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-name">WVH <span>Developments</span> Ltd</div>
            <p className="footer-tagline">Complete AI automation systems built for businesses that refuse to miss a lead.</p>
          </div>
          <div>
            <div className="footer-nav-title">Navigation</div>
            <div className="footer-nav-links">{nav.map((href,i) => <a key={href} href={href}>{labels[i]}</a>)}</div>
          </div>
          <div>
            <div className="footer-nav-title">Contact</div>
            <div className="footer-nav-links"><a href="mailto:will@wvhdevelopments.com">will@wvhdevelopments.com</a></div>
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
  useTiltCards()
  return (
    <>
      <Nav onOpenChat={() => setChatOpen(true)} />
      <Hero onOpenChat={() => setChatOpen(true)} />
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
