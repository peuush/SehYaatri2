import { useState } from "react";

interface FeedbackFormProps {
	language: "en" | "hi";
	onClose: () => void;
}

interface FeedbackData {
	// Website feedback
	websiteRating: number;
	websiteEaseOfUse: number;
	websiteDesign: number;
	websiteContent: number;
	websiteNavigation: number;
	websiteIssues: string[];
	websiteComments: string;
	
	// AI Chatbot feedback
	aiRating: number;
	aiAccuracy: number;
	aiResponseTime: number;
	aiHelpfulness: number;
	aiLanguageSupport: number;
	aiIssues: string[];
	aiComments: string;
	
	// General feedback
	overallExperience: number;
	recommendation: number;
	additionalComments: string;
	contactEmail: string;
}

const initialFeedbackData: FeedbackData = {
	websiteRating: 0,
	websiteEaseOfUse: 0,
	websiteDesign: 0,
	websiteContent: 0,
	websiteNavigation: 0,
	websiteIssues: [],
	websiteComments: "",
	
	aiRating: 0,
	aiAccuracy: 0,
	aiResponseTime: 0,
	aiHelpfulness: 0,
	aiLanguageSupport: 0,
	aiIssues: [],
	aiComments: "",
	
	overallExperience: 0,
	recommendation: 0,
	additionalComments: "",
	contactEmail: "",
};

export default function FeedbackForm({ language, onClose }: FeedbackFormProps) {
	const [currentStep, setCurrentStep] = useState(1);
	const [feedbackData, setFeedbackData] = useState<FeedbackData>(initialFeedbackData);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const totalSteps = 4;

	const translations = {
		en: {
			title: "Share Your Feedback",
			subtitle: "Help us improve SehYaatri by sharing your experience",
			websiteSection: "Website Experience",
			aiSection: "AI Chatbot Experience", 
			generalSection: "Overall Experience",
			contactSection: "Contact Information",
			rating: "Rating",
			easeOfUse: "Ease of Use",
			design: "Design & Visual Appeal",
			content: "Content Quality",
			navigation: "Navigation",
			accuracy: "Response Accuracy",
			responseTime: "Response Time",
			helpfulness: "Helpfulness",
			languageSupport: "Language Support",
			overallExperience: "Overall Experience",
			recommendation: "Would you recommend us?",
			issues: "Issues Encountered",
			comments: "Additional Comments",
			email: "Email (Optional)",
			emailPlaceholder: "your.email@example.com",
			next: "Next",
			previous: "Previous",
			submit: "Submit Feedback",
			submitting: "Submitting...",
			thankYou: "Thank You!",
			thankYouMessage: "Your feedback has been submitted successfully. We appreciate your time and will use your input to improve SehYaatri.",
			close: "Close",
			step: "Step",
			of: "of",
			required: "Required",
			optional: "Optional",
			websiteIssues: [
				"Slow loading times",
				"Difficult navigation",
				"Poor mobile experience",
				"Missing information",
				"Broken links",
				"Other"
			],
			aiIssues: [
				"Inaccurate responses",
				"Slow responses",
				"Language issues",
				"Limited knowledge",
				"Technical errors",
				"Other"
			]
		},
		hi: {
			title: "अपनी प्रतिक्रिया साझा करें",
			subtitle: "अपने अनुभव को साझा करके SehYaatri को बेहतर बनाने में हमारी मदद करें",
			websiteSection: "वेबसाइट अनुभव",
			aiSection: "AI चैटबॉट अनुभव",
			generalSection: "समग्र अनुभव",
			contactSection: "संपर्क जानकारी",
			rating: "रेटिंग",
			easeOfUse: "उपयोग में आसानी",
			design: "डिज़ाइन और दृश्य अपील",
			content: "सामग्री की गुणवत्ता",
			navigation: "नेविगेशन",
			accuracy: "प्रतिक्रिया की सटीकता",
			responseTime: "प्रतिक्रिया समय",
			helpfulness: "उपयोगिता",
			languageSupport: "भाषा सहायता",
			overallExperience: "समग्र अनुभव",
			recommendation: "क्या आप हमारी सिफारिश करेंगे?",
			issues: "सामना किए गए मुद्दे",
			comments: "अतिरिक्त टिप्पणियां",
			email: "ईमेल (वैकल्पिक)",
			emailPlaceholder: "आपका.ईमेल@उदाहरण.com",
			next: "अगला",
			previous: "पिछला",
			submit: "प्रतिक्रिया भेजें",
			submitting: "भेजा जा रहा है...",
			thankYou: "धन्यवाद!",
			thankYouMessage: "आपकी प्रतिक्रिया सफलतापूर्वक भेज दी गई है। हम आपके समय की सराहना करते हैं और SehYaatri को बेहतर बनाने के लिए आपके इनपुट का उपयोग करेंगे।",
			close: "बंद करें",
			step: "चरण",
			of: "का",
			required: "आवश्यक",
			optional: "वैकल्पिक",
			websiteIssues: [
				"धीमी लोडिंग गति",
				"कठिन नेविगेशन",
				"खराब मोबाइल अनुभव",
				"गुम जानकारी",
				"टूटे हुए लिंक",
				"अन्य"
			],
			aiIssues: [
				"गलत प्रतिक्रियाएं",
				"धीमी प्रतिक्रियाएं",
				"भाषा की समस्याएं",
				"सीमित ज्ञान",
				"तकनीकी त्रुटियां",
				"अन्य"
			]
		}
	};

	const t = translations[language];

	const handleRatingChange = (field: keyof FeedbackData, value: number) => {
		setFeedbackData(prev => ({ ...prev, [field]: value }));
	};

	const handleIssueToggle = (field: 'websiteIssues' | 'aiIssues', issue: string) => {
		setFeedbackData(prev => ({
			...prev,
			[field]: prev[field].includes(issue)
				? prev[field].filter(i => i !== issue)
				: [...prev[field], issue]
		}));
	};

	const handleTextChange = (field: keyof FeedbackData, value: string) => {
		setFeedbackData(prev => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 2000));
		setIsSubmitting(false);
		setIsSubmitted(true);
	};

	const renderStarRating = (value: number, onChange: (value: number) => void, label: string) => (
		<div className="space-y-2">
			<label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
			<div className="flex gap-1">
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						type="button"
						onClick={() => onChange(star)}
						className={`text-2xl transition-colors ${
							star <= value ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'
						} hover:text-yellow-400`}
					>
						★
					</button>
				))}
			</div>
		</div>
	);

	const renderIssueCheckboxes = (issues: string[], selectedIssues: string[], onToggle: (issue: string) => void) => (
		<div className="space-y-2">
			<label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.issues}</label>
			<div className="grid grid-cols-2 gap-2">
				{issues.map((issue) => (
					<label key={issue} className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
						<input
							type="checkbox"
							checked={selectedIssues.includes(issue)}
							onChange={() => onToggle(issue)}
							className="rounded border-slate-300 dark:border-slate-600 text-brand-600 focus:ring-brand-500 bg-white dark:bg-slate-700"
						/>
						<span>{issue}</span>
					</label>
				))}
			</div>
		</div>
	);

	if (isSubmitted) {
		return (
			<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
				<div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center">
					<div className="text-6xl mb-4">🎉</div>
					<h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t.thankYou}</h3>
					<p className="text-slate-600 dark:text-slate-400 mb-6">{t.thankYouMessage}</p>
					<button
						onClick={onClose}
						className="w-full bg-brand-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-brand-700 transition-colors"
					>
						{t.close}
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
				{/* Header */}
				<div className="p-6 border-b border-slate-200 dark:border-slate-700">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.title}</h2>
							<p className="text-slate-600 dark:text-slate-400 mt-1">{t.subtitle}</p>
						</div>
						<button
							onClick={onClose}
							className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-2xl"
						>
							×
						</button>
					</div>
					<div className="mt-4 flex items-center gap-2">
						<div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
							<div
								className="bg-brand-600 h-2 rounded-full transition-all duration-300"
								style={{ width: `${(currentStep / totalSteps) * 100}%` }}
							/>
						</div>
						<span className="text-sm text-slate-500 dark:text-slate-400">
							{t.step} {currentStep} {t.of} {totalSteps}
						</span>
					</div>
				</div>

				{/* Content */}
				<div className="p-6 overflow-y-auto max-h-[60vh]">
					{currentStep === 1 && (
						<div className="space-y-6">
							<h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{t.websiteSection}</h3>
							
							{renderStarRating(
								feedbackData.websiteRating,
								(value) => handleRatingChange('websiteRating', value),
								`${t.rating} *`
							)}
							
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{renderStarRating(
									feedbackData.websiteEaseOfUse,
									(value) => handleRatingChange('websiteEaseOfUse', value),
									t.easeOfUse
								)}
								{renderStarRating(
									feedbackData.websiteDesign,
									(value) => handleRatingChange('websiteDesign', value),
									t.design
								)}
								{renderStarRating(
									feedbackData.websiteContent,
									(value) => handleRatingChange('websiteContent', value),
									t.content
								)}
								{renderStarRating(
									feedbackData.websiteNavigation,
									(value) => handleRatingChange('websiteNavigation', value),
									t.navigation
								)}
							</div>

							{renderIssueCheckboxes(
								t.websiteIssues,
								feedbackData.websiteIssues,
								(issue) => handleIssueToggle('websiteIssues', issue)
							)}

							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									{t.comments} ({t.optional})
								</label>
								<textarea
									value={feedbackData.websiteComments}
									onChange={(e) => handleTextChange('websiteComments', e.target.value)}
									placeholder={language === 'en' ? 'Tell us more about your website experience...' : 'अपने वेबसाइट अनुभव के बारे में और बताएं...'}
									className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
									rows={3}
								/>
							</div>
						</div>
					)}

					{currentStep === 2 && (
						<div className="space-y-6">
							<h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{t.aiSection}</h3>
							
							{renderStarRating(
								feedbackData.aiRating,
								(value) => handleRatingChange('aiRating', value),
								`${t.rating} *`
							)}
							
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{renderStarRating(
									feedbackData.aiAccuracy,
									(value) => handleRatingChange('aiAccuracy', value),
									t.accuracy
								)}
								{renderStarRating(
									feedbackData.aiResponseTime,
									(value) => handleRatingChange('aiResponseTime', value),
									t.responseTime
								)}
								{renderStarRating(
									feedbackData.aiHelpfulness,
									(value) => handleRatingChange('aiHelpfulness', value),
									t.helpfulness
								)}
								{renderStarRating(
									feedbackData.aiLanguageSupport,
									(value) => handleRatingChange('aiLanguageSupport', value),
									t.languageSupport
								)}
							</div>

							{renderIssueCheckboxes(
								t.aiIssues,
								feedbackData.aiIssues,
								(issue) => handleIssueToggle('aiIssues', issue)
							)}

							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									{t.comments} ({t.optional})
								</label>
								<textarea
									value={feedbackData.aiComments}
									onChange={(e) => handleTextChange('aiComments', e.target.value)}
									placeholder={language === 'en' ? 'Tell us more about your AI chatbot experience...' : 'अपने AI चैटबॉट अनुभव के बारे में और बताएं...'}
									className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
									rows={3}
								/>
							</div>
						</div>
					)}

					{currentStep === 3 && (
						<div className="space-y-6">
							<h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{t.generalSection}</h3>
							
							{renderStarRating(
								feedbackData.overallExperience,
								(value) => handleRatingChange('overallExperience', value),
								`${t.overallExperience} *`
							)}

							{renderStarRating(
								feedbackData.recommendation,
								(value) => handleRatingChange('recommendation', value),
								`${t.recommendation} *`
							)}

							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									{t.comments} ({t.optional})
								</label>
								<textarea
									value={feedbackData.additionalComments}
									onChange={(e) => handleTextChange('additionalComments', e.target.value)}
									placeholder={language === 'en' ? 'Any additional feedback or suggestions...' : 'कोई अतिरिक्त प्रतिक्रिया या सुझाव...'}
									className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
									rows={4}
								/>
							</div>
						</div>
					)}

					{currentStep === 4 && (
						<div className="space-y-6">
							<h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{t.contactSection}</h3>
							
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
									{t.email} ({t.optional})
								</label>
								<input
									type="email"
									value={feedbackData.contactEmail}
									onChange={(e) => handleTextChange('contactEmail', e.target.value)}
									placeholder={t.emailPlaceholder}
									className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
								/>
								<p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
									{language === 'en' 
										? 'We may contact you for follow-up questions about your feedback.'
										: 'हम आपकी प्रतिक्रिया के बारे में अनुवर्ती प्रश्नों के लिए आपसे संपर्क कर सकते हैं।'
									}
								</p>
							</div>

							<div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
								<h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
									{language === 'en' ? 'Feedback Summary' : 'प्रतिक्रिया सारांश'}
								</h4>
								<div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
									<p>{t.websiteSection}: ⭐ {feedbackData.websiteRating}/5</p>
									<p>{t.aiSection}: ⭐ {feedbackData.aiRating}/5</p>
									<p>{t.overallExperience}: ⭐ {feedbackData.overallExperience}/5</p>
									<p>{t.recommendation}: ⭐ {feedbackData.recommendation}/5</p>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-between">
					<button
						onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
						disabled={currentStep === 1}
						className="px-4 py-2 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-800"
					>
						{t.previous}
					</button>
					
					{currentStep < totalSteps ? (
						<button
							onClick={() => setCurrentStep(prev => Math.min(totalSteps, prev + 1))}
							className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
						>
							{t.next}
						</button>
					) : (
						<button
							onClick={handleSubmit}
							disabled={isSubmitting || feedbackData.websiteRating === 0 || feedbackData.aiRating === 0 || feedbackData.overallExperience === 0 || feedbackData.recommendation === 0}
							className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? t.submitting : t.submit}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
