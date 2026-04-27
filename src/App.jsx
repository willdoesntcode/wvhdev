import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
  Menu, X, ArrowRight, ChevronDown,
  Globe, Smartphone, Bot, MessageCircle,
  Phone, Settings, TrendingUp, Code2,
  Check, Mail, Send
} from 'lucide-react'
import './App.css'

/* ─── System Prompt ─────────────────────────────────────────────── */
const SYSTEM_PROMPT = `You are the AI assistant for WVH Developments Ltd, a UK-based premium tech agency. You are professional, confident and concise.

SERVICES:
- Website Development & Hosting (with or without payment systems)
- App Development & Hosting (mobile and web, with or without payment systems)
- Social Media Management & Growth
- AI Chatbots (website and in-app)
- WhatsApp Automation (lead qualification, FAQ handling, full automation)
- AI Phone Assistant (24/7 call handling, lead qualification)
- Custom Backend Systems (booking, payments, admin dashboards, databases)
- Full Tech Management — one monthly retainer covers everything

PACKAGES:
- Single services available individually
- Full Stack Retainer: everything above, fully managed monthly — most popular
All pricing is bespoke. Direct anyone asking to email will@wvhdevelopments.com

KEY FACTS:
- Setup: typically 2-3 weeks
- No long-term contracts — cancel with 30 days notice
- No technical knowledge required from the client
- One point of contact — Will handles everything personally
- AI phone assistant can use a new number, forward from existing, or handle missed/out-of-hours only

CONTACT: will@wvhdevelopments.com
If someone wants a quote or demo, tell them to email will@wvhdevelopments.com. Never invent information.`

/* ─── Custom Cursor ─────────────────────────────────────────────── */
function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = -200, my = -200, rx = -200, ry = -200
    let hovering = false, rafId

    const onMove = (e) => { mx = e.clientX; my = e.clientY }

    const setHover = (v) => () => { hovering = v }

    const tick = () => {
      rx += (mx - rx) * 0.1
      ry += (my - ry) * 0.1
      dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`
      ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px) scale(${hovering ? 1.7 : 1})`
      rafId = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.querySelectorAll('a, button, .tilt-card').forEach(el => {
      el.addEventListener('mouseenter', setHover(true))
      el.addEventListener('mouseleave', setHover(false))
    })

    tick()
    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}

/* ─── Hero Canvas ───────────────────────────────────────────────── */
function HeroCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return
    const isMobile = window.innerWidth < 768
    const w = el.clientWidth, h = el.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100)
    camera.position.set(0, 2.5, 9)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const group = new THREE.Group()
    scene.add(group)

    // Central icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(1.1, 1)
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xFF4D00, wireframe: true, transparent: true, opacity: 0.45 })
    const core = new THREE.Mesh(coreGeo, coreMat)
    group.add(core)

    // Orbiting shapes
    const orbiters = [
      { geo: new THREE.OctahedronGeometry(0.42), color: 0xFF4D00, opacity: 0.22, x: 3.0, y: 0.8, z: -0.5 },
      { geo: new THREE.TetrahedronGeometry(0.35), color: 0xFFFFFF, opacity: 0.12, x: -3.2, y: 0.4, z: 0.3 },
      { geo: new THREE.IcosahedronGeometry(0.28, 0), color: 0xFF4D00, opacity: 0.18, x: 2.0, y: -1.6, z: 1.0 },
      { geo: new THREE.OctahedronGeometry(0.22), color: 0xFFFFFF, opacity: 0.10, x: -1.8, y: -1.2, z: -0.8 },
    ]

    const orbMeshes = orbiters.map(o => {
      const m = new THREE.Mesh(
        o.geo,
        new THREE.MeshBasicMaterial({ color: o.color, wireframe: true, transparent: true, opacity: o.opacity })
      )
      m.position.set(o.x, o.y, o.z)
      group.add(m)
      return m
    })

    // Wave plane
    const planeSegs = isMobile ? 20 : 32
    const planeGeo = new THREE.PlaneGeometry(18, 18, planeSegs, planeSegs)
    const planeMat = new THREE.MeshBasicMaterial({ color: 0xFF4D00, wireframe: true, transparent: true, opacity: 0.07 })
    const plane = new THREE.Mesh(planeGeo, planeMat)
    plane.rotation.x = -Math.PI * 0.4
    plane.position.y = -4
    scene.add(plane)

    // Particles
    const pCount = isMobile ? 60 : 110
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 18
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 7
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({ color: 0xFF4D00, size: 0.025, transparent: true, opacity: 0.55 })
    scene.add(new THREE.Points(pGeo, pMat))

    let mouseX = 0, mouseY = 0
    const onMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    const onResize = () => {
      const nw = el.clientWidth, nh = el.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize, { passive: true })

    let t = 0, rafId
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      t += 0.006

      // Wave plane vertex animation
      const pos = planeGeo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i)
        pos.setZ(i, Math.sin(x * 0.45 + t) * Math.cos(y * 0.35 + t) * 0.65)
      }
      pos.needsUpdate = true

      // Core rotation
      core.rotation.y += 0.004
      core.rotation.x += 0.002

      // Orbiter rotations and float
      orbMeshes.forEach((m, i) => {
        m.rotation.y += 0.006 * (i % 2 === 0 ? 1 : -1)
        m.rotation.z += 0.004 * (i % 3 === 0 ? 1 : -1)
        m.position.y += Math.sin(t * 0.6 + i * 1.5) * 0.0015
      })

      // Mouse parallax on group
      group.rotation.y += (mouseX * 0.12 - group.rotation.y) * 0.035
      group.rotation.x += (-mouseY * 0.08 - group.rotation.x) * 0.035
      camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.025
      camera.position.y += (-mouseY * 0.7 + 2.5 - camera.position.y) * 0.025

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      el.innerHTML = ''
    }
  }, [])

  return <div ref={mountRef} className="hero-canvas" />
}

/* ─── Hooks ─────────────────────────────────────────────────────── */
function useScrollAnimations() {
  useEffect(() => {
    const els = document.querySelectorAll('.anim')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

function useTiltCards() {
  useEffect(() => {
    const cards = document.querySelectorAll('.tilt-card')
    const handlers = []
    cards.forEach(card => {
      const onMove = (e) => {
        const r = card.getBoundingClientRect()
        const x = ((e.clientX - r.left) / r.width - 0.5) * 16
        const y = ((e.clientY - r.top) / r.height - 0.5) * 16
        card.style.transform = `perspective(900px) rotateX(${-y}deg) rotateY(${x}deg) translateZ(6px)`
      }
      const onLeave = () => { card.style.transform = '' }
      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)
      handlers.push({ card, onMove, onLeave })
    })
    return () => handlers.forEach(({ card, onMove, onLeave }) => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
    })
  }, [])
}

function useMagneticButtons() {
  useEffect(() => {
    const btns = document.querySelectorAll('.mag-btn')
    const handlers = []
    btns.forEach(btn => {
      const onMove = (e) => {
        const r = btn.getBoundingClientRect()
        const x = (e.clientX - r.left - r.width / 2) * 0.28
        const y = (e.clientY - r.top - r.height / 2) * 0.28
        btn.style.transform = `translate(${x}px, ${y}px)`
      }
      const onLeave = () => { btn.style.transform = '' }
      btn.addEventListener('mousemove', onMove)
      btn.addEventListener('mouseleave', onLeave)
      handlers.push({ btn, onMove, onLeave })
    })
    return () => handlers.forEach(({ btn, onMove, onLeave }) => {
      btn.removeEventListener('mousemove', onMove)
      btn.removeEventListener('mouseleave', onLeave)
    })
  }, [])
}

/* ─── Nav ───────────────────────────────────────────────────────── */
function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { label: 'Services', href: '#services' },
    { label: 'How It Works', href: '#process' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#" className="nav-logo">WVH<span className="logo-dot">.</span></a>
        <ul className="nav-links">
          {links.map(l => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}
        </ul>
        <a href="mailto:will@wvhdevelopments.com" className="nav-cta mag-btn">Get a Quote</a>
        <button className="nav-burger" onClick={() => setOpen(o => !o)} aria-label="menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="nav-mobile">
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a href="mailto:will@wvhdevelopments.com" className="nav-mobile-cta" onClick={() => setOpen(false)}>
            Get a Quote
          </a>
        </div>
      )}
    </nav>
  )
}

/* ─── Hero ──────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero-section">
      <HeroCanvas />
      <div className="hero-content container">
        <div className="hero-label anim">WVH Developments Ltd — Premium Tech Agency</div>
        <h1 className="hero-title">
          <span className="hero-line anim d1">Your Tech.</span>
          <span className="hero-line anim d2">Our <span className="accent-o">Problem.</span></span>
        </h1>
        <p className="hero-sub anim d3">
          We build, host and manage your complete digital operation —
          websites, apps, AI, automations and payments.
          One partner. Zero headaches.
        </p>
        <div className="hero-actions anim d4">
          <a href="mailto:will@wvhdevelopments.com" className="btn-primary mag-btn">
            Start a Project <ArrowRight size={16} />
          </a>
          <a href="#services" className="btn-ghost">Explore Services</a>
        </div>
      </div>
      <div className="hero-scroll-hint">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}

/* ─── Marquee ───────────────────────────────────────────────────── */
function Marquee() {
  const items = [
    'Website Development', 'App Development', 'AI Chatbots',
    'WhatsApp Automation', 'AI Phone Assistant', 'Social Media Management',
    'Custom Backend Systems', 'Full Stack Retainer',
  ]
  const doubled = [...items, ...items]
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item">
            {item}<span className="marquee-sep"> · </span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── Services ──────────────────────────────────────────────────── */
function Services() {
  const services = [
    {
      icon: <Globe size={26} />, num: '01', title: 'Website Development',
      desc: 'Premium websites built from scratch. Fast, responsive, conversion-focused. Includes hosting, maintenance and updates.',
      tags: ['Design & Build', 'Hosting', 'Payments Optional'],
    },
    {
      icon: <Smartphone size={26} />, num: '02', title: 'App Development',
      desc: 'Web and mobile apps built to your exact specification. Backend, database, auth and payments — all included.',
      tags: ['iOS / Android', 'Web Apps', 'Payments Optional'],
    },
    {
      icon: <Bot size={26} />, num: '03', title: 'AI Chatbots',
      desc: 'Intelligent chatbots embedded in your website or app. Qualify leads, answer FAQs and book appointments — 24/7.',
      tags: ['Website', 'In-App', 'Lead Qualification'],
    },
    {
      icon: <MessageCircle size={26} />, num: '04', title: 'WhatsApp Automation',
      desc: 'Fully automated WhatsApp systems. Handle enquiries, qualify leads, send follow-ups and answer FAQs — automatically.',
      tags: ['Lead Qualification', 'FAQ Bot', '24/7'],
    },
    {
      icon: <Phone size={26} />, num: '05', title: 'AI Phone Assistant',
      desc: 'Never miss a call. Our AI answers every call 24/7, qualifies leads, takes details and books appointments.',
      tags: ['24/7 Answering', 'Lead Qualification', 'Calendar Sync'],
    },
    {
      icon: <TrendingUp size={26} />, num: '06', title: 'Social Media Management',
      desc: 'Full social media management and growth. Content, strategy, posting and engagement — handled every month.',
      tags: ['Content', 'Growth Strategy', 'Monthly Management'],
    },
    {
      icon: <Code2 size={26} />, num: '07', title: 'Custom Backend Systems',
      desc: 'Bespoke software built for your business. Booking systems, payment flows, admin dashboards and databases — built to order.',
      tags: ['Booking Systems', 'Payments', 'Admin Dashboards'],
    },
    {
      icon: <Settings size={26} />, num: '08', title: 'Full Tech Management',
      desc: 'One monthly retainer. Every digital system — built, hosted, managed and maintained by one expert. You focus on the business.',
      tags: ['Everything Included', 'Monthly Retainer', 'Priority Support'],
      highlight: true,
    },
  ]

  return (
    <section className="services-section" id="services">
      <div className="container">
        <div className="section-label anim">What We Build</div>
        <h2 className="section-heading anim d1">
          Everything Your Business<br />Needs. One Place.
        </h2>
        <p className="section-sub anim d2">
          From a single website to a complete AI-powered digital operation —
          we build and manage it all.
        </p>
        <div className="services-grid">
          {services.map((s, i) => (
            <div
              key={i}
              className={`service-card tilt-card anim d${(i % 3) + 1}${s.highlight ? ' service-highlight' : ''}`}
            >
              <div className="service-num">{s.num}</div>
              <div className="service-icon">{s.icon}</div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
              <div className="service-tags">
                {s.tags.map(t => <span key={t} className="service-tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Full Stack Pitch ──────────────────────────────────────────── */
function FullStackPitch() {
  const items = [
    'Professional website, designed and built from scratch',
    'Mobile or web app, fully functional',
    'AI chatbot on your site and app',
    'WhatsApp automation for enquiries and lead capture',
    'AI phone assistant, answering calls 24/7',
    'Social media managed and growing every month',
    'Custom backend software as your business needs it',
    'Everything hosted, maintained and updated — forever',
  ]

  return (
    <section className="pitch-section" id="pricing">
      <div className="container">
        <div className="pitch-grid">
          <div className="pitch-left">
            <div className="section-label section-label--light anim">The Full Stack Retainer</div>
            <h2 className="section-heading section-heading--light anim d1">
              One Call.<br />Everything<br /><span className="accent-o">Handled.</span>
            </h2>
            <p className="section-sub section-sub--light anim d2">
              The highest-value option. One monthly retainer covers your entire digital
              operation — built to your spec, managed by us, running around the clock.
            </p>
            <a href="mailto:will@wvhdevelopments.com" className="btn-primary mag-btn anim d3">
              Discuss the Retainer <ArrowRight size={16} />
            </a>
          </div>
          <div className="pitch-right anim d2">
            <div className="pitch-card">
              <div className="pitch-card-header">What's included</div>
              {items.map((item, i) => (
                <div key={i} className="pitch-row">
                  <Check size={15} className="pitch-check" />
                  <span>{item}</span>
                </div>
              ))}
              <div className="pitch-footer">
                Bespoke pricing — built around your business and budget
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Process ───────────────────────────────────────────────────── */
function Process() {
  const steps = [
    {
      num: '01', title: 'Discovery Call',
      desc: "We learn exactly what your business needs. No sales pitch — just a genuine conversation about what would make the biggest difference for you.",
    },
    {
      num: '02', title: 'We Build Everything',
      desc: "We design, build and configure every system to your exact specification. Most clients are fully live within 2–3 weeks.",
    },
    {
      num: '03', title: 'Launch & Integration',
      desc: "Everything goes live — website, app, AI systems, automations — all connected, tested and running without any input from you.",
    },
    {
      num: '04', title: 'Ongoing Management',
      desc: "We manage, maintain and improve everything month to month. One point of contact. Zero technical knowledge required.",
    },
  ]

  return (
    <section className="process-section" id="process">
      <div className="container">
        <div className="section-label anim">How It Works</div>
        <h2 className="section-heading anim d1">
          From First Call to<br />Fully Running — Fast.
        </h2>
        <div className="process-grid">
          {steps.map((s, i) => (
            <div key={i} className={`process-card tilt-card anim d${i + 1}`}>
              <div className="process-num">{s.num}</div>
              <h3 className="process-title">{s.title}</h3>
              <p className="process-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Chatbot ───────────────────────────────────────────────────── */
function ChatbotSection() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi — I'm the WVH AI. Ask me anything about our services, pricing or how we work." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...next] }),
      })
      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || 'Something went wrong. Email will@wvhdevelopments.com.'
      setMessages(m => [...m, { role: 'assistant', content: reply }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Something went wrong. Please email will@wvhdevelopments.com.' }])
    }
    setLoading(false)
  }

  return (
    <section className="chatbot-section" id="demo">
      <div className="container">
        <div className="chatbot-grid">
          <div className="chatbot-left">
            <div className="section-label anim">AI Demo</div>
            <h2 className="section-heading anim d1">Talk to the AI.<br />Right Now.</h2>
            <p className="section-sub anim d2">
              This is the same AI system we build for our clients.
              Ask it anything — services, how it works, pricing.
              See it in action before you commit to anything.
            </p>
          </div>
          <div className="chatbot-widget anim d2">
            <div className="chatbot-header">
              <div className="chatbot-avatar"><Bot size={15} /></div>
              <div>
                <div className="chatbot-name">WVH AI</div>
                <div className="chatbot-status"><span className="live-dot" />Online</div>
              </div>
            </div>
            <div className="chatbot-messages">
              {messages.map((m, i) => (
                <div key={i} className={`chat-msg ${m.role}`}>
                  <p>{m.content}</p>
                </div>
              ))}
              {loading && (
                <div className="chat-msg assistant">
                  <div className="typing-dots"><span /><span /><span /></div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="chatbot-input-row">
              <input
                className="chatbot-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask anything..."
              />
              <button className="chatbot-send" onClick={send} disabled={loading}>
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ ───────────────────────────────────────────────────────── */
function FAQ() {
  const [open, setOpen] = useState(null)

  const faqs = [
    {
      q: 'Can you really handle everything?',
      a: "Yes. Website, app, AI chatbot, WhatsApp automation, AI phone assistant, social media, custom backend software, hosting, maintenance — all of it. One point of contact, one invoice, zero technical stress on your end.",
    },
    {
      q: 'How long does it take to get started?',
      a: "Most clients are fully live within 2–3 weeks of the initial call. We move fast and handle the entire setup — no technical input required from you whatsoever.",
    },
    {
      q: 'How does pricing work?',
      a: "All pricing is bespoke — built around exactly what you need. Typically there's a one-off build fee and a monthly management retainer. Get in touch at will@wvhdevelopments.com for a tailored quote.",
    },
    {
      q: 'Am I locked into a contract?',
      a: "No long-term contracts. You can cancel with 30 days notice at any time. We earn your business every month — not by locking you in.",
    },
    {
      q: 'Do I need any technical knowledge?',
      a: "Absolutely not. We handle everything. You won't need to touch code, DNS settings, servers or anything technical. Just tell us what you need and we'll take it from there.",
    },
    {
      q: 'What if I only need one thing — like just a website?',
      a: "No problem. We build individual services as well as full-stack packages. Whether you need a single website or a complete AI-powered operation, we've got you covered.",
    },
    {
      q: 'Can the AI phone assistant use my existing number?',
      a: "Yes — fully flexible. We can set it up with a brand new number, forward calls from your existing number, or run it purely for out-of-hours and missed calls. However you want to work it.",
    },
  ]

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="faq-grid">
          <div className="faq-left">
            <div className="section-label anim">FAQ</div>
            <h2 className="section-heading anim d1">Common<br />Questions.</h2>
            <p className="section-sub anim d2">
              Anything else?<br />
              <a href="mailto:will@wvhdevelopments.com">will@wvhdevelopments.com</a>
            </p>
          </div>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div key={i} className="anim d1">
                <div
                  className={`faq-item${open === i ? ' open' : ''}`}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <div className="faq-q">
                    <span>{f.q}</span>
                    <ChevronDown size={17} className="faq-chevron" />
                  </div>
                  {open === i && <div className="faq-a">{f.a}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ───────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-inner">
          <div className="section-label section-label--light anim">Get Started</div>
          <h2 className="cta-heading anim d1">
            Ready to Hand Over<br />Your Tech?
          </h2>
          <p className="cta-sub anim d2">
            One email. We scope the project, send a quote, and have you live in weeks.
          </p>
          <a href="mailto:will@wvhdevelopments.com" className="btn-primary btn-primary--lg mag-btn anim d3">
            <Mail size={17} /> will@wvhdevelopments.com
          </a>
          <p className="cta-note anim d4">No commitment. No technical knowledge needed.</p>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <div className="footer-logo">WVH<span className="logo-dot">.</span></div>
            <p className="footer-tagline">Premium tech. One partner. Everything handled.</p>
          </div>
          <div className="footer-nav">
            <a href="#services">Services</a>
            <a href="#process">How It Works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a href="mailto:will@wvhdevelopments.com">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 WVH Developments Ltd. All rights reserved.</span>
          <span>UK-based. Working globally.</span>
        </div>
      </div>
    </footer>
  )
}

/* ─── App ───────────────────────────────────────────────────────── */
export default function App() {
  useScrollAnimations()
  useTiltCards()
  useMagneticButtons()

  return (
    <>
      <CustomCursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <FullStackPitch />
        <Process />
        <ChatbotSection />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
