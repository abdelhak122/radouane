import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header.tsx';
import ImageUpload from './components/ImageUpload.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import AnalysisResultDisplay from './components/AnalysisResult.tsx';
import ApiKeyModal from './components/ApiKeyModal.tsx';
import { analyzeProduct } from './services/geminiService.ts';
import type { AnalysisResult } from './types.ts';

function App() {
  const { t, i18n } = useTranslation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir();
    document.title = t('app.title');
  }, [i18n.language, i18n, t]);

  const handleImageSelect = useCallback((file: File | null) => {
    setAnalysisResult(null);
    setError(null);
    setImageFile(file);
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    } else {
      setImageUrl(null);
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) {
      setError(t('error.selectImage'));
      return;
    }
    
    if (!apiKey) {
      setError(t('error.apiKeyMissing'));
      setIsApiKeyModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeProduct(imageFile, i18n.language, apiKey);
      setAnalysisResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(t('error.analysisFailed', { message: err.message }));
      } else {
        setError(t('error.unexpected'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, i18n.language, t, apiKey]);
  
  const handleSaveApiKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    setIsApiKeyModalOpen(false);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 dark:text-gray-100">
      <Header 
        onSettingsClick={() => setIsApiKeyModalOpen(true)}
        onNewScanClick={() => handleImageSelect(null)}
        showNewScanButton={!!analysisResult}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {!analysisResult && (
          <>
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white">{t('hero.title')}</h2>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    {t('hero.subtitle')}
                </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <ImageUpload
                onImageSelect={handleImageSelect}
                onAnalyze={handleAnalyze}
                imageUrl={imageUrl}
                isLoading={isLoading}
                hasResult={!!analysisResult}
              />
            </div>
          </>
        )}
        
        {isLoading && (
          <div className="flex justify-center items-center mt-8">
            <LoadingSpinner />
          </div>
        )}

        {error && (
            <div className="mt-8 max-w-2xl mx-auto text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                <strong className="font-bold">{t('error.title')} </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        
        {analysisResult && (
           <AnalysisResultDisplay result={analysisResult} />
        )}
      </main>

      <footer className="w-full bg-white dark:bg-gray-800 shadow-inner mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>{t('footer.disclaimer')}</p>
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>
      
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleSaveApiKey}
      />
    </div>
  );
}

export default App;