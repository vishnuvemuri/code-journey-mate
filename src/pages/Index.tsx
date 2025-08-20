import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { 
    Search, Sun, Moon, Menu, X, User, Lock, Mail, Code, ArrowRight, PlayCircle,
    LayoutDashboard, Trophy, Users, BookOpen, Database, Link2, Layers, TreePalm, BarChart2, Zap,
    Star, CheckCircle, Briefcase
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    signOut
} from 'firebase/auth';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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


// --- Mock Data ---
const dsaSheetData = [
    // --- Arrays ---
    { id: 'arr-1', topic: 'Arrays', difficulty: 'Easy', name: 'Find the Duplicate Number', url: 'https://leetcode.com/problems/find-the-duplicate-number/', companies: [], status: 'Not Started' },
    { id: 'arr-2', topic: 'Arrays', difficulty: 'Easy', name: 'Sort Colors', url: 'https://leetcode.com/problems/sort-colors/', companies: [], status: 'Not Started' },
    { id: 'arr-3', topic: 'Arrays', difficulty: 'Easy', name: 'Remove Duplicates from Sorted Array', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', companies: [], status: 'Not Started' },
    { id: 'arr-4', topic: 'Arrays', difficulty: 'Easy', name: 'Set Matrix Zeroes', url: 'https://leetcode.com/problems/set-matrix-zeroes/', companies: [], status: 'Not Started' },
    { id: 'arr-5', topic: 'Arrays', difficulty: 'Easy', name: 'Move Zeroes', url: 'https://leetcode.com/problems/move-zeroes/', companies: ['Microsoft'], status: 'Not Started' },
    { id: 'arr-6', topic: 'Arrays', difficulty: 'Easy', name: 'Best Time to Buy and Sell Stock', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', companies: ['Microsoft', 'Amazon'], status: 'Not Started' },
    { id: 'arr-7', topic: 'Arrays', difficulty: 'Easy', name: 'Chocolate Distribution Problem', url: 'https://www.geeksforgeeks.org/chocolate-distribution-problem/', companies: ['Microsoft', 'Amazon'], status: 'Not Started' },
    { id: 'arr-8', topic: 'Arrays', difficulty: 'Easy', name: 'Two Sum', url: 'https://leetcode.com/problems/two-sum/', companies: ['Amazon'], status: 'Not Started' },
    { id: 'arr-9', topic: 'Arrays', difficulty: 'Easy', name: 'Best Time to Buy and Sell Stock II', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/', companies: [], status: 'Not Started' },
    { id: 'arr-10', topic: 'Arrays', difficulty: 'Medium', name: 'Subarray Sums Divisible by K', url: 'https://leetcode.com/problems/subarray-sums-divisible-by-k/', companies: [], status: 'Not Started' },
    { id: 'arr-11', topic: 'Arrays', difficulty: 'Medium', name: 'Find All Duplicates in an Array', url: 'https://leetcode.com/problems/find-all-duplicates-in-an-array/', companies: ['Goldman Sachs'], status: 'Not Started' },
    { id: 'arr-12', topic: 'Arrays', difficulty: 'Medium', name: 'Container With Most Water', url: 'https://leetcode.com/problems/container-with-most-water/', companies: ['Goldman Sachs', 'Amazon'], status: 'Not Started' },
    { id: 'arr-13', topic: 'Arrays', difficulty: 'Medium', name: '3Sum', url: 'https://leetcode.com/problems/3sum/', companies: ['Goldman Sachs', 'Amazon'], status: 'Not Started' },
    { id: 'arr-14', topic: 'Arrays', difficulty: 'Medium', name: '4Sum', url: 'https://leetcode.com/problems/4sum/', companies: [], status: 'Not Started' },
    { id: 'arr-15', topic: 'Arrays', difficulty: 'Medium', name: 'Maximum Points You Can Obtain from Cards', url: 'https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/', companies: [], status: 'Not Started' },
    { id: 'arr-16', topic: 'Arrays', difficulty: 'Medium', name: 'Subarray Sum Equals K', url: 'https://leetcode.com/problems/subarray-sum-equals-k/', companies: [], status: 'Not Started' },
    { id: 'arr-17', topic: 'Arrays', difficulty: 'Medium', name: 'Spiral Matrix', url: 'https://leetcode.com/problems/spiral-matrix/', companies: [], status: 'Not Started' },
    { id: 'arr-18', topic: 'Arrays', difficulty: 'Medium', name: 'Word Search', url: 'https://leetcode.com/problems/word-search/', companies: ['Microsoft'], status: 'Not Started' },
    { id: 'arr-19', topic: 'Arrays', difficulty: 'Medium', name: 'Jump Game', url: 'https://leetcode.com/problems/jump-game/', companies: ['Amazon'], status: 'Not Started' },
    { id: 'arr-20', topic: 'Arrays', difficulty: 'Medium', name: 'Merge Sorted Array', url: 'https://leetcode.com/problems/merge-sorted-array/', companies: ['Intuit'], status: 'Not Started' },
    { id: 'arr-21', topic: 'Arrays', difficulty: 'Medium', name: 'Majority Element', url: 'https://leetcode.com/problems/majority-element/', companies: ['Intuit'], status: 'Not Started' },
    { id: 'arr-22', topic: 'Arrays', difficulty: 'Medium', name: 'Reverse Pairs', url: 'https://leetcode.com/problems/reverse-pairs/', companies: ['Intuit'], status: 'Not Started' },
    { id: 'arr-23', topic: 'Arrays', difficulty: 'Hard', name: 'Largest Rectangle in Histogram', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', companies: ['Microsoft'], status: 'Not Started' },
    { id: 'str-1', topic: 'Strings', difficulty: 'Easy', name: 'Valid Parentheses', url: 'https://leetcode.com/problems/valid-parentheses/', companies: [], status: 'Not Started' },
    { id: 'str-2', topic: 'Strings', difficulty: 'Easy', name: 'Print all duplicates in the input string', url: 'https://www.geeksforgeeks.org/print-all-the-duplicates-in-the-input-string/', companies: ['Amazon'], status: 'Not Started' },
    { id: 'str-3', topic: 'Strings', difficulty: 'Easy', name: 'Implement strStr()', url: 'https://leetcode.com/problems/implement-strstr/', companies: [], status: 'Not Started' },
    { id: 'str-4', topic: 'Strings', difficulty: 'Easy', name: 'Longest Common Prefix', url: 'https://leetcode.com/problems/longest-common-prefix/', companies: ['Intuit'], status: 'Not Started' },
    { id: 'str-5', topic: 'Strings', difficulty: 'Medium', name: 'Integer to Roman', url: 'https://leetcode.com/problems/integer-to-roman/', companies: ['Amazon'], status: 'Not Started' },
    { id: 'str-6', topic: 'Strings', difficulty: 'Medium', name: 'Generate Parentheses', url: 'https://leetcode.com/problems/generate-parentheses/', companies: ['Amazon'], status: 'Not Started' },
    { id: 'str-7', topic: 'Strings', difficulty: 'Medium', name: 'Simplify Path', url: 'https://leetcode.com/problems/simplify-path/', companies: ['Intuit', 'Amazon'], status: 'Not Started' },
    { id: 'str-8', topic: 'Strings', difficulty: 'Hard', name: 'Minimum Window Substring', url: 'https://leetcode.com/problems/minimum-window-substring/', companies: ['Goldman Sachs'], status: 'Not Started' },
    { id: 'dp-1', topic: 'Dynamic Programming', difficulty: 'Easy', name: 'Climbing Stairs', url: 'https://leetcode.com/problems/climbing-stairs', companies: [], status: 'Not Started' },
    { id: 'dp-2', topic: 'Dynamic Programming', difficulty: 'Easy', name: 'Maximum Product Subarray', url: 'https://leetcode.com/problems/maximum-product-subarray/', companies: [], status: 'Not Started' },
    { id: 'dp-3', topic: 'Dynamic Programming', difficulty: 'Medium', name: 'Coin Change', url: 'https://leetcode.com/problems/coin-change/', companies: [], status: 'Not Started' },
    { id: 'dp-4', topic: 'Dynamic Programming', difficulty: 'Medium', name: 'Longest Increasing Subsequence', url: 'https://leetcode.com/problems/longest-increasing-subsequence/', companies: ['Microsoft', 'Goldman Sachs'], status: 'Not Started' },
    { id: 'dp-5', topic: 'Dynamic Programming', difficulty: 'Hard', name: 'Trapping Rain Water', url: 'https://leetcode.com/problems/trapping-rain-water/', companies: ['Goldman Sachs'], status: 'Not Started' },
    { id: 'dp-6', topic: 'Dynamic Programming', difficulty: 'Hard', name: 'Burst Balloons', url: 'https://leetcode.com/problems/burst-balloons/', companies: [], status: 'Not Started' },
];

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

const topics = [...new Set(dsaSheetData.map(p => p.topic))];
const companies = ['Microsoft', 'Adobe', 'Goldman Sachs', 'Intuit', 'Amazon'];
const difficulties = ['Easy', 'Medium', 'Hard'];
const statuses = ['Not Started', 'In Progress', 'Completed'];

// --- Animation Hook ---
const useScrollAnimation = () => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    React.useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    const animationVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return { ref, controls, animationVariants };
};


// --- UI Components ---

const LoginModal = ({ toggleTheme, darkMode, onClose }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [isLoginView, setIsLoginView] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    const handleAuthAction = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            if (isLoginView) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
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
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                        <X size={24} />
                    </button>
                    <div className="text-center mb-8">
                         <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                            {isLoginView ? 'Welcome Back' : 'Create Your Account'}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">{isLoginView ? 'Login to continue your journey.' : 'Create an account to begin.'}</p>
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
                            {loading ? 'Processing...' : (isLoginView ? 'Login' : 'Sign Up')}
                        </button>
                    </form>
                     <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
                        {isLoginView ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-blue-500 hover:underline ml-1">
                            {isLoginView ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
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
                        <span className="text-xl font-bold">SkillyHeads</span>
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
                            <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>#SkillyHeads Movement</span>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
                                Master DSA & Land <br/> Your <span className="text-blue-500">Dream Job</span>
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
                        <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>#SkillyHeads</span>
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
                        <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>#SkillyHeads</span>
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
                    &copy; {new Date().getFullYear()} SkillyHeads. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
};

const Header = ({ user, toggleTheme, darkMode, toggleSidebar }) => {
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
                        SkillyHeads Hub
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
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
            {problem.companies.join(', ') || 'N/A'}
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

const Dashboard = ({ progressData, activityData, darkMode }) => (
    <div className="p-4 md:p-6 space-y-6">
        <h2 className={`text-3xl font-bold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>Your Dashboard</h2>
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
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>Activity Heatmap</h3>
                <ActivityHeatmap data={activityData} />
            </div>
        </div>
    </div>
);

// --- Main App Component ---
export default function App() {
    const [problems, setProblems] = React.useState(dsaSheetData);
    const [filteredProblems, setFilteredProblems] = React.useState(dsaSheetData);
    const [activeFilters, setActiveFilters] = React.useState({ topic: 'All', difficulty: 'All', company: 'All', status: 'All', search: '' });
    const [darkMode, setDarkMode] = React.useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [activityData, setActivityData] = React.useState({});
    const [showLoginModal, setShowLoginModal] = React.useState(false);

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

    const progressData = React.useMemo(() => {
        const completed = problems.filter(p => p.status === 'Completed').length;
        const pending = problems.length - completed;
        return [{ name: 'Completed', value: completed, color: '#10b981' }, { name: 'Pending', value: pending, color: '#64748b' }];
    }, [problems]);

    React.useEffect(() => {
        let result = problems;
        if (activeFilters.topic !== 'All') result = result.filter(p => p.topic === activeFilters.topic);
        if (activeFilters.difficulty !== 'All') result = result.filter(p => p.difficulty === activeFilters.difficulty);
        if (activeFilters.company !== 'All') result = result.filter(p => p.companies.includes(activeFilters.company));
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
                {showLoginModal && <LoginModal toggleTheme={() => setDarkMode(!darkMode)} darkMode={darkMode} onClose={() => setShowLoginModal(false)} />}
            </>
        );
    }

    return (
        <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-slate-900 text-slate-200' : 'bg-slate-100 text-slate-800'}`}>
            <Header user={currentUser} toggleTheme={() => setDarkMode(!darkMode)} darkMode={darkMode} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="container mx-auto flex">
                <Sidebar activeFilters={activeFilters} handleFilterChange={handleFilterChange} isOpen={isSidebarOpen} darkMode={darkMode} />
                <main className="flex-1 p-4 md:p-6">
                    <Dashboard progressData={progressData} activityData={activityData} darkMode={darkMode} />
                    <div className="mt-8">
                        <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>DSA Problem Sheet</h2>
                        <ProblemTable problems={filteredProblems} onStatusChange={handleStatusChange} darkMode={darkMode} />
                    </div>
                </main>
            </div>
        </div>
    );
}