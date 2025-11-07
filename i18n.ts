import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      app: {
        title: "Radouane - Ingredient Analyzer"
      },
      header: {
        brand: "Radouane",
        settings: "Settings",
        newScan: "New Scan"
      },
      hero: {
        title: "Inspect Your Products Intelligently",
        subtitle: "Take a picture of any product's ingredients, and let 'Radouane' reveal the scientific truth behind it."
      },
      upload: {
        title: "Provide an Image",
        uploadFromDevice: "Upload from Device",
        uploadFromDeviceDescription: "Choose a file from your gallery",
        scanWithCamera: "Scan with Camera",
        scanWithCameraDescription: "Use your camera to snap a photo",
        dragAndDropNotice: "You can also drag and drop an image file here.",
        dropHere: "Drop image to upload",
        formats: "PNG, JPG, WEBP supported",
        previewAlt: "Product preview",
        analyzing: "Analyzing...",
        analyzeAgain: "Analyze Again",
        startAnalysis: "Start Analysis"
      },
      loading: {
        analyzing: "Analyzing...",
        description: "Our system is analyzing the image, looking up product data, and applying the scientific formula. This may take a few moments."
      },
      error: {
        title: "Error!",
        cameraTitle: "Camera Error",
        unexpected: "An unexpected error occurred.",
        selectImage: "Please select an image first.",
        analysisFailed: "Failed to analyze product: {{message}}",
        apiKeyMissing: "Please set your Gemini API Key in the settings before analyzing.",
        cameraPermissionDenied: "Camera access was denied. Please enable camera permissions for this site in your browser settings to continue.",
        cameraNotFound: "No compatible camera was found on your device.",
        cameraAccessGeneric: "Could not access the camera due to an unexpected issue. Please try again."
      },
      results: {
        productCategory: "Product Category",
        analyzeAnother: "Analyze Another Product",
        productIdentification: "Product ID",
        ocrAccuracy: "OCR Accuracy",
        dataSource: "Data Source",
        negative: "Negative Ingredients",
        questionable: "Questionable Ingredients",
        positive: "Positive Ingredients",
        atAGlance: "At a Glance",
        keyMetrics: "Key Metrics",
        glance: {
          positives: "Positives",
          negatives: "Negatives",
          questionable: "Questionable"
        }
      },
      score: {
        per100: "/ 100"
      },
      componentCard: {
        severity: {
          highRisk: "High Risk",
          moderateRisk: "Moderate Risk",
          lowRisk: "Low Risk",
          goodBenefit: "Good Benefit",
          moderateBenefit: "Moderate Benefit",
          concernSource: "Source of Concern",
          ambiguous: "Ambiguous"
        }
      },
      apiKeyModal: {
        title: "Set API Key",
        description: "To use the analysis feature, you need to provide your own Google Gemini API key.",
        getOneHere: "Get one here.",
        inputLabel: "Your Gemini API Key",
        save: "Save",
        cancel: "Cancel",
        close: "Close"
      },
      footer: {
        installApp: "Install App",
        disclaimer: "Disclaimer: This analysis is for informational purposes only and does not constitute medical advice. Always consult a qualified professional.",
        copyright: "© 2024 Radouane. All rights reserved."
      },
      changeLanguage: "Change language"
    }
  },
  ar: {
    translation: {
      app: {
        title: "رضوان - محلل المكونات"
      },
      header: {
        brand: "رضوان",
        settings: "الإعدادات",
        newScan: "مسح جديد"
      },
      hero: {
        title: "افحص منتجاتك بذكاء",
        subtitle: "التقط صورة لمكونات أي منتج، ودع \"رضوان\" يكشف لك الحقيقة العلمية وراءه."
      },
      upload: {
        title: "قدّم صورة المنتج",
        uploadFromDevice: "رفع من الجهاز",
        uploadFromDeviceDescription: "اختر ملفاً من معرض الصور",
        scanWithCamera: "مسح بالكاميرا",
        scanWithCameraDescription: "استخدم كاميرتك لالتقاط صورة",
        dragAndDropNotice: "يمكنك أيضاً سحب وإفلات ملف الصورة هنا.",
        dropHere: "أفلت الصورة للرفع",
        formats: "يدعم PNG, JPG, WEBP",
        previewAlt: "معاينة المنتج",
        analyzing: "جاري التحليل...",
        analyzeAgain: "تحليل مرة أخرى",
        startAnalysis: "ابدأ التحليل"
      },
      loading: {
        analyzing: "جاري التحليل...",
        description: "يقوم نظامنا بتحليل الصورة، والبحث عن بيانات المنتج، وتطبيق الصيغة العلمية. قد يستغرق هذا بضع لحظات."
      },
      error: {
        title: "خطأ!",
        cameraTitle: "خطأ في الكاميرا",
        unexpected: "حدث خطأ غير متوقع.",
        selectImage: "الرجاء اختيار صورة أولاً.",
        analysisFailed: "فشل تحليل المنتج: {{message}}",
        apiKeyMissing: "الرجاء إدخال مفتاح Gemini API الخاص بك في الإعدادات قبل التحليل.",
        cameraPermissionDenied: "تم رفض الوصول إلى الكاميرا. للمتابعة، يرجى تمكين أذونات الكاميرا لهذا الموقع في إعدادات متصفحك.",
        cameraNotFound: "لم يتم العثور على كاميرا متوافقة على جهازك.",
        cameraAccessGeneric: "تعذر الوصول إلى الكاميرا بسبب مشكلة غير متوقعة. يرجى المحاولة مرة أخرى."
      },
      results: {
        productCategory: "فئة المنتج",
        analyzeAnother: "تحليل منتج آخر",
        productIdentification: "تعرف المنتج",
        ocrAccuracy: "دقة OCR",
        dataSource: "مصدر البيانات",
        negative: "المكونات السلبية",
        questionable: "المكونات المشكوك فيها",
        positive: "المكونات الإيجابية",
        atAGlance: "نظرة سريعة",
        keyMetrics: "المقاييس الرئيسية",
        glance: {
          positives: "الإيجابيات",
          negatives: "السلبيات",
          questionable: "المشكوك فيها"
        }
      },
      score: {
        per100: "/ 100"
      },
      componentCard: {
        severity: {
          highRisk: "خطر مرتفع",
          moderateRisk: "خطر متوسط",
          lowRisk: "خطر منخفض",
          goodBenefit: "فائدة جيدة",
          moderateBenefit: "فائدة مقبولة",
          concernSource: "مصدر قلق",
          ambiguous: "غامض"
        }
      },
      apiKeyModal: {
        title: "إعداد مفتاح API",
        description: "لاستخدام ميزة التحليل، تحتاج إلى تقديم مفتاح Google Gemini API الخاص بك.",
        getOneHere: "احصل على واحد من هنا.",
        inputLabel: "مفتاح Gemini API الخاص بك",
        save: "حفظ",
        cancel: "إلغاء",
        close: "إغلاق"
      },
      footer: {
        installApp: "تثبيت التطبيق",
        disclaimer: "تنبيه: هذا التحليل هو لأغراض إعلامية فقط ولا يمثل نصيحة طبية. استشر دائمًا أخصائيًا مؤهلاً.",
        copyright: "© 2024 رضوان. جميع الحقوق محفوظة."
      },
      changeLanguage: "تغيير اللغة"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
    },
  });

export default i18n;