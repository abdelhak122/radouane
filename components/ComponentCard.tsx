import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Component } from '../types';

interface ComponentCardProps {
  componentData: Component;
  type: 'negative' | 'positive' | 'questionable';
}

const NegativeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
);
const PositiveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
);
const QuestionableIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const SeverityInfo: React.FC<{ severity: string; type: 'negative' | 'positive' | 'questionable' }> = ({ severity, type }) => {
    const { t } = useTranslation();
    let info: { text: string; bgColor: string; textColor: string; icon: React.ReactNode | null } | null = null;
    const severityLower = severity.toLowerCase();

    const icons = {
        highRisk: <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-1.25a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z" clipRule="evenodd" /></svg>,
        moderateRisk: <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 4a1 1 0 012 0v6a1 1 0 11-2 0V4zm0 8a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" /></svg>,
        lowRisk: <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>,
        goodBenefit: <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
        moderateBenefit: <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
        ambiguous: <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>,
    };

    if (type === 'negative') {
        switch (severityLower) {
            case 'sever': case 'high': info = { text: t('componentCard.severity.highRisk'), bgColor: 'bg-red-100 dark:bg-red-900/50', textColor: 'text-red-800 dark:text-red-300', icon: icons.highRisk }; break;
            case 'moderate': info = { text: t('componentCard.severity.moderateRisk'), bgColor: 'bg-orange-100 dark:bg-orange-900/50', textColor: 'text-orange-800 dark:text-orange-300', icon: icons.moderateRisk }; break;
            case 'low': info = { text: t('componentCard.severity.lowRisk'), bgColor: 'bg-yellow-100 dark:bg-yellow-900/50', textColor: 'text-yellow-800 dark:text-yellow-300', icon: icons.lowRisk }; break;
        }
    } else if (type === 'positive') {
         switch (severityLower) {
            case 'good': info = { text: t('componentCard.severity.goodBenefit'), bgColor: 'bg-emerald-100 dark:bg-emerald-900/50', textColor: 'text-emerald-800 dark:text-emerald-300', icon: icons.goodBenefit }; break;
            case 'moderate': info = { text: t('componentCard.severity.moderateBenefit'), bgColor: 'bg-green-100 dark:bg-green-900/50', textColor: 'text-green-800 dark:text-green-300', icon: icons.moderateBenefit }; break;
        }
    } else if (type === 'questionable') {
        switch (severityLower) {
            case 'moderate_concern': info = { text: t('componentCard.severity.concernSource'), bgColor: 'bg-orange-100 dark:bg-orange-900/50', textColor: 'text-orange-800 dark:text-orange-300', icon: icons.moderateRisk }; break;
            case 'ambiguous': default: info = { text: t('componentCard.severity.ambiguous'), bgColor: 'bg-yellow-100 dark:bg-yellow-900/50', textColor: 'text-yellow-800 dark:text-yellow-300', icon: icons.ambiguous }; break;
        }
    }
    
    if (!info) return null;

    return (
        <div className={`mt-1 flex items-center space-x-1 rtl:space-x-reverse rounded-full px-2 py-0.5 text-xs font-semibold ${info.bgColor} ${info.textColor}`}>
            {info.icon}
            <span>{info.text}</span>
        </div>
    );
};


const ComponentCard: React.FC<ComponentCardProps> = ({ componentData, type }) => {
    const typeStyles = {
        negative: {
            borderColor: 'border-red-500',
            bgColor: 'bg-red-500',
            icon: <NegativeIcon />,
            pointClass: 'text-red-600 dark:text-red-400'
        },
        positive: {
            borderColor: 'border-emerald-500',
            bgColor: 'bg-emerald-500',
            icon: <PositiveIcon />,
            pointClass: 'text-emerald-600 dark:text-emerald-400'
        },
        questionable: {
            borderColor: 'border-yellow-500',
            bgColor: 'bg-yellow-500',
            icon: <QuestionableIcon />,
            pointClass: 'text-yellow-600 dark:text-yellow-400'
        },
    };

  const { component, value, penalty, bonus, description, severity } = componentData;
  const styles = typeStyles[type];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-r-4 rtl:border-r-0 rtl:border-l-4 ${styles.borderColor}`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className={`p-2 rounded-full ${styles.bgColor}`}>
                    {styles.icon}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{component}</h3>
                    {value && <p className="text-sm text-gray-500 dark:text-gray-400">{value}</p>}
                </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0 ml-2 rtl:ml-0 rtl:mr-2">
                {(penalty || bonus) && (
                    <div className={`text-2xl font-black ${styles.pointClass}`}>
                        {type === 'positive' ? `+${bonus}` : `-${penalty}`}
                    </div>
                )}
                <SeverityInfo severity={severity} type={type} />
            </div>
        </div>
        <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ComponentCard;
