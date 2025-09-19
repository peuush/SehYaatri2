import { useEffect, useMemo, useState } from "react";
import dataRaw from "./data.json";
import { z } from "zod";
import { askGemini, getGeminiKey, setGeminiKey } from "./ai";
import FeedbackForm from "./FeedbackForm";

// ✅ Zod schemas for validation
const DestinationSchema = z.object({
	id: z.number(),
	name: z.object({ en: z.string(), hi: z.string() }),
	region: z.object({ en: z.string(), hi: z.string() }),
	tags: z.array(z.string()),
	days: z.number(),
	lat: z.number(),
	lng: z.number(),
	short: z.object({ en: z.string(), hi: z.string() }),
});

const CultureSchema = z.object({
	id: z.string(),
	title: z.object({ en: z.string(), hi: z.string() }),
	desc: z.object({ en: z.string(), hi: z.string() }),
});

// ✅ Main schema for the JSON file
const DataSchema = z.object({
	destinations: z.array(DestinationSchema),
	culture: z.array(CultureSchema),
});

// ✅ Parse and validate at runtime
const parsed = DataSchema.parse(dataRaw);

type Destination = z.infer<typeof DestinationSchema>;
type Culture = z.infer<typeof CultureSchema>;

function App() {
	const [language, setLanguage] = useState<"en" | "hi">("en");
	const [chatInput, setChatInput] = useState("");
	const [chatHistory, setChatHistory] = useState<{ from: string; text: string }[]>([]);
	const [loading, setLoading] = useState(false);
	const [apiKey, setApiKey] = useState<string | null>(null);
	const [showKeyBox, setShowKeyBox] = useState(false);

	const [destinations, setDestinations] = useState<Destination[]>([]);
	const [culture, setCulture] = useState<Culture[]>([]);
	const [showFeedbackForm, setShowFeedbackForm] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const saved = localStorage.getItem('sehyaatri-theme');
		if (saved) {
			return saved === 'dark';
		}
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	});

	useEffect(() => {
		// load validated data
		setDestinations(parsed.destinations);
		setCulture(parsed.culture);
		setApiKey(getGeminiKey());
		
		// Apply initial theme
		const saved = localStorage.getItem('sehyaatri-theme');
		const shouldBeDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
		if (shouldBeDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, []);

	useEffect(() => {
		// Apply theme to document
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
		localStorage.setItem('sehyaatri-theme', isDarkMode ? 'dark' : 'light');
	}, [isDarkMode]);

	const filteredDestinations = useMemo(() => {
		const q = chatInput.trim().toLowerCase();
		if (!q) return destinations;
		return destinations.filter(
			(d) =>
				d.name.en.toLowerCase().includes(q) ||
				d.name.hi.toLowerCase().includes(q) ||
				d.region.en.toLowerCase().includes(q) ||
				d.region.hi.toLowerCase().includes(q) ||
				d.tags.some((t) => t.toLowerCase().includes(q))
		);
	}, [chatInput, destinations]);

	const handleChat = async () => {
		if (!chatInput.trim()) return;

		const userText = chatInput;
		setChatHistory((prev) => [...prev, { from: "user", text: userText }]);
		setChatInput("");

		let response: string | null = null;
		const query = userText.toLowerCase();

		// search in destinations
		const foundDest = destinations.find(
			(d) =>
				d.name.en.toLowerCase().includes(query) ||
				d.name.hi.toLowerCase().includes(query)
		);
		if (foundDest) {
			response = `${foundDest.name[language]} → ${foundDest.short[language]}`;
		}

		// search in culture
		if (!response) {
			const foundCulture = culture.find(
				(c) =>
					c.title.en.toLowerCase().includes(query) ||
					c.title.hi.toLowerCase().includes(query)
			);
			if (foundCulture) {
				response = `${foundCulture.title[language]} → ${foundCulture.desc[language]}`;
			}
		}

		// Fallback to Gemini with strict travel policy
		if (!response) {
			try {
				setLoading(true);
				const aiText = await askGemini(userText, language);
				response = aiText;
			} catch (err: unknown) {
				const msg = err instanceof Error ? err.message : "AI error";
				response = `AI unavailable: ${msg}`;
			} finally {
				setLoading(false);
			}
		}

		setChatHistory((prev) => [...prev, { from: "bot", text: response! }]);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
			{/* Header */}
			<header className="sticky top-0 z-30 backdrop-blur bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-700">
				<div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white font-bold">S</span>
						<h1 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">SehYaatri</h1>
					</div>
					<div className="flex items-center gap-3">
						<button
							onClick={() => setShowFeedbackForm(true)}
							className="inline-flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700"
						>
							💬 {language === "en" ? "Feedback" : "प्रतिक्रिया"}
						</button>
						<button
							onClick={() => setIsDarkMode(!isDarkMode)}
							className="inline-flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700"
						>
							{isDarkMode ? "☀️" : "🌙"} {language === "en" ? (isDarkMode ? "Light" : "Dark") : (isDarkMode ? "हल्का" : "गहरा")}
						</button>
						<button
							onClick={() => setLanguage(language === "en" ? "hi" : "en")}
							className="inline-flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700"
						>
							{language === "en" ? "हिन्दी" : "English"}
						</button>
						<button
							onClick={() => setShowKeyBox((s) => !s)}
							className="inline-flex items-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700"
						>
							{apiKey ? (language === "en" ? "AI: Connected" : "एआई: कनेक्टेड") : (language === "en" ? "Add API key" : "API कुंजी जोड़ें")}
						</button>
					</div>
				</div>
			</header>

			{/* API key box */}
			{showKeyBox && (
				<div className="mx-auto max-w-6xl px-4 pt-4">
					<div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 flex items-center gap-2">
						<input
							type="password"
							defaultValue={apiKey ?? ""}
							placeholder="Enter Gemini API key"
							className="flex-1 px-3 py-2 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									const value = (e.target as HTMLInputElement).value;
									setGeminiKey(value);
									setApiKey(value);
									setShowKeyBox(false);
								}
							}}
						/>
						<button
							onClick={() => {
								const el = document.querySelector<HTMLInputElement>("input[type=password]");
								const value = el?.value ?? "";
								setGeminiKey(value);
								setApiKey(value);
								setShowKeyBox(false);
							}}
							className="rounded bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
						>
							Save
						</button>
					</div>
				</div>
			)}

			{/* Hero */}
			<section className="bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
				<div className="bg-black/45">
					<div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
						<h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight max-w-3xl">
							{language === "en"
								? "Discover Jharkhand's nature, heritage and hidden gems"
								: "झारखंड की प्रकृति, धरोहर और अनदेखे रत्नों को खोजें"}
						</h2>
						<p className="mt-3 text-white/90 max-w-2xl">
							{language === "en"
								? "Plan journeys, explore destinations and ask our assistant anything."
								: "यात्रा की योजना बनाएं, स्थलों को जानें और हमारे सहायक से कुछ भी पूछें।"}
						</p>
						<div className="mt-6 max-w-xl">
							<div className="flex overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow ring-1 ring-black/5 dark:ring-slate-700/50">
								<input
									type="text"
									value={chatInput}
									onChange={(e) => setChatInput(e.target.value)}
									placeholder={
										language === "en"
											? "Search destinations, regions, or tags..."
											: "स्थल, क्षेत्र या टैग खोजें..."
									}
									className="flex-1 px-3 py-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none bg-transparent"
									onKeyDown={(e) => e.key === "Enter" && handleChat()}
								/>
								<button
									onClick={handleChat}
									className="bg-brand-600 px-4 py-2 text-white font-medium hover:bg-brand-700"
									disabled={loading}
								>
									{loading ? (language === "en" ? "Thinking..." : "सोच रहा...") : language === "en" ? "Search" : "खोजें"}
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Destinations */}
			<section className="mx-auto max-w-6xl px-4 py-10">
				<div className="flex items-end justify-between gap-3">
					<h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
						{language === "en" ? "Top Destinations" : "प्रमुख स्थल"}
					</h3>
					<span className="text-sm text-slate-500 dark:text-slate-400">
						{language === "en" ? `${filteredDestinations.length} places` : `${filteredDestinations.length} स्थल`}
					</span>
				</div>
				<div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{filteredDestinations.map((d) => (
						<article key={d.id} className="group overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow hover:shadow-lg ring-1 ring-slate-200 dark:ring-slate-700">
							<div className="h-40 bg-gradient-to-tr from-brand-100 to-brand-200 dark:from-brand-900/30 dark:to-brand-800/30" />
							<div className="p-4">
								<h4 className="text-lg font-semibold tracking-tight group-hover:text-brand-700 dark:group-hover:text-brand-400 text-slate-900 dark:text-slate-100">
									{d.name[language]}
								</h4>
								<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{d.short[language]}</p>
								<p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
									{language === "en" ? "Region" : "क्षेत्र"}: {d.region[language]} · {d.days} {language === "en" ? "days" : "दिन"}
								</p>
								<div className="mt-3 flex flex-wrap gap-2">
									{d.tags.map((t) => (
										<span key={t} className="rounded-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-400">
											#{t}
										</span>
									))}
								</div>
								<a
									href={`https://www.google.com/maps?q=${d.lat},${d.lng}`}
									target="_blank"
									rel="noreferrer"
									className="mt-4 inline-flex items-center text-sm font-medium text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300"
								>
									{language === "en" ? "View on Map" : "मानचित्र देखें"}
								</a>
							</div>
						</article>
					))}
				</div>
			</section>

			{/* Culture & History */}
			<section className="bg-slate-50/60 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-700">
				<div className="mx-auto max-w-6xl px-4 py-10">
					<h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
						{language === "en" ? "Culture & History" : "संस्कृति और इतिहास"}
					</h3>
					<div className="mt-6 grid gap-4 sm:grid-cols-2">
						{culture.map((c) => (
							<div key={c.id} className="rounded-2xl bg-white dark:bg-slate-800 p-5 shadow ring-1 ring-slate-200 dark:ring-slate-700">
								<h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{c.title[language]}</h4>
								<p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{c.desc[language]}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Chatbot */}
			<section id="chat" className="mx-auto max-w-6xl px-4 py-10">
				<h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
					{language === "en" ? "Travel Assistant" : "यात्रा सहायक"}
				</h3>
				<div className="mt-4 grid gap-6 lg:grid-cols-2">
					<div className="rounded-2xl bg-white dark:bg-slate-800 p-4 shadow ring-1 ring-slate-200 dark:ring-slate-700">
						<div className="h-72 flex flex-col">
							<div className="flex-1 overflow-y-auto space-y-2 pr-1">
								{chatHistory.map((msg, i) => (
									<div
										key={i}
										className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
											msg.from === "user"
												? "ml-auto bg-brand-600 text-white"
												: "mr-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
										}`}
									>
										{msg.text}
									</div>
								))}
							</div>
							<div className="mt-3 flex overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600">
								<input
									type="text"
									value={chatInput}
									onChange={(e) => setChatInput(e.target.value)}
									placeholder={
										language === "en"
											? "Ask about destinations or culture..."
											: "स्थल या संस्कृति के बारे में पूछें..."
									}
									className="flex-1 px-3 py-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none bg-white dark:bg-slate-700"
									onKeyDown={(e) => e.key === "Enter" && handleChat()}
								/>
								<button onClick={handleChat} className="bg-brand-600 px-4 py-2 text-white hover:bg-brand-700" disabled={loading}>
									{loading ? (language === "en" ? "Thinking..." : "सोच रहा...") : language === "en" ? "Send" : "भेजें"}
								</button>
							</div>
						</div>
					</div>
					<div className="rounded-2xl bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/20 dark:to-slate-800 p-6 ring-1 ring-slate-200 dark:ring-slate-700">
						<h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
							{language === "en" ? "Tips" : "सुझाव"}
						</h4>
						<ul className="mt-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
							<li>{language === "en" ? "Try: Ranchi, Netarhat, waterfall, trekking" : "जैसे पूछें: रांची, नेतरहाट, वॉटरफॉल, ट्रेकिंग"}</li>
							<li>{language === "en" ? "Switch language from the top-right." : "ऊपर दाईं ओर से भाषा बदलें।"}</li>
							<li>{language === "en" ? "Open destination in Google Maps." : "गूगल मैप्स में स्थल खोलें।"}</li>
						</ul>
					</div>
				</div>
			</section>

			<footer className="border-t border-slate-200 dark:border-slate-700 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
				© {new Date().getFullYear()} SehYaatri
			</footer>

			{/* Feedback Form Modal */}
			{showFeedbackForm && (
				<FeedbackForm
					language={language}
					onClose={() => setShowFeedbackForm(false)}
				/>
			)}
		</div>
	);
}

export default App;
