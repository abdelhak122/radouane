import React from 'react';
import { useTranslation } from 'react-i18next';

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  const { t } = useTranslation();
  
  const getScoreColor = () => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-48 h-48">
      <svg className="w-full h-full" viewBox="0 0 150 150">
        <circle
          className="text-gray-200 dark:text-gray-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="75"
          cy="75"
        />
        <circle
          className={`${getScoreColor()} transition-all duration-1000 ease-out`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="75"
          cy="75"
          transform="rotate(-90 75 75)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-black ${getScoreColor()}`}>{score}</span>
        <span className="text-lg font-bold text-gray-500 dark:text-gray-400">{t('score.per100')}</span>
      </div>
    </div>
  );
};

export default ScoreBadge;