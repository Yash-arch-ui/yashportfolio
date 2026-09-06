import { useRef } from 'react'
import { motion, useScroll, useSpring, useInView } from 'framer-motion'
import MaskedHeading from './components/MaskedHeading.jsx'
import WebThreads from './components/WebThreads.jsx'
import {
  ArrowUpRight,
  GitBranch,
  AtSign,
  Briefcase,
  CirclePlay,
  Send,
  MessageCircle,
  Shield,
  Zap,
  Layers,
  GitPullRequest,
  Lock,
  Activity,
  Wrench,
  Cpu,
  Sparkles,
  Trophy,
  GraduationCap,
  Terminal,
  CircleDot,
  Radar,
  Ticket,
  Wallet,
} from 'lucide-react'

/* ---------------------------------- data ---------------------------------- */

const socials = [
  { label: 'GitHub', href: 'https://github.com/Yash-arch-ui', icon: GitBranch },
  { label: 'X / Twitter', href: 'https://x.com/YashSingh166431', icon: AtSign },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yash-singh-17067b410/', icon: Briefcase },
  { label: 'Telegram', href: 'https://t.me/Yashlm1', icon: Send },
  { label: 'Discord', href: 'https://discord.com/users/yashyt015953', icon: MessageCircle },
  { label: 'YouTube', href: 'https://www.youtube.com/@YashSingh-eo4ei', icon: CirclePlay },
]

const projects = [
  {
    name: 'Vantage',
    tag: 'Transaction Intelligence · Monad',
    accent: 'from-violet-400 to-fuchsia-500',
    icon: Radar,
    images: ['/projects/vantage.png'],
    summary:
      'Vantage is a Monad-native transaction intelligence platform that combines deterministic pre-sign analysis, explainable AI, autonomous contract monitoring, and transparent trust scoring. It helps users make safer execution decisions through continuous monitoring, historical execution intelligence, and evidence-backed recommendations.',
    points: [
      'Deterministic pre-sign analysis before execution',
      'Explainable AI for auditable decision-making',
      'Autonomous contract monitoring with continuous visibility',
      'Transparent, evidence-backed trust scoring',
    ],
    stack: ['Monad', 'Solidity', 'TypeScript'],
    links: [
      { label: 'Website', href: 'https://vantage-two-iota.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/Yash-arch-ui/VANTAGE' },
    ],
  },
  {
    name: 'WrapLayer',
    tag: 'Confidential DeFi · Zama FHEVM',
    accent: 'from-sky-400 to-violet-500',
    icon: Lock,
    images: ['/projects/wraplayer-hero.png', '/projects/wraplayer-detail.png'],
    summary:
      'A unified interface for confidential assets on Zama’s FHEVM. Every team building on FHEVM was deploying isolated ERC-20 testnet tokens and ERC-7984 confidential wrappers — duplicate assets, incompatible integrations, wallets full of look-alike tokens that don’t compose. Zama ships an official on-chain Wrappers Registry as the single source of truth for canonical ERC-20 ↔ ERC-7984 pairs — WrapLayer is the usable interface for it.',
    points: [
      'Discover canonical ERC-20 ↔ ERC-7984 wrapper pairs directly from the on-chain registry',
      'Shield, transfer and unwrap confidential assets with fully homomorphic encryption',
      'Built end-to-end on Zama FHEVM with encrypted balances (euint256)',
    ],
    stack: ['Solidity', 'Zama FHEVM', 'ERC-7984', 'React', 'Viem'],
    links: [
      { label: 'Website', href: 'https://wraplayer.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/Yash-arch-ui/WRAPLAYER' },
    ],
  },
  {
    name: 'Morpho Liquidation Bot',
    tag: 'Open Source Contribution · Morpho Blue',
    accent: 'from-blue-400 to-cyan-400',
    icon: GitPullRequest,
    images: [],
    summary:
      'Contributed to a simple, fast, and easily deployable liquidation bot for the Morpho Blue protocol. The bot is entirely RPC-based and designed to be easy to configure, customizable, and ready to deploy on any EVM-compatible chain.',
    points: [
      'Automatically detects liquidatable positions and executes liquidations',
      'Multi-chain compatible with pluggable data providers, liquidity venues and pricers',
      'Profit evaluation via configurable pricers',
      'Minimal setup and dependencies — RPC-only, no extra infra required',
    ],
    stack: ['TypeScript', 'Morpho Blue', 'EVM', 'RPC', 'Liquidations'],
    links: [{ label: 'GitHub', href: 'https://github.com/Yash-arch-ui/morpho-blue-liquidation-bot' }],
  },
  {
    name: 'HookShield',
    tag: 'Adaptive Risk-Weighted Fees · Uniswap V4',
    accent: 'from-amber-300 to-yellow-500',
    icon: Shield,
    images: [],
    summary:
      'A Uniswap V4 hook that replaces a pool’s static fee tier with an adaptive, risk-weighted fee computed at execution time. Every swap is evaluated against a pipeline of on-chain signals — volatility, inventory skew, oracle divergence and whale activity — aggregated into a normalized risk score that maps to a fee tier. When markets get rough, LPs are compensated; when conditions are calm, traders pay less. Signals, risk model and fee policy are independent, replaceable contracts wired together at deployment, and a staleness fallback returns a conservative risk score if signals go outdated. Deployed live on Sepolia with fuzz-tested math.',
    points: [
      'Dynamic fee override on every swap — PoolManager charges exactly the computed fee via the v4 dynamic-fee flag',
      'Modular pipeline: signals (EWMA volatility, inventory skew) → WeightedRiskModel → ThresholdPolicy fee tiers',
      'EWMA volatility signal with Foundry fuzz tests proving the math; staleness protection against outdated signals',
      'Deployed on Sepolia via CREATE2 permission-mining, with an owner-adjustable threshold/fee policy (0.30%–1.20% capped)',
    ],
    stack: ['Solidity', 'Uniswap V4', 'Hooks', 'Foundry'],
    links: [{ label: 'GitHub', href: 'https://github.com/Yash-arch-ui/HookShield' }],
  },
  {
    name: 'Balancer V3 Router',
    tag: 'Router Implementation · Balancer V3',
    accent: 'from-emerald-400 to-sky-400',
    icon: Layers,
    images: [],
    summary:
      'A router for Balancer V3 — extending the protocol’s swap-routing layer and going deep on its vault-centric architecture.',
    points: [
      'Extends the protocol’s swap-routing layer',
      'Built around Balancer V3’s vault-centric architecture',
    ],
    stack: ['Solidity', 'Balancer V3', 'Foundry'],
    links: [{ label: 'GitHub', href: 'https://github.com/Yash-arch-ui/balancer-v3-monorepo' }],
  },
  {
    name: 'GhostBundler',
    tag: 'Account Abstraction Security · ERC-4337 / ERC-6900',
    accent: 'from-indigo-400 to-violet-500',
    icon: Shield,
    images: [],
    summary:
      'An adversarial Rust preflight and sponsorship firewall for ERC-4337 UserOperations sent by ERC-6900 modular accounts. It sits in front of an ERC-4337 bundler and inspects each incoming UserOperation before it reaches the EntryPoint — decoding the call path, building a directed authority graph of which validator authorizes which selector targeting which contract, running policy rules against that graph, and simulating the operation against a local Anvil node. Only if both the policy check and simulation pass does it issue a cryptographic Risk Permit (ECDSA-signed, onchain-verifiable via a validation hook and permit-gated paymaster). Its core detection is the ERC-6900 privilege-amplification trap: a validator marked isGlobal is a master keycard, a selector with allowGlobalValidation is a door that accepts master keycards — and when the two combine, a session key installed to approve token transfers can drain a vault holding unrelated assets. GhostBundler catches exactly this class of unintended authorization before the operation ever hits chain.',
    points: [
      'Detects ERC-6900 privilege amplification — isGlobal validators reaching selectors they were never scoped to',
      'Builds a directed authority graph (validators → selectors → targets) and runs 3 policy rules: privilege amplification, validation applicability violations, missing execution hooks',
      'Simulates each UserOperation via eth_call + gas estimation against Anvil, classifying reverts as AccountError (AA1/AA2), PaymasterError (AA3) or Unknown',
      'Issues ECDSA-signed, onchain-verifiable Risk Permits binding userOpHash, chainId, policyRoot and validity window — verified on-chain by RiskGate and a permit-gated VerifyingPaymaster',
      'Full workspace tested — 26 Rust tests (aa-types, policy, sim, permit, ghostd) and 24 Foundry tests (EntryPoint, RiskGate, VerifyingPaymaster deployments)',
      'Written in Rust (axum, alloy, petgraph, k256) with vendored ERC-6900 reference implementation and eth-infinitism EntryPoint',
    ],
    stack: ['Rust', 'Solidity', 'ERC-4337', 'ERC-6900', 'Foundry', 'Alloy'],
    links: [{ label: 'GitHub', href: 'https://github.com/Yash-arch-ui/GhostBundler' }],
  },
  {
    name: 'DiviSafe',
    tag: 'Dividend Governance · EVM',
    accent: 'from-teal-400 to-cyan-500',
    icon: Shield,
    images: [],
    summary:
      'A decentralized dividend-governance and risk-mitigation platform protecting investors from dividend traps, payout manipulation and opaque corporate practices.',
    points: [
      'Protects investors from dividend traps and payout manipulation',
      'Mitigates risk from opaque corporate practices',
    ],
    stack: ['Solidity', 'Ethereum'],
    links: [{ label: 'GitHub', href: 'https://github.com/Yash-arch-ui/DiviSafe' }],
  },
  {
    name: 'SeatSwap',
    tag: 'Web3 Ticketing · Ethereum',
    accent: 'from-amber-400 to-orange-500',
    icon: Ticket,
    images: [],
    summary:
      'A Web3 ticketing protocol on Ethereum enabling secure ticket issuance, peer-to-peer resale and on-chain verification using NFTs.',
    points: [
      'Secure ticket issuance on-chain',
      'Peer-to-peer resale of tickets',
      'On-chain verification using NFTs',
    ],
    stack: ['Solidity', 'Ethereum', 'NFTs'],
    links: [{ label: 'GitHub', href: 'https://github.com/Yash-arch-ui/SeatSwap' }],
  },
]

const openSource = [
  {
    name: 'PuddleSwap',
    tag: 'Static No-Backend DEX · Monad Testnet',
    href: 'https://app.puddleswap.org',
    repo: 'https://github.com/Yash-arch-ui/puddleswap',
    summary:
      'A static, no-backend DEX on Monad testnet, live at app.puddleswap.org. It solves the problem of builders needing stablecoins and token swaps on testnet without waiting for mainnet DEX deployments. Swapping works via star routing — core tokens (USDC, USDT, WMON) act as intermediaries, and for any swap A -> B the UI checks all possible paths (direct, 3-hop, 4-hop) in a single batched RPC call, so any token with a pool against at least one core token is tradeable against any other. The best quote wins; slippage is configurable and quotes refresh every 6 seconds. The frontend has zero backend dependencies — all data comes from RPC calls to Monad testnet, with wallet connection via injected providers like MetaMask and Rabby.',
  },
  {
    name: 'NAD Agent',
    tag: 'Local AI Agent · Tether QVAC + WDK · Monad',
    href: 'https://github.com/portdeveloper/nad-agent/pull/58',
    repo: 'https://github.com/portdeveloper/nad-agent/pull/58',
    summary:
      "A 100% local AI agent with its own gasless, self-custodial wallet on Monad — powered end-to-end by Tether's stack (QVAC + WDK). No cloud, no API keys for the model, no gas for the user. You type in natural language, a model running on your machine decides what to do, you confirm, and the transaction settles on Monad — sponsored by a paymaster so the wallet pays zero gas.",
  },
  {
    name: 'Balancer V3 Router',
    tag: 'Balancer V3 · Open Source',
    href: 'https://github.com/balancer/balancer-v3-monorepo',
    summary:
      'Open source work on the Balancer V3 monorepo — extending the protocol’s swap-routing layer and going deep on its vault-centric architecture.',
  },
  {
    name: 'Plexus',
    tag: 'BlocSoc IITR · Open Source',
    href: 'https://github.com/BlocSoc-iitr/Plexus',
    summary:
      'Open source contribution to Plexus, a BlocSoc IITR project in active development.',
  },
]

const protocols = ['Uniswap V4', 'Balancer V3', 'Aave', 'Curve', 'Zama FHEVM', 'Sui']

/* -------------------------------- primitives ------------------------------- */

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

function SectionHeading({ kicker, title, icon: Icon }) {
  return (
    <Reveal className="mb-12">
      <div className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-emerald-400 uppercase">
        {Icon && <Icon size={14} />}
        {kicker}
      </div>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">{title}</h2>
    </Reveal>
  )
}

/* ---------------------------------- app ----------------------------------- */

export default function App() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <div className="relative isolate min-h-screen font-sans">
      {/* scroll progress */}
      <motion.div
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400"
        style={{ scaleX: progress }}
      />

      {/* animated background — WebThreads */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <WebThreads
          color1="#5227FF"
          color2="#FF9FFC"
          color3="#FFFFFF"
          speed={0.2}
          threadCount={6}
          frequency={5}
          spread={0.18}
          taper={1}
          position={0.5}
          fanMode="center"
          glow={0.02}
          falloff={0.6}
          thickness={1.1}
          brightness={0.6}
          opacity={1}
          mirror
          shimmer={false}
          grain
          grainIntensity={0.05}
          mouseInteraction={false}
          mouseStrength={0.3}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.6) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      {/* nav */}
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-x-0 top-0 z-40 border-b border-line bg-ink"
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="font-mono text-sm font-semibold tracking-tight text-slate-100">
            yash<span className="text-emerald-400">.singh</span>
          </a>
          <div className="hidden items-center gap-8 text-sm text-slate-400 sm:flex">
            <a className="transition hover:text-slate-100" href="#work">Work</a>
            <a className="transition hover:text-slate-100" href="#open-source">Open Source</a>
            <a className="transition hover:text-slate-100" href="#about">About</a>
            <a className="transition hover:text-slate-100" href="#contact">Contact</a>
          </div>
          <a
            href="https://github.com/Yash-arch-ui"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-1.5 text-sm text-slate-200 transition hover:border-emerald-400/40 hover:text-emerald-300"
          >
            <GitBranch size={15} /> GitHub
          </a>
        </nav>
      </motion.header>

      <main id="top" className="mx-auto max-w-6xl px-6">
        {/* hero */}
        <section className="relative flex min-h-screen flex-col justify-center pt-28 pb-16">
          <div className="grid items-center gap-12 lg:grid-cols-12">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-1.5 font-mono text-xs text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Currently building — an account abstraction wallet
            </div>

            <MaskedHeading
              tag="h1"
              text="Engineering the mechanisms."
              src="/hero-fill.svg"
              align="left"
              weight={800}
              tracking={-0.03}
              lineHeight={1.05}
              textScale={0.11}
              fillScale={1.2}
              parallax={16}
              drift={8}
              brightness={1.1}
              reveal="rise"
              trigger="view"
              stagger={0.07}
              className="mt-8 max-w-4xl"
            />

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-400">
              I’m <span className="font-semibold text-slate-200">Yash Singh</span>, a sophomore at{' '}
              <span className="font-semibold text-slate-200">IIT Roorkee</span> building DeFi
              infrastructure — AMM design, liquidation systems, dynamic fee mechanisms and
              confidential assets. My mission: build products that push DeFi towards becoming the
              financial layer of the internet.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                View selected work
                <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
              >
                Get in touch
              </a>
            </div>
          </motion.div>

          {/* portrait — circular avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="order-first flex flex-col items-center gap-6 lg:order-none lg:col-span-5 lg:self-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              {/* halo */}
              <div className="absolute -inset-10 rounded-full bg-gradient-to-br from-emerald-400/25 via-sky-400/15 to-violet-400/25 blur-3xl" />
              {/* gradient ring around the circular crop */}
              <div className="relative rounded-full bg-gradient-to-br from-emerald-300 via-sky-400 to-violet-400 p-[3px] shadow-2xl shadow-emerald-400/10">
                <div className="h-44 w-44 overflow-hidden rounded-full bg-ink sm:h-52 sm:w-52 lg:h-60 lg:w-60">
                  <img
                    src="/me-avatar.png"
                    alt="Yash Singh"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </div>
            </motion.div>

            {/* status pill */}
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/25 bg-ink px-4 py-1.5 font-mono text-xs text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Building
            </div>
          </motion.div>
          </div>

          {/* protocol ribbon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-20 border-t border-line pt-8"
          >
            <p className="font-mono text-xs tracking-[0.25em] text-slate-500 uppercase">
              Ecosystems I build with
            </p>
            <div className="mt-5 flex flex-wrap gap-x-10 gap-y-3 font-mono text-sm text-slate-400">
              {protocols.map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <CircleDot size={12} className="text-emerald-400/60" /> {p}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* selected work */}
        <section id="work" className="scroll-mt-28 py-20">
          <Reveal className="mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-2 font-mono text-xs text-purple-300 cursor-default transition-colors hover:border-purple-400/60 hover:bg-purple-400/20"
              >
                <img src="/solana.svg" alt="" className="h-4 w-4 rounded-sm object-cover" />
                #SOLANA FALL
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 font-mono text-xs text-violet-300 cursor-default transition-colors hover:border-violet-400/60 hover:bg-violet-400/20"
              >
                <img src="/monad.svg" alt="" className="h-4 w-4 rounded-sm object-cover" />
                #MOST
              </motion.div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
              Selected Work
            </h2>
          </Reveal>

          <div className="space-y-8">
            {projects.map((project, i) => {
              const Icon = project.icon
              return (
                <Reveal key={project.name} delay={0.05 * i}>
                  <motion.article
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    className="group overflow-hidden rounded-3xl border border-line bg-panel"
                  >
                    <div className={`grid gap-0 ${project.images.length ? 'lg:grid-cols-5' : ''}`}>
                      <div className={`p-8 sm:p-10 ${project.images.length ? 'lg:col-span-3' : ''}`}>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${project.accent} text-slate-950`}>
                            <Icon size={18} />
                          </span>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-100">{project.name}</h3>
                            <p className="font-mono text-xs tracking-wide text-slate-500">{project.tag}</p>
                          </div>
                        </div>

                        <p className="mt-6 leading-relaxed text-slate-400">{project.summary}</p>

                        <ul className="mt-6 space-y-2.5">
                          {project.points.map((pt) => (
                            <li key={pt} className="flex items-start gap-2.5 text-sm text-slate-300">
                              <Zap size={14} className="mt-1 shrink-0 text-emerald-400" />
                              {pt}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-7 flex flex-wrap gap-2">
                          {project.stack.map((s) => (
                            <span
                              key={s}
                              className="rounded-full border border-line bg-ink px-3 py-1 font-mono text-xs text-slate-400"
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        {project.links?.length > 0 && (
                          <div className="mt-6 flex flex-wrap items-center gap-3">
                            {project.links.map((link) => (
                              <a
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                rel="noreferrer"
                                className="group/link inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 font-mono text-xs font-medium text-emerald-300 transition hover:border-emerald-400/60 hover:bg-emerald-400/20"
                              >
                                {link.label}
                                <ArrowUpRight
                                  size={13}
                                  className="transition group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                                />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      {project.images.length > 0 && (
                        <div className="relative flex flex-col justify-center gap-4 border-t border-line bg-ink/60 p-6 lg:col-span-2 lg:border-t-0 lg:border-l">
                          {project.images.map((src, idx) => (
                            <motion.img
                              key={src}
                              src={src}
                              alt={`${project.name} — screenshot ${idx + 1}`}
                              loading="lazy"
                              whileHover={{ scale: 1.02 }}
                              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                              className="w-full rounded-xl border border-line object-cover shadow-2xl shadow-black/50"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.article>
                </Reveal>
              )
            })}

            {/* protocol implementations — from first principles */}
            <Reveal delay={0.1}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#140d23] via-panel to-[#04120f] p-8 sm:p-10"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-300 to-emerald-400 text-slate-950">
                    <Cpu size={18} />
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-100">Protocol Implementations</h3>
                    <p className="font-mono text-xs tracking-wide text-slate-500">
                      Rebuilding core DeFi from first principles
                    </p>
                  </div>
                </div>

                <p className="mt-6 max-w-3xl leading-relaxed text-slate-400">
                  I&rsquo;ve built working implementation versions of the protocols that define
                  DeFi — reconstructing their core mechanisms from the whitepapers up to deeply
                  understand invariants, edge cases and design trade-offs. Currently iterating on
                  improvements to each of them.
                </p>

                <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { name: 'Uniswap V2', desc: 'Constant-product AMM — pairs, LP shares & TWAP oracles' },
                    { name: 'Uniswap V3', desc: 'Concentrated liquidity — ticks, ranges & fee accounting' },
                    { name: 'Aave', desc: 'Pooled lending — interest rate models & liquidations' },
                    { name: 'Curve StableSwap', desc: 'Hybrid invariant for low-slippage stable swaps' },
                  ].map((impl) => (
                    <div
                      key={impl.name}
                      className="rounded-2xl border border-line bg-ink/60 p-5 transition hover:border-violet-400/30"
                    >
                      <div className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-100">
                        <Zap size={14} className="shrink-0 text-violet-300" />
                        {impl.name}
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-400">{impl.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-400/10 px-4 py-1.5 font-mono text-xs text-violet-300">
                  <Sparkles size={13} /> actively working on improvements to each
                </div>
              </motion.article>
            </Reveal>
          </div>
        </section>

        {/* open source */}
        <section id="open-source" className="scroll-mt-28 py-20">
          <SectionHeading kicker="Open Source" title="Open source work" icon={GitPullRequest} />

          <Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {openSource.map((p) => (
                <motion.a
                  key={p.name}
                  href={p.repo || p.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="group flex flex-col rounded-2xl border border-line bg-panel p-6 transition hover:border-emerald-400/40"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-slate-100">{p.name}</h4>
                    <ArrowUpRight
                      size={15}
                      className="text-slate-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-300"
                    />
                  </div>
                  <p className="mt-1 font-mono text-xs tracking-wide text-slate-500">{p.tag}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{p.summary}</p>
                  {p.points?.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {p.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2.5 text-sm text-slate-300">
                          <Zap size={13} className="mt-1 shrink-0 text-emerald-400" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 font-mono text-xs text-emerald-300">
                    <GitBranch size={13} /> View on GitHub
                  </span>
                </motion.a>
              ))}
            </div>
          </Reveal>

          {/* what I'm shipping next */}
          <Reveal className="mt-16">
            <div className="mb-6 flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-slate-500 uppercase">
              <Wrench size={14} className="text-emerald-400" />
              What I&rsquo;m shipping next
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-[#041f16] via-panel to-[#06182a] p-8 sm:p-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-300 to-sky-400 text-slate-950">
                      <Wallet size={18} />
                    </span>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-100">Multi-Chain Account Abstraction Wallet</h3>
                      <p className="font-mono text-xs tracking-wide text-slate-500">Active development · Open source</p>
                    </div>
                  </div>
                  <p className="mt-5 max-w-2xl leading-relaxed text-slate-400">
                    Building a multi-chain account abstraction wallet utilizing ERC-4337 to enable
                    gasless transactions and seamless cross-chain asset management across EVM
                    networks.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 font-mono text-xs text-emerald-300 sm:self-center">
                  <Sparkles size={14} /> work in progress
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* about */}
        <section id="about" className="scroll-mt-28 py-20">
          <SectionHeading kicker="About" title="Loves building" icon={Cpu} />
          <div className="grid gap-8 lg:grid-cols-5">
            <Reveal className="lg:col-span-3">
              <div className="h-full rounded-3xl border border-line bg-panel p-8 sm:p-10">
                <p className="leading-relaxed text-slate-400">
                  I’m a sophomore at <span className="font-semibold text-slate-200">IIT Roorkee</span>{' '}
                  drawn to DeFi at the protocol layer — how AMM invariants shape liquidity and
                  slippage, how lending markets manage collateral risk, and how governance
                  mechanisms survive adversarial conditions. I spend most of my time reading
                  whitepapers and post-mortems, then rebuilding the ideas from first principles to
                  find where the assumptions break — because the mechanisms that survive an
                  environment where every participant is adversarial by default are the ones worth
                  understanding deeply.
                </p>
                <p className="mt-5 leading-relaxed text-slate-400">
                  Currently, I’m exploring <span className="font-semibold text-slate-200">blockchain infrastructure</span> —
                  consensus and execution clients, the P2P networking stack, MEV supply chains,
                  mempools, account abstraction and cross-chain interoperability: how this
                  infrastructure operates at scale, where decentralization trades off against
                  efficiency, and how its design decisions shape everything built on top.
                </p>
                <p className="mt-5 leading-relaxed text-slate-400">
                  Away from the terminal, I’ve qualified{' '}
                  <span className="font-semibold text-slate-200">IOQM twice</span> with regional
                  scores in the top 5% and represented my city at the{' '}
                  <span className="font-semibold text-slate-200">U-16 State Football Championship</span>.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-2">
              <div className="grid h-full grid-rows-3 gap-4">
                {[
                  { icon: Trophy, big: '2×', small: 'IOQM qualified · top 5% regional' },
                  { icon: GraduationCap, big: 'IIT Roorkee', small: 'Sophomore · engineering' },
                  { icon: Activity, big: 'U-16', small: 'State Football Championship' },
                ].map(({ icon: Icon, big, small }) => (
                  <div
                    key={big}
                    className="flex items-center gap-4 rounded-2xl border border-line bg-panel px-6 py-5"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
                      <Icon size={18} />
                    </span>
                    <div>
                      <div className="text-xl font-bold text-slate-100">{big}</div>
                      <div className="text-sm text-slate-500">{small}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* contact */}
        <section id="contact" className="scroll-mt-28 py-20 pb-28">
          <SectionHeading kicker="Contact" title="Let's build something on-chain" icon={Send} />
          <Reveal>
            <div className="rounded-3xl border border-line bg-panel p-8 sm:p-10">
              <p className="max-w-2xl leading-relaxed text-slate-400">
                Open to protocol engineering collaborations, open-source work and hackathon
                teams. The fastest ways to reach me:
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {socials.map(({ label, href, icon: Icon }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -3 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="group flex items-center justify-between rounded-2xl border border-line bg-ink px-5 py-4 transition hover:border-emerald-400/40"
                  >
                    <span className="flex items-center gap-3 text-sm font-medium text-slate-200">
                      <Icon size={17} className="text-slate-400 transition group-hover:text-emerald-300" />
                      {label}
                    </span>
                    <ArrowUpRight
                      size={15}
                      className="text-slate-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-300"
                    />
                  </motion.a>
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-line py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 font-mono text-xs text-slate-500 sm:flex-row">
          <span>© {new Date().getFullYear()} Yash Singh · IIT Roorkee · DeFi builder ⚡</span>
          <span className="flex items-center gap-2">
            <Terminal size={13} /> built with React · Tailwind · Framer Motion
          </span>
        </div>
      </footer>
    </div>
  )
}
