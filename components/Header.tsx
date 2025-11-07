import React from 'react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onNewScanClick: () => void;
  showNewScanButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ onNewScanClick, showNewScanButton }) => {
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
          {/* Fix: Removed settings button to comply with API key guidelines. */}
          {showNewScanButton && (
             <button onClick={onNewScanClick} className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-colors text-sm flex items-center space-x-2 rtl:space-x-reverse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm10.5 4.5a.5.5 0 00-1 0V8H12a.5.5 0 000 1h1.5v1.5a.5.5 0 001 0V9H16a.5.5 0 000-1h-1.5V6.5zM4 12a1 1 0 100 2h8a1 1 0 100-2H4z" clipRule="evenodd" />
                </svg>
                <span>{t('header.newScan')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;