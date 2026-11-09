import { Head, Link, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { FlashToaster } from '@/components/flash-toaster';
import { SiteFooter } from '@/components/site-footer';
import { ChevronRight, ChevronLeft, Quote, ArrowRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const heroVerses = [
    { text: 'Thy word is a lamp unto my feet, and a light unto my path.', ref: 'Psalm 119:105' },
    { text: 'In the beginning was the Word, and the Word was with God, and the Word was God.', ref: 'John 1:1' },
    { text: 'Thy word have I hid in mine heart, that I might not sin against thee.', ref: 'Psalm 119:11' },
    { text: 'All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness.', ref: '2 Timothy 3:16' },
    { text: 'So then faith cometh by hearing, and hearing by the word of God.', ref: 'Romans 10:17' },
    { text: 'The grass withereth, the flower fadeth: but the word of our God shall stand for ever.', ref: 'Isaiah 40:8' },
];

// One fact per line — the detail lives behind each link.
const facts = [
    { title: '66 books', desc: 'the whole Bible in distraction-free Easy Read mode.', href: '/bible/gn/1' },
    { title: 'S.C.R.I.P.T. method', desc: 'denomination-neutral reading and reflection.', href: '/guides/how-to-read-the-bible' },
    { title: 'Journaling', desc: 'capture your insights, prayers, and reflections.', href: '/resources/journaling-prompts-for-spiritual-growth' },
    { title: 'The Assistant', desc: 'turn study into lessons and sermons.', href: '/pricing' },
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [verseIndex, setVerseIndex] = useState(0);
    const [versePaused, setVersePaused] = useState(false);

    // Calm auto-advance (7s hold per verse); off for reduced-motion users,
    // paused while hovered or focused, and reset by any manual navigation.
    useEffect(() => {
        if (versePaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        const timer = setInterval(() => {
            setVerseIndex((i) => (i + 1) % heroVerses.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [versePaused, verseIndex]);

    return (
        <div className="min-h-screen bg-[#F5F2EA] text-[#1a1a1a]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            <FlashToaster />
            <Head title="InspireWrite by Glenride - S.C.R.I.P.T. Bible Reading & Spiritual Journaling">
                <meta name="description" content="InspireWrite by Glenride helps believers read Scripture with the denomination-neutral S.C.R.I.P.T. method, journal reflections, and build lessons and sermons with the Assistant." />
                <meta name="keywords" content="Bible app, S.C.R.I.P.T. method, Bible reading method, spiritual journaling, verse highlighting, Bible study, Christian app, InspireWrite, Glenride" />
                <meta property="og:title" content="InspireWrite by Glenride - S.C.R.I.P.T. Bible Reading & Spiritual Journaling" />
                <meta property="og:description" content="Read Scripture with InspireWrite's S.C.R.I.P.T. method: context, clarity, and life application." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://inspirewrite.online" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "InspireWrite",
                        "alternateName": "InspireWrite by Glenride",
                        "applicationCategory": "ReligiousApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "description": "InspireWrite by Glenride - the Bible reading and spiritual journaling companion for modern believers. Features include complete Bible access, the denomination-neutral S.C.R.I.P.T. method, verse highlighting, bookmarks, notes, sermon building with the Assistant, and spiritual journaling.",
                        "featureList": [
                            "Complete Bible Access with 66 books",
                            "Distraction-free Easy Read mode",
                            "S.C.R.I.P.T. method for guided Bible reading and reflection",
                            "Color-coded verse highlighting",
                            "Verse favorites and bookmarks",
                            "Personal notes on any verse",
                            "Sermon building with the Assistant",
                            "Structured lesson creation with the Assistant",
                            "Spiritual journaling dashboard"
                        ],
                        "creator": {
                            "@type": "Organization",
                            "name": "Glenride",
                            "founder": {
                                "@type": "Person",
                                "name": "D'Vaughn House"
                            }
                        },
                        "url": "https://inspirewrite.online"
                    })
                }} />
            </Head>

            {/* Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#F5F2EA]/95 backdrop-blur-sm border-b border-black/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="motion-logo flex items-center gap-3" aria-label="InspireWrite home">
                        <img src="/images/inspirewrite-icon.svg" alt="" className="h-9 w-auto" />
                        <span className="text-2xl tracking-[0.08em] uppercase font-bold" style={{ fontFamily: 'Cormorant Garamond, DM Serif Display, serif' }}>
                            INSPIREWRITE<span className="text-[#C59B27]">.</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 text-sm tracking-widest uppercase">
                        <Link href="/" className="hover:text-yellow-600 transition-colors">Home</Link>
                        <Link href="/about" className="hover:text-yellow-600 transition-colors">About</Link>
                        <Link href="#features" className="hover:text-yellow-600 transition-colors">Features</Link>
                        <Link href="/pricing" className="hover:text-yellow-600 transition-colors">Pricing</Link>
                        <Link href="/bible/gn/1" className="hover:text-yellow-600 transition-colors">Scripture</Link>
                        {auth.user ? (
                            <Link href="/dashboard" className="bg-yellow-500 text-[#1a1a1a] font-semibold px-5 py-2.5 hover:bg-yellow-400 transition-colors">
                                My Studio
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="hover:text-yellow-600 transition-colors">Log in</Link>
                                <Link href="/register" className="bg-yellow-500 text-[#1a1a1a] font-semibold px-5 py-2.5 hover:bg-yellow-400 transition-colors">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-[#F5F2EA] border-t border-black/5 px-6 py-4">
                        <nav className="flex flex-col gap-4 text-sm tracking-widest uppercase">
                            <Link href="/" className="hover:text-yellow-600 transition-colors py-2">Home</Link>
                            <Link href="/about" className="hover:text-yellow-600 transition-colors py-2">About</Link>
                            <Link href="#features" className="hover:text-yellow-600 transition-colors py-2">Features</Link>
                            <Link href="/pricing" className="hover:text-yellow-600 transition-colors py-2">Pricing</Link>
                            <Link href="/bible/gn/1" className="hover:text-yellow-600 transition-colors py-2">Scripture</Link>
                            {auth.user ? (
                                <Link href="/dashboard" className="bg-yellow-500 text-[#1a1a1a] font-semibold px-5 py-2.5 text-center hover:bg-yellow-400 transition-colors">
                                    My Studio
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="hover:text-yellow-600 transition-colors py-2">Log in</Link>
                                    <Link href="/register" className="bg-yellow-500 text-[#1a1a1a] font-semibold px-5 py-2.5 text-center hover:bg-yellow-400 transition-colors">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="min-h-screen flex items-center pt-20 relative overflow-hidden">
                {/* Background Accent */}
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-2xl" />

                <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative z-10 min-w-0">
                        <p className="motion-reveal text-yellow-600 uppercase tracking-[0.3em] text-sm mb-4 font-medium">By Glenride</p>
                        <h1 className="text-[clamp(2.75rem,12vw,3rem)] md:text-[clamp(2.75rem,6vw,4rem)] lg:text-[clamp(3.5rem,6.25vw,5rem)] xl:text-[clamp(4.5rem,6.25vw,5rem)] font-bold leading-[0.9] mb-6 max-w-full" style={{ fontFamily: 'Cormorant Garamond, DM Serif Display, serif' }}>
                            <span className="hero-line"><span>INSPIRE<span className="text-yellow-500">WRITE</span>.</span></span>
                        </h1>
                        <p className="motion-reveal reveal-delay-2 text-xl text-gray-700 mb-4 max-w-md leading-relaxed">
                            The Bible reading and spiritual journaling companion for modern believers.
                        </p>
                        <p className="motion-reveal reveal-delay-3 text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
                            Free to start — read all 66 books in distraction-free Easy Read mode.
                        </p>
                        <div className="motion-reveal reveal-delay-4 flex flex-wrap gap-4">
                            <Link
                                href="/bible/gn/1"
                                className="btn-lift inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-8 py-4 text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors group font-medium"
                            >
                                Start Reading
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            {!auth.user && (
                                <Link
                                    href="/register"
                                    className="btn-lift inline-flex items-center gap-2 border-2 border-[#1a1a1a] px-8 py-4 text-sm uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-white transition-colors font-medium"
                                >
                                    Create Account
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Verse carousel with the IW monogram seal */}
                    <div
                        className="motion-reveal reveal-delay-2 relative min-w-0"
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Bible verses"
                        onMouseEnter={() => setVersePaused(true)}
                        onMouseLeave={() => setVersePaused(false)}
                        onFocus={() => setVersePaused(true)}
                        onBlur={() => setVersePaused(false)}
                    >
                        <div className="bg-white p-10 md:p-12 shadow-2xl relative z-10 border border-black/5">
                            <div className="border border-yellow-500/30 p-8 bg-[#FDFBF7]">
                                <img src="/images/inspirewrite-monogram-seal.svg" alt="InspireWrite monogram seal" className="motion-seal mx-auto mb-6 h-28 w-auto" />
                                <Quote className="text-yellow-600 mb-6" size={36} />
                                <div key={verseIndex} className="verse-slide" aria-live="polite">
                                    <p className="text-xl md:text-2xl italic text-gray-800 mb-6 leading-relaxed" style={{ fontFamily: 'Cormorant Garamond, DM Serif Display, serif' }}>
                                        "{heroVerses[verseIndex].text}"
                                    </p>
                                    <p className="text-xs text-yellow-700 uppercase tracking-[0.25em] font-semibold">{heroVerses[verseIndex].ref}</p>
                                </div>
                                <div className="flex items-center justify-between mt-8">
                                    <button
                                        type="button"
                                        aria-label="Previous verse"
                                        onClick={() => setVerseIndex((i) => (i - 1 + heroVerses.length) % heroVerses.length)}
                                        className="p-2 text-gray-500 hover:text-yellow-600 transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div className="flex items-center gap-2">
                                        {heroVerses.map((verse, i) => (
                                            <button
                                                key={verse.ref}
                                                type="button"
                                                aria-label={`Go to ${verse.ref}`}
                                                aria-current={i === verseIndex ? 'true' : undefined}
                                                onClick={() => setVerseIndex(i)}
                                                className={`h-2 rounded-full transition-all duration-300 ${i === verseIndex ? 'w-6 bg-yellow-600' : 'w-2 bg-gray-300 hover:bg-yellow-500'}`}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        aria-label="Next verse"
                                        onClick={() => setVerseIndex((i) => (i + 1) % heroVerses.length)}
                                        className="p-2 text-gray-500 hover:text-yellow-600 transition-colors"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key facts — one line each; the detail lives behind the link */}
            <section id="features" className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <ul className="divide-y divide-black/10">
                        {facts.map((fact, i) => (
                            <li key={fact.title} className={`motion-reveal reveal-delay-${(i % 4) + 1}`}>
                                <Link href={fact.href} className="group flex items-baseline gap-3 py-5">
                                    <span className="text-lg font-bold uppercase tracking-wider group-hover:text-yellow-600 transition-colors">{fact.title}</span>
                                    <span className="text-gray-600">{fact.desc}</span>
                                    <ChevronRight size={16} className="ml-auto shrink-0 text-gray-400 group-hover:text-yellow-600 group-hover:translate-x-1 transition-all" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <p className="motion-reveal mt-10 text-center text-gray-600">
                        No ads — just you and God&apos;s Word. <Link href="/pricing" className="text-yellow-600 hover:text-yellow-500 underline underline-offset-4">Free to start, Study $7/mo, Pro $27/mo.</Link>
                    </p>
                </div>
            </section>

            {/* Journey — where to go next */}
            <section className="py-12 bg-[#F5F2EA]">
                <div className="max-w-4xl mx-auto px-6">
                    <nav className="motion-reveal flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm uppercase tracking-widest">
                        <Link href="/guides/how-to-read-the-bible" className="hover:text-yellow-600 transition-colors">How to Read the Bible</Link>
                        <span className="text-yellow-600" aria-hidden="true">·</span>
                        <Link href="/guides/how-to-pray-when-you-feel-stuck" className="hover:text-yellow-600 transition-colors">How to Pray</Link>
                        <span className="text-yellow-600" aria-hidden="true">·</span>
                        <Link href="/resources/best-bible-reading-plans" className="hover:text-yellow-600 transition-colors">Reading Plans</Link>
                        <span className="text-yellow-600" aria-hidden="true">·</span>
                        <Link href="/resources/journaling-prompts-for-spiritual-growth" className="hover:text-yellow-600 transition-colors">Journaling Prompts</Link>
                        <span className="text-yellow-600" aria-hidden="true">·</span>
                        <Link href="/pricing" className="hover:text-yellow-600 transition-colors">Pricing</Link>
                        <span className="text-yellow-600" aria-hidden="true">·</span>
                        <Link href="/about" className="hover:text-yellow-600 transition-colors">About</Link>
                    </nav>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}
