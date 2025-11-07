import React from 'react';
import { useTranslation } from 'react-i18next';

const LoadingSpinner: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-emerald-500 border-dashed rounded-full animate-spin"></div>
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('loading.analyzing')}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
        {t('loading.description')}
      </p>
    </div>
  );
};

export default LoadingSpinner;
