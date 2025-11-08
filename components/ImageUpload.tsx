import React, { useRef, useState, useEffect } from 'react';
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

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);
  const [focusIndicator, setFocusIndicator] = useState<{x: number, y: number} | null>(null);


  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isCameraOpen) {
      setCameraError(null);
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => {
          stream = s;
          const track = s.getVideoTracks()[0];
          videoTrackRef.current = track;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
        })
        .catch(err => {
          console.error("Error accessing camera: ", err);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setCameraError(t('error.cameraPermissionDenied'));
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            setCameraError(t('error.cameraNotFound'));
          } else {
            setCameraError(t('error.cameraAccessGeneric'));
          }
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoTrackRef.current) {
        videoTrackRef.current.stop();
        videoTrackRef.current = null;
      }
    };
  }, [isCameraOpen, t]);


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
  
  const openCamera = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCameraError(null);
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
    setCameraError(null);
  };

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onImageSelect(file);
            closeCamera();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const handleFocus = (event: React.MouseEvent<HTMLVideoElement>) => {
    if (cameraError) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setFocusIndicator({ x, y });
    setTimeout(() => setFocusIndicator(null), 1000);

    if (videoTrackRef.current) {
      const track = videoTrackRef.current;
      const capabilities = track.getCapabilities();
      
      if (capabilities.focusMode && capabilities.focusMode.includes('single-shot')) {
        track.applyConstraints({ focusMode: 'single-shot' }).catch(err => console.error("Could not apply single-shot focus", err));
      } else if (capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
        track.applyConstraints({ focusMode: 'continuous' }).catch(err => console.error("Could not apply continuous focus", err));
      }
    }
  };


  return (
    <>
      <div 
        className="relative w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {isDragging && (
          <div className="absolute inset-0 bg-emerald-500 bg-opacity-20 border-4 border-dashed border-emerald-600 rounded-xl z-10 flex flex-col items-center justify-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-800 dark:text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15v-6m-3 3h6" />
            </svg>
            <p className="mt-2 text-xl font-bold text-emerald-800 dark:text-emerald-200">{t('upload.dropHere')}</p>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />

        {imageUrl ? (
          <div className="p-4">
            <div className="relative">
              <img src={imageUrl} alt={t('upload.previewAlt')} className="object-contain w-full h-full max-h-96 rounded-md" />
              <button onClick={clearImage} disabled={isLoading} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 disabled:opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
              </button>
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
        ) : (
           <div className="text-center w-full p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t('upload.title')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('upload.formats')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div onClick={triggerFileSelect} className="cursor-pointer p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-emerald-50 dark:hover:bg-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600 dark:text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  </div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mt-4">{t('upload.uploadFromDevice')}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('upload.uploadFromDeviceDescription')}</p>
                </div>
                
                <div onClick={openCamera} className="cursor-pointer p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-emerald-50 dark:hover:bg-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all">
                   <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mx-auto">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600 dark:text-emerald-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H4zm10 5a3 3 0 11-6 0 3 3 0 016 0z" clipRule="evenodd" /></svg>
                  </div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mt-4">{t('upload.scanWithCamera')}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('upload.scanWithCameraDescription')}</p>
                </div>

              </div>
              <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">{t('upload.dragAndDropNotice')}</p>
            </div>
        )}
      </div>
      
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
          {cameraError ? (
            <div className="text-center text-white max-w-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-xl font-bold mb-2">{t('error.cameraTitle')}</h3>
                <p className="text-gray-300">{cameraError}</p>
            </div>
          ) : (
            <div className="relative">
              <video 
                ref={videoRef} 
                className="max-w-full max-h-[85vh] rounded-lg cursor-pointer" 
                playsInline
                onClick={handleFocus}
              ></video>
              {focusIndicator && (
                <div 
                  className="absolute border-2 border-yellow-400 w-20 h-20 rounded-lg animate-focus-pulse"
                  style={{ 
                    left: `${focusIndicator.x - 40}px`, // Center the box on the click
                    top: `${focusIndicator.y - 40}px`
                  }}
                ></div>
              )}
            </div>
          )}
          <canvas ref={canvasRef} className="hidden"></canvas>
          <div className="absolute bottom-5 flex items-center justify-center w-full space-x-8">
            <button onClick={closeCamera} aria-label="Close camera" className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            {!cameraError && (
              <button onClick={handleTakePhoto} aria-label="Take photo" className="w-20 h-20 rounded-full bg-white ring-4 ring-white/30 ring-offset-4 ring-offset-black/20 hover:bg-gray-200 transition-colors">
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUpload;
