import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import LoadingSpinner from './components/LoadingSpinner';
import AnalysisResultDisplay from './components/AnalysisResult';
import ProductCategorySelector from './components/ProductCategorySelector';
import ApiKeyModal from './components/ApiKeyModal';
import { analyzeProduct } from './services/geminiService';
import type { AnalysisResult } from './types';

function App() {
  const { t, i18n } = useTranslation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [productCategory, setProductCategory] = useState<string>('food_beverage');
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
      const categoryLabel = t(`category.options.${productCategory}`);
      const result = await analyzeProduct(imageFile, i18n.language, categoryLabel, apiKey);
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
  }, [imageFile, i18n.language, t, productCategory, apiKey]);
  
  const handleSaveApiKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    setIsApiKeyModalOpen(false);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 dark:text-gray-100">
      <Header onSettingsClick={() => setIsApiKeyModalOpen(true)} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white">{t('hero.title')}</h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {t('hero.subtitle')}
            </p>
        </div>

        {!analysisResult && (
          <>
            <ProductCategorySelector
              selectedCategory={productCategory}
              onCategoryChange={setProductCategory}
              disabled={isLoading || !!imageUrl}
            />
            <ImageUpload
              onImageSelect={handleImageSelect}
              onAnalyze={handleAnalyze}
              imageUrl={imageUrl}
              isLoading={isLoading}
              hasResult={!!analysisResult}
            />
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
           <>
            <AnalysisResultDisplay result={analysisResult} />
             <div className="text-center mt-4">
                <button
                    onClick={() => handleImageSelect(null)}
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                    {t('results.analyzeAnother')}
                </button>
             </div>
           </>
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