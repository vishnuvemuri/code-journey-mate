import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area } from 'recharts';
import {
    Search, Sun, Moon, Menu, X, User, Lock, Mail, Code, ArrowRight, PlayCircle,
    LayoutDashboard, Trophy, Users, BookOpen, Database, Link2, Layers, TreePalm, BarChart2, Zap,
    Star, CheckCircle, Briefcase, PlusCircle, Upload, UserPlus, Trash2, Edit, MoreVertical, FileQuestion, UserCog,
    Check, ChevronsUpDown, Calendar as CalendarIcon, Target, Clock, Award, TrendingUp
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from 'firebase/auth';
import {
    getFirestore,
    collection,
    onSnapshot,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    writeBatch,
    doc,
    getCountFromServer
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { cn } from '../lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Badge } from '../components/ui/badge';

// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyB3EtnPHYOIcqj0uQ3CJQ0ZRxV-PxFxQGs",
    authDomain: "exam-81d80.firebaseapp.com",
    projectId: "exam-81d80",
    storageBucket: "exam-81d80.appspot.com",
    messagingSenderId: "416153526053",
    appId: "1:416153526053:web:4982d985aa36da077204cc",
    measurementId: "G-Z1J8B3GHWW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// --- Admin Configuration ---
const ADMIN_UID = "3RIYRmCsD7f9oMcixR98i2VHNFu2"; // IMPORTANT: Replace with your Firebase User ID.

// --- Helper Functions & Constants ---
const getStatusColor = (status, darkMode) => {
    switch (status) {
        case 'Completed': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
        case 'In Progress': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
        default: return darkMode ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
};

const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
        case 'Easy': return 'text-emerald-600 dark:text-emerald-400';
        case 'Medium': return 'text-amber-600 dark:text-amber-400';
        case 'Hard': return 'text-red-600 dark:text-red-400';
        default: return 'text-slate-500 dark:text-slate-400';
    }
};

const topics = ["Arrays", "Strings", "Linked Lists", "Stacks & Queues", "Trees", "Graphs", "Dynamic Programming"];
const companies = [
    'Microsoft', 'Adobe', 'Goldman Sachs', 'Intuit', 'Amazon', 'Google', 'Meta',
    'Apple', 'Netflix', 'Uber', 'Airbnb', 'Twitter', 'LinkedIn', 'Salesforce',
    'Oracle', 'IBM', 'Intel', 'Cisco', 'VMware', 'Palantir', 'Stripe', 'Square',
    'Dropbox', 'Slack', 'Zoom', 'Shopify', 'Twilio', 'Datadog', 'Snowflake',
    'MongoDB', 'Atlassian', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'Red Hat',
    'NVIDIA', 'AMD', 'Qualcomm', 'Broadcom', 'ARM', 'TSMC', 'Samsung', 'LG',
    'Sony', 'Panasonic', 'Toshiba', 'Hitachi', 'Fujitsu', 'NEC', 'Canon',
    'HP', 'Dell', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Razer', 'Logitech',
    'Western Digital', 'Seagate', 'Kingston', 'Crucial', 'G.Skill', 'Corsair',
    'Thermaltake', 'Cooler Master', 'NZXT', 'Fractal Design', 'Phanteks',
    'EVGA', 'ASRock', 'Gigabyte', 'MSI', 'Biostar', 'ECS', 'Jetway',
    'Zotac', 'PNY', 'VisionTek', 'XFX', 'PowerColor', 'Sapphire', 'HIS',
    'Club 3D', 'Gainward', 'Palit', 'Inno3D', 'Colorful', 'Maxsun', 'Yeston'
];

// Function to extract company name from problem URL
const extractCompanyFromUrl = (url) => {
    if (!url) return [];

    const urlLower = url.toLowerCase();
    const detectedCompanies = [];

    // Check for company domains and patterns
    const companyPatterns = {
        'leetcode.com/company/amazon': ['Amazon'],
        'leetcode.com/company/google': ['Google'],
        'leetcode.com/company/microsoft': ['Microsoft'],
        'leetcode.com/company/facebook': ['Meta'],
        'leetcode.com/company/apple': ['Apple'],
        'leetcode.com/company/netflix': ['Netflix'],
        'leetcode.com/company/uber': ['Uber'],
        'leetcode.com/company/airbnb': ['Airbnb'],
        'leetcode.com/company/twitter': ['Twitter'],
        'leetcode.com/company/linkedin': ['LinkedIn'],
        'leetcode.com/company/salesforce': ['Salesforce'],
        'leetcode.com/company/oracle': ['Oracle'],
        'leetcode.com/company/ibm': ['IBM'],
        'leetcode.com/company/intel': ['Intel'],
        'leetcode.com/company/cisco': ['Cisco'],
        'leetcode.com/company/vmware': ['VMware'],
        'leetcode.com/company/palantir': ['Palantir'],
        'leetcode.com/company/stripe': ['Stripe'],
        'leetcode.com/company/square': ['Square'],
        'leetcode.com/company/dropbox': ['Dropbox'],
        'leetcode.com/company/slack': ['Slack'],
        'leetcode.com/company/zoom': ['Zoom'],
        'leetcode.com/company/shopify': ['Shopify'],
        'leetcode.com/company/twilio': ['Twilio'],
        'leetcode.com/company/datadog': ['Datadog'],
        'leetcode.com/company/snowflake': ['Snowflake'],
        'leetcode.com/company/mongodb': ['MongoDB'],
        'leetcode.com/company/atlassian': ['Atlassian'],
        'leetcode.com/company/github': ['GitHub'],
        'leetcode.com/company/gitlab': ['GitLab'],
        'leetcode.com/company/docker': ['Docker'],
        'leetcode.com/company/kubernetes': ['Kubernetes'],
        'leetcode.com/company/redhat': ['Red Hat'],
        'leetcode.com/company/nvidia': ['NVIDIA'],
        'leetcode.com/company/amd': ['AMD'],
        'leetcode.com/company/qualcomm': ['Qualcomm'],
        'leetcode.com/company/broadcom': ['Broadcom']
    };

    // Check for company patterns in URL
    for (const [pattern, companyList] of Object.entries(companyPatterns)) {
        if (urlLower.includes(pattern)) {
            detectedCompanies.push(...companyList);
        }
    }

    // Check for company names in URL path
    for (const company of companies) {
        const companyLower = company.toLowerCase();
        if (urlLower.includes(companyLower) || urlLower.includes(companyLower.replace(/\s+/g, '')) || urlLower.includes(companyLower.replace(/\s+/g, '-'))) {
            if (!detectedCompanies.includes(company)) {
                detectedCompanies.push(company);
            }
        }
    }

    return detectedCompanies;
};

const difficulties = ['Easy', 'Medium', 'Hard'];
const statuses = ['Not Started', 'In Progress', 'Completed'];

// --- Animation Hook ---
const useScrollAnimation = () => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    React.useEffect(() => { if (inView) { controls.start('visible'); } }, [controls, inView]);
    const animationVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
    return { ref, controls, animationVariants };
};


// --- UI Components ---

const LoginModal = ({ onClose }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleAuthAction = async (e) => {
        e.preventDefault();
        if (!email || !password) { setError('Please enter both email and password.'); return; }
        setError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onClose();
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="relative w-full max-w-md">
                <div className="w-full p-8 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-2xl backdrop-blur-lg">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"><X size={24} /></button>
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Welcome Back</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">Login to continue your journey.</p>
                    </div>
                    <form onSubmit={handleAuthAction} className="space-y-6">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" size={18} />
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600/50 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200" />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" size={18} />
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600/50 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200" />
                        </div>
                        {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}
                        <button type="submit" disabled={loading} className="w-full px-4 py-3 text-sm font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-500 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)] disabled:bg-blue-400">
                            {loading ? 'Processing...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const HomePage = ({ toggleTheme, darkMode, onGetStarted }) => {
    const { ref: heroRef, controls: heroControls, animationVariants: heroVariants } = useScrollAnimation();
    const { ref: featuresRef, controls: featuresControls, animationVariants: featuresVariants } = useScrollAnimation();
    const { ref: statsRef, controls: statsControls, animationVariants: statsVariants } = useScrollAnimation();
    const { ref: ctaRef, controls: ctaControls, animationVariants: ctaVariants } = useScrollAnimation();

    const topicCards = [
        { icon: Database, title: 'Arrays', difficulty: 'Easy', color: 'text-sky-400' },
        { icon: Link2, title: 'Linked Lists', difficulty: 'Medium', color: 'text-emerald-400' },
        { icon: Layers, title: 'Stacks & Queues', difficulty: 'Easy', color: 'text-purple-400' },
        { icon: TreePalm, title: 'Trees', difficulty: 'Hard', color: 'text-amber-400' },
        { icon: BarChart2, title: 'Graphs', difficulty: 'Hard', color: 'text-rose-400' },
        { icon: Zap, title: 'Dynamic Programming', difficulty: 'Hard', color: 'text-fuchsia-400' },
    ];

    const featureCards = [
        { icon: CheckCircle, title: 'Structured Learning Paths', description: 'Follow curated DSA sheets and company-specific problem lists to stay on track.' },
        { icon: Briefcase, title: 'Company-Specific Prep', description: 'Target your dream company with dedicated zones for top tech giants.' },
        { icon: Trophy, title: 'Gamified Coding Challenges', description: 'Stay motivated with daily challenges, streaks, and a competitive leaderboard.' },
    ];

    const statItems = [
        { value: '5,000+', label: 'Dedicated Users' },
        { value: '100,000+', label: 'Submissions' },
        { value: '250+', label: 'Dream Offers' },
        { value: '50+', label: 'Partner Companies' },
        { value: '4.8/5', label: 'User Rating' },
        { value: '150%', label: 'Avg. Salary Hike' },
    ];

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}`}>
            {/* Header */}
            <header className={`sticky top-0 z-30 w-full p-4 backdrop-blur-lg border-b ${darkMode ? 'bg-slate-900/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Code size={24} className="text-blue-500" />
                        <span className="text-xl font-bold">Skillyheads</span>
                    </div>
                    <nav className={`hidden md:flex items-center space-x-6 text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <a href="#features" className="hover:text-blue-500 transition-colors">Features</a>
                        <a href="#stats" className="hover:text-blue-500 transition-colors">Stats</a>
                        <a href="#cta" className="hover:text-blue-500 transition-colors">Start Now</a>
                    </nav>
                    <div className="flex items-center space-x-2">
                        <button onClick={toggleTheme} className={`p-2 rounded-lg transition-all duration-300 ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`}>
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button onClick={onGetStarted} className={`hidden sm:block text-sm font-semibold px-4 py-2 rounded-md transition-colors ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`}>Sign In</button>
                        <button onClick={onGetStarted} className="text-sm font-semibold px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-[0_0_15px_rgba(59,130,246,0.4)]">Get Started</button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                {/* Hero Section */}
                <motion.section ref={heroRef} animate={heroControls} initial="hidden" variants={heroVariants} className="container mx-auto px-4 py-16 sm:py-24">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-center lg:text-left">
                            <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>#Skillyheads Movement</span>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
                                Master DSA & Land <br /> Your <span className="text-blue-500">Dream Job</span>
                            </h1>
                            <p className={`mt-6 text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'} max-w-lg mx-auto lg:mx-0`}>
                                Join thousands of developers in the ultimate coding interview preparation platform. Gamified learning, real company challenges, and AI-powered mentorship.
                            </p>
                            <div className="mt-8 flex justify-center lg:justify-start space-x-4">
                                <button onClick={onGetStarted} className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                                    Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                                </button>
                                <button className={`inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-colors ${darkMode ? 'bg-slate-800/70 hover:bg-slate-700/70' : 'bg-slate-200 hover:bg-slate-300'}`}>
                                    <PlayCircle className="mr-2 h-5 w-5" /> Watch Demo
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {topicCards.map((card, i) => (
                                <motion.div key={card.title} className={`p-6 border rounded-xl text-center transition-all duration-300 ${darkMode ? 'bg-slate-800/50 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'} hover:-translate-y-1 hover:shadow-lg`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <card.icon size={32} className={`mx-auto mb-3 ${card.color}`} />
                                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{card.title}</h3>
                                    <span className={`mt-2 inline-block text-xs font-medium px-2 py-0.5 rounded-full ${getDifficultyColor(card.difficulty).replace('text-', 'bg-').replace('-400', '-500/10').replace('-600', '-500/10')} ${getDifficultyColor(card.difficulty)}`}>{card.difficulty}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Features Section */}
                <motion.section ref={featuresRef} animate={featuresControls} initial="hidden" variants={featuresVariants} id="features" className="container mx-auto px-4 py-24">
                    <div className="text-center mb-12">
                        <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>#Skillyheads</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Everything You Need to <span className="text-blue-500">Succeed</span></h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {featureCards.map((card, i) => (
                            <motion.div key={card.title} className={`p-8 border rounded-xl transition-shadow hover:shadow-xl ${darkMode ? 'bg-slate-800/50 border-slate-700/80' : 'bg-white border-slate-200'}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={featuresControls}
                                transition={{ delay: i * 0.2 }}
                                variants={featuresVariants}
                            >
                                <div className="inline-block p-3 bg-blue-600/10 rounded-lg mb-4">
                                    <card.icon className="text-blue-500" size={24} />
                                </div>
                                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{card.title}</h3>
                                <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{card.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Social Proof Section */}
                <motion.section ref={statsRef} animate={statsControls} initial="hidden" variants={statsVariants} id="stats" className="container mx-auto px-4 py-24">
                    <div className="text-center mb-12">
                        <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>#Skillyheads</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Trusted by a <span className="text-blue-500">Growing Community</span></h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
                        {statItems.map(item => (
                            <div key={item.label} className={`p-6 border rounded-xl ${darkMode ? 'bg-slate-800/50 border-slate-700/80' : 'bg-white border-slate-200'}`}>
                                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.value}</p>
                                <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* CTA Section */}
                <motion.section ref={ctaRef} animate={ctaControls} initial="hidden" variants={ctaVariants} id="cta" className="container mx-auto px-4 py-24">
                    <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl p-12 text-center">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Ready to Transform Your Career?</h2>
                        <p className="mt-4 text-lg text-blue-200 max-w-2xl mx-auto">Join the #1 platform for cracking technical interviews and landing your dream job in tech.</p>
                        <div className="mt-8">
                            <button onClick={onGetStarted} className="inline-flex items-center justify-center px-8 py-4 font-semibold text-blue-600 rounded-lg bg-white hover:bg-slate-200 transition-all duration-300 shadow-lg">
                                Start Your Journey Now
                            </button>
                        </div>
                    </div>
                </motion.section>
            </main>

            {/* Footer */}
            <footer className={`border-t ${darkMode ? 'border-slate-700/50' : 'border-slate-200'}`}>
                <div className={`container mx-auto px-4 py-8 text-center text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    &copy; {new Date().getFullYear()} Skillyheads. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
};

const Header = ({ user, toggleTheme, darkMode, toggleSidebar, onAdminClick, isAdminView }) => {
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <header className={`sticky top-0 z-30 w-full p-4 backdrop-blur-lg border-b ${darkMode ? 'bg-slate-900/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <button onClick={toggleSidebar} className={`md:hidden p-2 rounded-lg ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'}`}>
                        <Menu size={20} />
                    </button>
                    <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                        Skillyheads Hub
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    {user?.uid === ADMIN_UID && (
                        <button onClick={onAdminClick} className={`px-3 py-2 text-sm font-semibold rounded-lg border transition-colors ${isAdminView ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                            {isAdminView ? 'User View' : 'Admin'}
                        </button>
                    )}
                    <button onClick={toggleTheme} className={`p-2 rounded-lg transition-all duration-300 ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'}`}>
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <div className="hidden md:flex items-center space-x-4">
                        <div className={`flex items-center space-x-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            <User size={18} />
                            <span>{user.email.split('@')[0]}</span>
                        </div>
                        <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-red-600/90 hover:bg-red-500/90 transition-all duration-300">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

const Sidebar = ({ activeFilters, handleFilterChange, isOpen, darkMode }) => (
    <aside className={`fixed top-0 left-0 z-20 w-64 h-full backdrop-blur-xl border-r transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:sticky md:top-[81px] md:h-[calc(100vh-81px)] ${darkMode ? 'bg-slate-800/70 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
        <div className="p-4 space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" size={18} />
                <input type="text" placeholder="Search problems..." className="w-full bg-slate-200/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600/50 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200" value={activeFilters.search} onChange={(e) => handleFilterChange('search', e.target.value)} />
            </div>
            <FilterGroup title="Topic" options={['All', ...topics]} filterKey="topic" activeFilters={activeFilters} handleFilterChange={handleFilterChange} />
            <FilterGroup title="Difficulty" options={['All', ...difficulties]} filterKey="difficulty" activeFilters={activeFilters} handleFilterChange={handleFilterChange} />
            <FilterGroup title="Company" options={['All', ...companies]} filterKey="company" activeFilters={activeFilters} handleFilterChange={handleFilterChange} />
            <FilterGroup title="Status" options={['All', ...statuses]} filterKey="status" activeFilters={activeFilters} handleFilterChange={handleFilterChange} />
        </div>
    </aside>
);

const FilterGroup = ({ title, options, filterKey, activeFilters, handleFilterChange }) => (
    <div>
        <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-300">{title}</h3>
        <div className="flex flex-wrap gap-2">
            {options.map(option => (
                <button key={option} onClick={() => handleFilterChange(filterKey, option)} className={`px-3 py-1 text-sm rounded-full transition-all duration-200 ${activeFilters[filterKey] === option ? 'bg-blue-600 text-white font-semibold shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'bg-slate-200 dark:bg-slate-700/60 hover:bg-slate-300 dark:hover:bg-slate-600/60 text-slate-700 dark:text-slate-300'}`}>
                    {option}
                </button>
            ))}
        </div>
    </div>
);

// Searchable Company Dropdown Component
const CompanyDropdown = ({ selectedCompanies, onCompanyChange, darkMode, customCompanies = [] }) => {
    const [open, setOpen] = React.useState(false);
    const [customText, setCustomText] = React.useState('');

    // Combine predefined companies with custom ones
    const allCompanies = [...companies, ...customCompanies];

    const handleAddCustomCompany = () => {
        if (customText.trim() && !allCompanies.includes(customText.trim())) {
            onCompanyChange(customText.trim());
            setCustomText('');
        }
    };

    const handleRemoveCompany = (company) => {
        onCompanyChange(company);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium">Companies</label>

            {/* Selected Companies Display */}
            {selectedCompanies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedCompanies.map((company) => (
                        <Badge
                            key={company}
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            {company}
                            <X
                                size={14}
                                className="cursor-pointer hover:text-red-500"
                                onClick={() => handleRemoveCompany(company)}
                            />
                        </Badge>
                    ))}
                </div>
            )}

            {/* Searchable Dropdown */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            "w-full justify-between rounded-md border px-3 py-2 text-sm flex items-center",
                            darkMode
                                ? "bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
                                : "bg-slate-200 border-slate-300 text-slate-800 hover:bg-slate-100"
                        )}
                    >
                        {selectedCompanies.length > 0
                            ? `${selectedCompanies.length} companies selected`
                            : "Select companies..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search companies..." />
                        <CommandEmpty>No company found.</CommandEmpty>
                        <CommandGroup>
                            <CommandList className="max-h-48">
                                {allCompanies.map((company) => (
                                    <CommandItem
                                        key={company}
                                        onSelect={() => {
                                            onCompanyChange(company);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedCompanies.includes(company) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {company}
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </CommandGroup>

                        {/* Custom Company Input */}
                        <div className="border-t p-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add custom company..."
                                    value={customText}
                                    onChange={(e) => setCustomText(e.target.value)}
                                    className="flex-1 px-2 py-1 text-sm rounded border"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddCustomCompany();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCustomCompany}
                                    className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

const ProblemTable = ({ problems, onStatusChange, darkMode }) => (
    <div className="w-full overflow-x-auto">
        <div className={`min-w-full rounded-xl border backdrop-blur-lg ${darkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-slate-200'}`}>
            <div className={`grid grid-cols-12 px-4 py-3 font-semibold border-b ${darkMode ? 'text-slate-400 border-slate-700/50' : 'text-slate-500 border-slate-200'}`}>
                <div className="col-span-6">Problem</div>
                <div className="col-span-2 text-center">Difficulty</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-center">Companies</div>
            </div>
            {problems.map((problem) => (<ProblemRow key={problem.id} problem={problem} onStatusChange={onStatusChange} darkMode={darkMode} />))}
        </div>
    </div>
);

const ProblemRow = ({ problem, onStatusChange, darkMode }) => (
    <div className={`grid grid-cols-12 items-center px-4 py-3 border-t transition-colors duration-200 ${darkMode ? 'border-slate-700/80 hover:bg-slate-700/40' : 'border-slate-200 hover:bg-slate-100/70'}`}>
        <div className="col-span-6"><a href={problem.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200">{problem.name}</a></div>
        <div className={`col-span-2 text-center font-semibold ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</div>
        <div className="col-span-2 flex justify-center">
            <div className="relative">
                <select value={problem.status} onChange={(e) => onStatusChange(problem.id, e.target.value)} className={`appearance-none text-xs font-semibold rounded-full px-3 py-1 border text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(problem.status, darkMode)}`}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
        </div>
        <div className="col-span-2 text-center text-xs text-slate-600 dark:text-slate-400">
            {problem.companies && problem.companies.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-1">
                    {problem.companies.slice(0, 3).map((company, index) => (
                        <span key={index} className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                            {company}
                        </span>
                    ))}
                    {problem.companies.length > 3 && (
                        <span className="text-slate-500 dark:text-slate-400">+{problem.companies.length - 3}</span>
                    )}
                </div>
            ) : (
                <span className="text-slate-400">N/A</span>
            )}
        </div>
    </div>
);

const ActivityHeatmap = ({ data }) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 180);

    const days = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getColor = (count) => {
        if (count === 0) return 'bg-slate-200 dark:bg-slate-700/70';
        if (count < 2) return 'bg-emerald-200 dark:bg-emerald-900';
        if (count < 4) return 'bg-emerald-400 dark:bg-emerald-700';
        return 'bg-emerald-600 dark:bg-emerald-500';
    };

    return (
        <div className="flex flex-wrap gap-1.5 p-2">
            {days.map(day => {
                const dateString = formatDate(day);
                const count = data[dateString] || 0;
                return (
                    <div
                        key={dateString}
                        className={`h-4 w-4 rounded-sm ${getColor(count)}`}
                        title={`${count} problem${count !== 1 ? 's' : ''} solved on ${dateString}`}
                    />
                );
            })}
        </div>
    );
};

// Calendar Component for Progress Tracking
const Calendar = ({ data, darkMode }) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getColor = (count) => {
        if (count === 0) return 'bg-slate-100 dark:bg-slate-800';
        if (count < 2) return 'bg-emerald-100 dark:bg-emerald-900/50';
        if (count < 4) return 'bg-emerald-200 dark:bg-emerald-800/70';
        if (count < 6) return 'bg-emerald-300 dark:bg-emerald-700';
        return 'bg-emerald-500 dark:bg-emerald-600';
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    return (
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                    {monthNames[currentMonth]} {currentYear}
                </h3>
                <CalendarIcon className="h-5 w-5 text-slate-500" />
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className={`text-xs font-medium text-center p-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                    if (day === null) {
                        return <div key={index} className="h-8 w-8" />;
                    }

                    const date = new Date(currentYear, currentMonth, day);
                    const dateString = formatDate(date);
                    const count = data[dateString] || 0;
                    const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

                    return (
                        <div
                            key={index}
                            className={`h-8 w-8 rounded-md flex items-center justify-center text-xs font-medium transition-all duration-200 ${getColor(count)} ${isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                                } ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}
                            title={`${count} problem${count !== 1 ? 's' : ''} solved on ${dateString}`}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-center mt-4 space-x-4">
                <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                    <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>0</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-sm bg-emerald-100 dark:bg-emerald-900/50"></div>
                    <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>1-2</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-sm bg-emerald-300 dark:bg-emerald-700"></div>
                    <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>3-5</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-sm bg-emerald-500 dark:bg-emerald-600"></div>
                    <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>6+</span>
                </div>
            </div>
        </div>
    );
};

// Performance Analytics Component
const PerformanceAnalytics = ({ problems, darkMode }) => {
    const analytics = React.useMemo(() => {
        const totalProblems = problems.length;
        const completedProblems = problems.filter(p => p.status === 'Completed').length;
        const inProgressProblems = problems.filter(p => p.status === 'In Progress').length;
        const notStartedProblems = problems.filter(p => p.status === 'Not Started').length;

        // Topic analysis
        const topicStats = {};
        problems.forEach(problem => {
            if (problem.topic) {
                topicStats[problem.topic] = (topicStats[problem.topic] || 0) + 1;
            }
        });

        // Difficulty analysis
        const difficultyStats = {};
        problems.forEach(problem => {
            if (problem.difficulty) {
                difficultyStats[problem.difficulty] = (difficultyStats[problem.difficulty] || 0) + 1;
            }
        });

        // Company analysis
        const companyStats = {};
        problems.forEach(problem => {
            if (problem.companies && problem.companies.length > 0) {
                problem.companies.forEach(company => {
                    companyStats[company] = (companyStats[company] || 0) + 1;
                });
            }
        });

        // Completion rate by topic
        const topicCompletion = {};
        problems.forEach(problem => {
            if (problem.topic) {
                if (!topicCompletion[problem.topic]) {
                    topicCompletion[problem.topic] = { total: 0, completed: 0 };
                }
                topicCompletion[problem.topic].total += 1;
                if (problem.status === 'Completed') {
                    topicCompletion[problem.topic].completed += 1;
                }
            }
        });

        // Weekly progress (last 8 weeks)
        const weeklyProgress = [];
        for (let i = 7; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - (i * 7));
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            const weekProblems = problems.filter(p => {
                if (p.status === 'Completed') {
                    // This is a simplified approach - in a real app you'd track completion dates
                    return Math.random() > 0.7; // Simulate some weekly completion
                }
                return false;
            }).length;

            weeklyProgress.push({
                week: `Week ${8 - i}`,
                problems: weekProblems
            });
        }

        return {
            totalProblems,
            completedProblems,
            inProgressProblems,
            notStartedProblems,
            completionRate: totalProblems > 0 ? (completedProblems / totalProblems * 100).toFixed(1) : 0,
            topicStats: Object.entries(topicStats).map(([topic, count]) => ({ topic, count })),
            difficultyStats: Object.entries(difficultyStats).map(([difficulty, count]) => ({ difficulty, count })),
            companyStats: Object.entries(companyStats)
                .sort(([, a], [, b]) => (a as number) - (b as number))
                .slice(0, 10)
                .map(([company, count]) => ({ company, count })),
            topicCompletion: Object.entries(topicCompletion).map(([topic, stats]) => ({
                topic,
                completed: (stats as any).completed,
                total: (stats as any).total,
                rate: (stats as any).total > 0 ? ((stats as any).completed / (stats as any).total * 100).toFixed(1) : 0
            })),
            weeklyProgress
        };
    }, [problems]);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center mb-8">
                <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                    Performance Overview
                </h2>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Comprehensive analysis of your problem-solving progress and performance metrics
                </p>
            </div>

            {/* Key Metrics Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl p-6 border border-blue-100 dark:border-slate-600/50">
                <h3 className={`text-lg font-semibold mb-6 flex items-center ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    <BarChart2 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Key Performance Indicators
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-3">
                            <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className={`text-3xl font-bold mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                            {analytics.totalProblems}
                        </p>
                        <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Total Problems
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full mb-3">
                            <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className={`text-3xl font-bold mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                            {analytics.completedProblems}
                        </p>
                        <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Completed
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/50 rounded-full mb-3">
                            <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                        </div>
                        <p className={`text-3xl font-bold mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                            {analytics.inProgressProblems}
                        </p>
                        <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            In Progress
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full mb-3">
                            <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <p className={`text-3xl font-bold mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                            {analytics.completionRate}%
                        </p>
                        <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Success Rate
                        </p>
                    </div>
                </div>
            </div>

            {/* Professional Charts: Completed by Topic and Difficulty */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Completed Problems by Topic (only topics with completed > 0) */}
                <div className={`p-6 rounded-xl border shadow-sm ${darkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className={`text-lg font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                            Completed by Topic
                        </h4>
                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    </div>
                    {(() => {
                        const topicCompleted = analytics.topicCompletion
                            .filter(t => (t as any).completed > 0)
                            .map(t => ({ name: (t as any).topic, value: (t as any).completed }));
                        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];
                        return (
                            <div style={{ height: 300 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={topicCompleted} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                                            {topicCompleted.map((entry, index) => (
                                                <Cell key={`topic-cell-${index}`} fill={colors[index % colors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                                                border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        );
                    })()}
                </div>

                {/* Completed Problems by Difficulty */}
                <div className={`p-6 rounded-xl border shadow-sm ${darkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className={`text-lg font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                            Completed by Difficulty
                        </h4>
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    </div>
                    {(() => {
                        const completed = problems.filter(p => p.status === 'Completed');
                        const diffCounts = {
                            Easy: completed.filter(p => p.difficulty === 'Easy').length,
                            Medium: completed.filter(p => p.difficulty === 'Medium').length,
                            Hard: completed.filter(p => p.difficulty === 'Hard').length
                        };
                        const diffData = [
                            { name: 'Easy', value: diffCounts.Easy },
                            { name: 'Medium', value: diffCounts.Medium },
                            { name: 'Hard', value: diffCounts.Hard }
                        ].filter(d => d.value > 0);
                        const colors = ['#10b981', '#f59e0b', '#ef4444'];
                        return (
                            <div style={{ height: 300 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={diffData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                                            {diffData.map((entry, index) => (
                                                <Cell key={`diff-cell-${index}`} fill={colors[index % colors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                                                border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Topic Mastery Progress removed as requested */}
        </div>
    );
};

// Enhanced Dashboard with Calendar and Analytics
const Dashboard = ({ progressData, activityData, problems, darkMode }) => (
    <div className="p-4 md:p-6 space-y-6">
        <h2 className={`text-3xl font-bold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>Your Dashboard</h2>

        {/* Progress Overview and Calendar Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-1 p-6 rounded-xl border backdrop-blur-lg ${darkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-slate-200'}`}>
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>Progress Overview</h3>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={progressData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                {progressData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={`lg:col-span-2 p-6 rounded-xl border backdrop-blur-lg ${darkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-slate-200'}`}>
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>Monthly Calendar</h3>
                <Calendar data={activityData} darkMode={darkMode} />
            </div>
        </div>

        {/* Activity Heatmap */}
        <div className={`p-6 rounded-xl border backdrop-blur-lg ${darkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-slate-200'}`}>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>Activity Heatmap (Last 6 Months)</h3>
            <ActivityHeatmap data={activityData} />
        </div>

        {/* Performance Analytics */}
        <div className={`p-6 rounded-xl border backdrop-blur-lg ${darkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-slate-200'}`}>
            <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h3 className={`text-xl font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>Performance Analytics</h3>
            </div>
            <PerformanceAnalytics problems={problems} darkMode={darkMode} />
        </div>
    </div>
);

const AutoDetectCompaniesForm = ({ darkMode }) => {
    const [message, setMessage] = React.useState<{ type: string; text: string } | null>(null);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [progress, setProgress] = React.useState({ processed: 0, total: 0 });

    const handleAutoDetectCompanies = async () => {
        setIsProcessing(true);
        setProgress({ processed: 0, total: 0 });

        try {
            // Get all questions from Firestore
            const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
            const querySnapshot = await getCountFromServer(q);
            const totalQuestions = querySnapshot.data().count;
            setProgress(prev => ({ ...prev, total: totalQuestions }));

            // Process questions in batches
            const unsubscribe = onSnapshot(q, async (snapshot) => {
                const batch = writeBatch(db);
                let processedCount = 0;
                let updatedCount = 0;

                snapshot.forEach((docSnapshot) => {
                    const data = docSnapshot.data();
                    const detectedCompanies = extractCompanyFromUrl(data.url);

                    if (detectedCompanies.length > 0) {
                        const existingCompanies = data.companies || [];
                        const mergedCompanies = [...new Set([...existingCompanies, ...detectedCompanies])];

                        if (mergedCompanies.length !== existingCompanies.length) {
                            batch.update(doc(db, 'questions', docSnapshot.id), {
                                companies: mergedCompanies
                            });
                            updatedCount++;
                        }
                    }

                    processedCount++;
                    setProgress(prev => ({ ...prev, processed: processedCount }));
                });

                if (updatedCount > 0) {
                    await batch.commit();
                    setMessage({
                        type: 'success',
                        text: `Successfully updated ${updatedCount} out of ${processedCount} questions with auto-detected companies.`
                    });
                } else {
                    setMessage({
                        type: 'info',
                        text: `Processed ${processedCount} questions. No new companies detected.`
                    });
                }

                setIsProcessing(false);
                unsubscribe();
            });

        } catch (error) {
            console.error("Error during auto-detection: ", error);
            setMessage({ type: 'error', text: 'An error occurred during auto-detection.' });
            setIsProcessing(false);
        } finally {
            setTimeout(() => setMessage(null), 10000);
        }
    };

    return (
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-slate-200'}`}>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>Auto-Detect Companies from URLs</h3>
            <div className="space-y-4">
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    This feature will automatically detect and assign company names to existing problems based on their URLs.
                    It analyzes patterns like "leetcode.com/company/google" to identify relevant companies.
                </p>

                {isProcessing && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Processing...</span>
                            <span>{progress.processed} / {progress.total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: progress.total > 0 ? `${(progress.processed / progress.total) * 100}%` : '0%' }}
                            ></div>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleAutoDetectCompanies}
                    disabled={isProcessing}
                    className={`px-4 py-2 rounded-lg flex items-center ${isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                >
                    <Briefcase size={18} className="mr-2" />
                    {isProcessing ? 'Processing...' : 'Auto-Detect Companies'}
                </button>
                {message && (
                    <p className={`text-sm mt-4 ${message.type === 'success' ? 'text-green-500' :
                        message.type === 'info' ? 'text-blue-500' : 'text-red-500'
                        }`}>
                        {message.text}
                    </p>
                )}
            </div>
        </div>
    );
};

const AdminDashboard = ({ darkMode }) => {
    const [activeTab, setActiveTab] = React.useState('addQuestion');

    return (
        <div className="p-4 md:p-6">
            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>Admin Dashboard</h2>
            <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
                <button onClick={() => setActiveTab('addQuestion')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'addQuestion' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-slate-500'}`}>Add Question</button>
                <button onClick={() => setActiveTab('bulkUpload')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'bulkUpload' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-slate-500'}`}>Bulk Upload</button>
                <button onClick={() => setActiveTab('manageUsers')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'manageUsers' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-slate-500'}`}>Manage Users</button>
                <button onClick={() => setActiveTab('autoDetect')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'autoDetect' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-slate-500'}`}>Auto-Detect Companies</button>
            </div>
            <div>
                {activeTab === 'addQuestion' && <AddQuestionForm darkMode={darkMode} />}
                {activeTab === 'bulkUpload' && <BulkUploadForm darkMode={darkMode} />}
                {activeTab === 'manageUsers' && <UserManagementForm darkMode={darkMode} />}
                {activeTab === 'autoDetect' && <AutoDetectCompaniesForm darkMode={darkMode} />}
            </div>
        </div>
    );
};

const AddQuestionForm = ({ darkMode }) => {
    const [newProblem, setNewProblem] = React.useState({ name: '', url: '', topic: topics[0], difficulty: difficulties[0], companies: [] });
    const [message, setMessage] = React.useState<{ type: string; text: string } | null>(null);
    const [customCompanies, setCustomCompanies] = React.useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProblem(prev => ({ ...prev, [name]: value }));

        // Auto-detect companies from URL
        if (name === 'url' && value) {
            const detectedCompanies = extractCompanyFromUrl(value);
            if (detectedCompanies.length > 0) {
                setNewProblem(prev => ({
                    ...prev,
                    [name]: value,
                    companies: [...new Set([...prev.companies, ...detectedCompanies])]
                }));
            }
        }
    };

    const handleCompanyChange = (company) => {
        setNewProblem(prev => ({
            ...prev,
            companies: prev.companies.includes(company)
                ? prev.companies.filter(c => c !== company)
                : [...prev.companies, company]
        }));

        // Add to custom companies if not in predefined list
        if (!companies.includes(company) && !customCompanies.includes(company)) {
            setCustomCompanies(prev => [...prev, company]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newProblem.name || !newProblem.url) {
            setMessage({ type: 'error', text: 'Please fill in all fields.' });
            return;
        }
        try {
            await addDoc(collection(db, 'questions'), { ...newProblem, createdAt: serverTimestamp() });
            setMessage({ type: 'success', text: 'Success! Question added.' });
            setNewProblem({ name: '', url: '', topic: topics[0], difficulty: difficulties[0], companies: [] });
        } catch (error) {
            setMessage({ type: 'error', text: 'Error: Could not add question.' });
        } finally {
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-slate-200'}`}>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>Add Single Question</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form fields */}
                <input name="name" value={newProblem.name} onChange={handleInputChange} placeholder="Problem Name" className="w-full p-2 rounded bg-slate-200 dark:bg-slate-700" />
                <input name="url" value={newProblem.url} onChange={handleInputChange} placeholder="Problem URL" className="w-full p-2 rounded bg-slate-200 dark:bg-slate-700" />
                <select name="topic" value={newProblem.topic} onChange={handleInputChange} className="w-full p-2 rounded bg-slate-200 dark:bg-slate-700">{topics.map(t => <option key={t} value={t}>{t}</option>)}</select>
                <select name="difficulty" value={newProblem.difficulty} onChange={handleInputChange} className="w-full p-2 rounded bg-slate-200 dark:bg-slate-700">{difficulties.map(d => <option key={d} value={d}>{d}</option>)}</select>
                {/* Searchable Company Dropdown */}
                <CompanyDropdown
                    selectedCompanies={newProblem.companies}
                    onCompanyChange={handleCompanyChange}
                    darkMode={darkMode}
                    customCompanies={customCompanies}
                />
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500 flex items-center"><PlusCircle size={18} className="mr-2" /> Add Question</button>
                {message && <p className={`text-sm mt-4 ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{message.text}</p>}
            </form>
        </div>
    );
};

const BulkUploadForm = ({ darkMode }) => {
    const [file, setFile] = React.useState(null);
    const [message, setMessage] = React.useState<{ type: string; text: string } | null>(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage({ type: 'error', text: 'Please select a CSV file to upload.' });
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const csv = event.target.result as string;
                const lines = csv.split('\n').filter(line => line.trim());
                const headers = lines[0].split(',').map(h => h.trim());
                const requiredHeaders = ['name', 'url', 'topic', 'difficulty', 'companies'];

                if (!requiredHeaders.every(h => headers.includes(h))) {
                    setMessage({ type: 'error', text: 'CSV headers must be: name, url, topic, difficulty, companies' });
                    return;
                }

                const batch = writeBatch(db);
                const questionsCollection = collection(db, 'questions');

                lines.slice(1).forEach(line => {
                    const values = line.split(',');
                    const url = values[headers.indexOf('url')].trim();
                    const csvCompanies = values[headers.indexOf('companies')].trim().split(';').filter(c => c);
                    const detectedCompanies = extractCompanyFromUrl(url);
                    const allCompanies = [...new Set([...csvCompanies, ...detectedCompanies])];

                    const problemData = {
                        name: values[headers.indexOf('name')].trim(),
                        url: url,
                        topic: values[headers.indexOf('topic')].trim(),
                        difficulty: values[headers.indexOf('difficulty')].trim(),
                        companies: allCompanies,
                        createdAt: serverTimestamp(),
                    };
                    const newDocRef = doc(questionsCollection);
                    batch.set(newDocRef, problemData);
                });

                await batch.commit();
                setMessage({ type: 'success', text: `Successfully uploaded ${lines.length - 1} questions.` });
            } catch (error) {
                console.error("Error during bulk upload: ", error);
                setMessage({ type: 'error', text: 'An error occurred during upload.' });
            } finally {
                setTimeout(() => setMessage(null), 5000);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-slate-200'}`}>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>Bulk Upload Questions</h3>
            <div className="space-y-4">
                <input type="file" accept=".csv" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                <button onClick={handleUpload} className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500 flex items-center"><Upload size={18} className="mr-2" /> Upload CSV</button>
                {message && <p className={`text-sm mt-4 ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{message.text}</p>}
            </div>
        </div>
    );
};

const UserManagementForm = ({ darkMode }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [message, setMessage] = React.useState<{ type: string; text: string } | null>(null);

    // NOTE: Listing and deleting users requires the Firebase Admin SDK, which cannot be run securely on the client.
    // This component only includes the "Create User" functionality.

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setMessage({ type: 'error', text: 'Please provide email and password.' });
            return;
        }
        try {
            const createUser = httpsCallable(functions, 'createUser');
            const result = await createUser({ email, password });
            setMessage({ type: 'success', text: (result.data as any).result });
            setEmail('');
            setPassword('');
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setTimeout(() => setMessage(null), 5000);
        }
    };

    return (
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/50 border-slate-200'}`}>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>Create New User</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="New User Email" className="w-full p-2 rounded bg-slate-200 dark:bg-slate-700" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Temporary Password" className="w-full p-2 rounded bg-slate-200 dark:bg-slate-700" />
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500 flex items-center"><UserPlus size={18} className="mr-2" /> Create User</button>
                {message && <p className={`text-sm mt-4 ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{message.text}</p>}
            </form>
            <div className="mt-6 p-4 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm">
                <strong>Note:</strong> User listing, updating, and deleting requires a secure backend with the Firebase Admin SDK and is not available in this client-side view.
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function App() {
    const [problems, setProblems] = React.useState([]);
    const [filteredProblems, setFilteredProblems] = React.useState([]);
    const [activeFilters, setActiveFilters] = React.useState({ topic: 'All', difficulty: 'All', company: 'All', status: 'All', search: '' });
    const [darkMode, setDarkMode] = React.useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [activityData, setActivityData] = React.useState({});
    const [showLoginModal, setShowLoginModal] = React.useState(false);
    const [isAdminView, setIsAdminView] = React.useState(false);

    React.useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe; // Cleanup subscription on unmount
    }, []);

    React.useEffect(() => {
        if (currentUser) {
            const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const questionsFromDb = [];
                querySnapshot.forEach((doc) => {
                    questionsFromDb.push({ id: doc.id, ...doc.data(), status: 'Not Started' });
                });
                setProblems(questionsFromDb);
            }, (error) => {
                console.error("Firestore snapshot error:", error);
            });
            return () => unsubscribe();
        }
    }, [currentUser]);

    const progressData = React.useMemo(() => {
        const completed = problems.filter(p => p.status === 'Completed').length;
        const pending = problems.length - completed;
        return [{ name: 'Completed', value: completed, color: '#10b981' }, { name: 'Pending', value: pending, color: '#64748b' }];
    }, [problems]);

    React.useEffect(() => {
        let result = problems;
        if (activeFilters.topic !== 'All') result = result.filter(p => p.topic === activeFilters.topic);
        if (activeFilters.difficulty !== 'All') result = result.filter(p => p.difficulty === activeFilters.difficulty);
        if (activeFilters.company !== 'All' && activeFilters.company) result = result.filter(p => p.companies && p.companies.includes(activeFilters.company));
        if (activeFilters.status !== 'All') result = result.filter(p => p.status === activeFilters.status);
        if (activeFilters.search) result = result.filter(p => p.name.toLowerCase().includes(activeFilters.search.toLowerCase()));
        setFilteredProblems(result);
    }, [activeFilters, problems]);

    const handleFilterChange = (filterType, value) => setActiveFilters(prev => ({ ...prev, [filterType]: value }));

    const handleStatusChange = (problemId, newStatus) => {
        const oldStatus = problems.find(p => p.id === problemId)?.status;

        setProblems(currentProblems =>
            currentProblems.map(p =>
                p.id === problemId ? { ...p, status: newStatus } : p
            )
        );

        if (newStatus === 'Completed' && oldStatus !== 'Completed') {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;

            setActivityData(prev => ({
                ...prev,
                [dateString]: (prev[dateString] || 0) + 1,
            }));
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">Loading...</div>;
    }

    if (!currentUser) {
        return (
            <>
                <HomePage
                    toggleTheme={() => setDarkMode(!darkMode)}
                    darkMode={darkMode}
                    onGetStarted={() => setShowLoginModal(true)}
                />
                {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
            </>
        );
    }

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-slate-900 text-slate-200' : 'bg-slate-100 text-slate-800'}`}>
            <Header user={currentUser} toggleTheme={() => setDarkMode(!darkMode)} darkMode={darkMode} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} onAdminClick={() => setIsAdminView(!isAdminView)} isAdminView={isAdminView} />
            <div className="container mx-auto flex">
                {isAdminView && currentUser.uid === ADMIN_UID ? null : <Sidebar activeFilters={activeFilters} handleFilterChange={handleFilterChange} isOpen={isSidebarOpen} darkMode={darkMode} />}
                <main className="flex-1">
                    {isAdminView && currentUser.uid === ADMIN_UID ? (
                        <AdminDashboard darkMode={darkMode} />
                    ) : (
                        <>
                            <Dashboard progressData={progressData} activityData={activityData} problems={problems} darkMode={darkMode} />
                            <div className="mt-8 px-4 md:px-6">
                                <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>DSA Problem Sheet</h2>
                                <ProblemTable problems={filteredProblems} onStatusChange={handleStatusChange} darkMode={darkMode} />
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}