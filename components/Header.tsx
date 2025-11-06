import React from 'react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-500">
                <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" fill="currentColor" fillOpacity="0.3"/>
                <path d="M12 12L21 7L12 2L3 7L12 12Z" fill="currentColor"/>
                <path d="M3 7V17L12 12V2L3 7Z" fill="currentColor" fillOpacity="0.6"/>
                <path d="M21 7V17L12 12V2L21 7Z" fill="currentColor" fillOpacity="0.6"/>
            </svg>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              <span className="font-black text-emerald-500">{t('header.brand')}</span>
            </h1>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="relative">
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="appearance-none rounded-md border border-gray-300 bg-transparent py-1.5 pl-3 pr-8 text-sm font-medium text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              aria-label={t('changeLanguage')}
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
           <button onClick={onSettingsClick} className="text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400" aria-label={t('header.settings')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;