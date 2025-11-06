import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  onAnalyze: () => void;
  imageUrl: string | null;
  isLoading: boolean;
  hasResult: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, onAnalyze, imageUrl, isLoading, hasResult }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useTranslation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageSelect(event.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onImageSelect(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    onImageSelect(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div 
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-all duration-300
          ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400'}
          ${imageUrl ? 'border-solid p-2' : ''}`}
        onClick={!imageUrl ? triggerFileSelect : undefined}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />

        {imageUrl ? (
          <>
            <img src={imageUrl} alt={t('upload.previewAlt')} className="object-contain w-full h-full rounded-md" />
            <button onClick={clearImage} disabled={isLoading} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 disabled:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
          </>
        ) : (
          <div className="text-center cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{t('upload.dragAndDrop')}</span>
                {t('upload.imageHere')}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{t('upload.clickToSelect')}</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('upload.formats')}</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={onAnalyze}
          disabled={!imageUrl || isLoading}
          className="px-8 py-3 bg-emerald-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 ease-in-out disabled:transform-none"
        >
          {isLoading ? t('upload.analyzing') : (hasResult ? t('upload.analyzeAgain') : t('upload.startAnalysis'))}
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;
