import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnalysisResult } from '../types';
import ScoreBadge from './ScoreBadge';
import ComponentCard from './ComponentCard';

interface AnalysisResultProps {
  result: AnalysisResult;
}

const GlanceCard: React.FC<{ title: string; count: number; color: string; icon: React.ReactNode }> = ({ title, count, color, icon }) => {
    return (
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className={`p-3 rounded-full ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{count}</p>
            </div>
        </div>
    );
};

const Section: React.FC<{ title: string; count: number; children: React.ReactNode; color: string; defaultOpen?: boolean }> = ({ title, count, children, color, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mb-4 overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left rtl:text-right cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                aria-expanded={isOpen}
                aria-controls={`section-${title.replace(/\s+/g, '-')}`}
            >
                <div className="flex items-center">
                    <h2 className={`text-xl font-bold text-gray-800 dark:text-white`}>{title}</h2>
                    <span className={`mx-3 px-2.5 py-0.5 text-sm font-semibold text-white rounded-full ${color}`}>
                        {count}
                    </span>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div id={`section-${title.replace(/\s+/g, '-')}`} className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};


const AnalysisResultDisplay: React.FC<AnalysisResultProps> = ({ result }) => {
  const { t } = useTranslation();
  const { productName, overallScore, verdict, summary, negatives = [], positives = [], questionable = [], analysisConfidence } = result;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white">{productName}</h1>
        <p className="text-2xl font-bold text-emerald-500 mt-1">{verdict}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 flex justify-center items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <ScoreBadge score={overallScore} />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{t('results.atAGlance')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <GlanceCard title={t('results.glance.positives')} count={positives.length} color="bg-emerald-100 dark:bg-emerald-900/50" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 dark:text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 18.25V8.75a2 2 0 012-2h2.086a2 2 0 001.414-.586l2-2A2 2 0 0115.586 3z" /></svg>} />
                    <GlanceCard title={t('results.glance.negatives')} count={negatives.length} color="bg-red-100 dark:bg-red-900/50" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326.02.485.06L17 5.75v9.5a2 2 0 01-2 2h-2.086a2 2 0 00-1.414.586l-2 2A2 2 0 018.414 21z" /></svg>} />
                    <GlanceCard title={t('results.glance.questionable')} count={questionable.length} color="bg-yellow-100 dark:bg-yellow-900/50" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                </div>
            </div>
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{t('results.keyMetrics')}</h3>
                 {analysisConfidence && (
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">{t('results.productIdentification')}</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">{analysisConfidence.productIdentification}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">{t('results.ocrAccuracy')}</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">{analysisConfidence.ocrAccuracy}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">{t('results.dataSource')}</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">{analysisConfidence.dataSource}</span>
                        </div>
                    </div>
                 )}
            </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <p className="text-lg text-gray-600 dark:text-gray-300">{summary}</p>
      </div>


      {negatives.length > 0 && (
        <Section title={t('results.negative')} count={negatives.length} color="bg-red-500" defaultOpen={true}>
          {negatives.map((item, index) => <ComponentCard key={index} componentData={item} type="negative" />)}
        </Section>
      )}

      {questionable.length > 0 && (
        <Section title={t('results.questionable')} count={questionable.length} color="bg-yellow-500">
          {questionable.map((item, index) => <ComponentCard key={index} componentData={item} type="questionable" />)}
        </Section>
      )}

      {positives.length > 0 && (
        <Section title={t('results.positive')} count={positives.length} color="bg-emerald-500">
          {positives.map((item, index) => <ComponentCard key={index} componentData={item} type="positive" />)}
        </section>
      )}
    </div>
  );
};

export default AnalysisResultDisplay;