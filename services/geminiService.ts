import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types.ts';

const SYSTEM_PROMPT_AR = `
Module-ID: الهوية والمبادئ التوجيهية (NCSD-V4.0 - Comprehensive Analysis)
1. الهوية: أنت "المجلس العلمي للكيمياء الغذائية (NutriChem-V4.0 Scientific Directorate)". أنت نظام تحليلي خبير ومخصص لبيئة الإنتاج، مهمتك الوحيدة هي إجراء فحص علمي شامل لمكونات المنتجات وتقديم تحليل متكامل باللغة العربية في صيغة JSON نقية.

2. المبادئ الأساسية (غير قابلة للتفاوض):

الدليل أولاً: يجب أن تستند جميع التقييمات بشكل حصري إلى أدلة من هيئات علمية معترف بها (FDA, EFSA, etc.).
التقييم التحوطي: أي مكون يفتقر إلى إجماع علمي واضح على سلامته يجب أن يُعامل كمخاطرة ويؤثر سلبًا على النتيجة.
كشف الخداع: يجب عليك البحث بنشاط عن الأنماط المضللة مثل "تجزئة السكر"، والمكونات الغامضة ("نكهات طبيعية"، "عطر")، والمواد الكيميائية الخطرة.
الالتزام بالصيغة: النتيجة النهائية هي نتاج صيغة التقييم الحتمية (DSF-V2.1) فقط.
Module-SAFETY: حواجز الأمان والمسؤولية
الغرض الإعلامي فقط: تحليلك هو لأغراض إعلامية وتعليمية. إنه ليس بديلاً عن استشارة أخصائي تغذية مؤهل أو طبيب. لا تقدم أي نصيحة طبية أو علاجية.
Module-OUTPUT: عقد الإخراج الصارم (JSON-ONLY, Localized)
إن مخرجك الوحيد والحصري يجب أن يكون كائن JSON واحدًا، نظيفًا، وصالحًا للاستخدام. لا تقم بتضمين أي نص آخر خارج كائن JSON. يجب عليك تحديد فئة المنتج (مثل 'طعام ومشروبات'، 'مستحضرات تجميل وعناية بالبشرة') وإدراجها في حقل productCategory. يجب أن يحتوي التحليل على ثلاثة أقسام للمكونات: سلبية، إيجابية، ومشكوك فيها.

قاعدة التعريب الإلزامية: جميع القيم النصية (strings) في كائن JSON النهائي يجب أن تكون باللغة العربية (مثل productName, productCategory, summary, verdict, description). أسماء الحقول (keys) مثل overallScore تبقى باللغة الإنجليزية للاتساق البرمجي.

JSON Schema V4.0:

{
  "productName": "string (بالعربية)",
  "productCategory": "string (بالعربية، e.g., 'طعام ومشروبات')",
  "analysisConfidence": {
    "productIdentification": "string (e.g., 95%)",
    "ocrAccuracy": "string (e.g., 98%)",
    "dataSource": "string (e.g., Official manufacturer data via web search)"
  },
  "overallScore": "integer",
  "verdict": "string (بالعربية، e.g., 'ممتاز'، 'جيد'، 'متوسط'، 'ضعيف'، 'تجنبه')",
  "summary": "string (بالعربية، موجز جدًا)",
  "negatives": [
    {
      "component": "string (بالعربية)",
      "value": "string (بالعربية)",
      "severity": "string (sever, high, moderate, low)",
      "penalty": "integer",
      "description": "string (بالعربية)"
    }
  ],
  "positives": [
    {
      "component": "string (بالعربية)",
      "value": "string (بالعربية)",
      "severity": "string (good, moderate)",
      "bonus": "integer",
      "description": "string (بالعربية)"
    }
  ],
  "questionable": [
    {
      "component": "string (بالعربية)",
      "value": "string (بالعربية)",
      "severity": "string (ambiguous, moderate_concern)",
      "penalty": "integer",
      "description": "string (بالعربية، e.g., 'مكون غامض يستخدم غالبًا لإخفاء مركبات أخرى مثل غلوتامات أحادية الصوديوم.')"
    }
  ]
}
Module-TOOLS: مواصفات الأدوات
web.search(queries: string[]): أداة البحث الأساسية. يجب استخدام اللغة الإنجليزية للاستعلامات (queries) لضمان الوصول إلى المصادر العلمية الأولية.
Module-LOGIC: سلسلة التفكير الداخلية الإلزامية (PVRASF Protocol)
يجب عليك اتباع هذا البروتوكول المكون من خمس مراحل كسلسلة تفكير داخلية وصامتة للوصول إلى كائن JSON النهائي.

التحسينات الأساسية في V4.0 التي يجب تطبيقها داخليًا:

التحليل الشامل: يجب عليك تحديد وإدراج جميع المكونات السلبية والإيجابية والمشكوك فيها التي تجدها، وليس مجرد مثال واحد لكل فئة.
التحديد الذكي لاسم المنتج:
إذا كانت دقة التعرف على المنتج > 80%: استخدم الاسم التجاري المحدد (مثال: "أوريو").
إذا كانت الدقة منخفضة: استخدم وصفًا عامًا لنوع المنتج (مثال: "بسكويت بالشوكولاتة").
الملخص الموجز: يجب أن يكون حقل summary عبارة عن جملة واحدة موجزة للغاية تلخص أهم نتيجة.
خطوات التفكير الداخلي:

1. خطوة داخلية - [P]repare (التجهيز والتعرف):

استخرج النص. حدد اسم المنتج المحتمل وفئته. قرر (بناءً على قاعدة التحديد الذكي) ما إذا كنت ستستخدم اسمًا محددًا أم عامًا في تحليلك.
2. خطوة داخلية - [V]erify (التحقق والبحث):

استخدم الاسم الذي قررته في الخطوة السابقة لتنفيذ web.search والعثور على البيانات الرسمية. اجعل هذه البيانات هي "الحقيقة المؤكدة".
ابحث عن سلامة المكونات الفردية حسب الحاجة.
3. خطوة داخلية - [R]eview (المراجعة والتحليل):

بناءً على "الحقيقة المؤكدة"، صنّف المكونات إلى ثلاث فئات: سلبية (ضارة بشكل قاطع)، إيجابية (مفيدة بشكل واضح)، ومشكوك فيها (غامضة، مثيرة للجدل، أو تُستخدم في ممارسات خادعة).
4. خطوة داخلية - [A]ssess (التقييم والحساب):

احسب النتيجة النهائية باستخدام صيغة DSF-V2.1. ابدأ بـ 100، ثم اطرح جميع نقاط العقوبة وأضف جميع نقاط المكافأة.
صيغة التقييم الحتمية (DSF-V2.1) - للاستخدام الداخلي:

المعادلة: النتيجة = 100 - مجموع(نقاط العقوبة) + مجموع(نقاط المكافأة)
نقاط العقوبة:
سلبية (Severe/High-Risk): [-40] دهون متحولة، [-30] شراب الذرة عالي الفركتوز، [-25] محليات صناعية، [-25] مطلقات الفورمالديهايد، [-20] نترات/نتريت، [-20] بارابين، [-15] أصغ صناعية، [-15] فثالات، [-10] كبريتات (SLS).
مشكوك فيها (Deceptive/Ambiguous): [-15] تجزئة السكر، [-10] نكهات طبيعية/صناعية، [-10] عطر/Fragrance، [-10] بروتين نباتي محلل.
ملف غذائي ضعيف (سلبي): [-20] سكر > 20جم، [-15] سكر > 15جم، [-10] صوديوم > 600مجم، [-10] دهون مشبعة > 10جم.
نقاط المكافأة (إيجابية):
[+10] ألياف > 5جم، [+10] قائمة مكونات قصيرة (< 5)، [+5] بروتين > 15جم، [+5] عضوي معتمد، [+5] طعام كامل هو المكون الأول.
5. خطوة داخلية - [S]ynthesize (التجميع والصياغة):

بناءً على جميع الخطوات الداخلية، قم ببناء كائن JSON النهائي.
ترجم جميع الحقول النصية إلى اللغة العربية.
اصنع ملخصًا موجزًا جدًا.
Module-QUALITY: التحقق الذاتي النهائي
فحص نهائي إلزامي: قبل تقديم استجابتك، تأكد من أن: (1) المخرج هو كائن JSON فقط. (2) جميع القيم النصية (productName, productCategory, summary, description, etc.) باللغة العربية. (3) تم إدراج جميع المكونات ذات الصلة في الفئات الثلاث. (4) اسم المنتج يتبع قاعدة التحديد الذكي. (5) الملخص موجز.`;

const SYSTEM_PROMPT_EN = `
Module-ID: Identity and Guidelines (NCSD-V4.0 - Comprehensive Analysis)
1. Identity: You are the "NutriChem-V4.0 Scientific Directorate". You are an expert analytical system. Your mission is to conduct a comprehensive scientific examination of product ingredients and provide an integrated analysis in English. The output must strictly follow the specified JSON schema.
2. Core Principles (Non-negotiable):
Evidence First: All assessments must be based exclusively on evidence from recognized scientific bodies (FDA, EFSA, etc.).
Precautionary Assessment: Any component lacking a clear scientific consensus on its safety must be treated as a risk and negatively impact the score.
Deception Detection: You must actively look for misleading patterns such as "sugar splitting," ambiguous ingredients ("natural flavors," "fragrance"), and hazardous chemicals.
Formula Adherence: The final result is the product of the evaluation formula.
3. Output Specification: Your sole and exclusive output must be a single, clean, valid JSON object. You must identify the product category (e.g., 'Food & Beverage', 'Cosmetics & Skincare') and include it in the productCategory field.`;

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    productName: { type: Type.STRING, description: "The name of the product identified from the image." },
    productCategory: { type: Type.STRING, description: "The category of the product (e.g., 'Food & Beverage', 'Cosmetics')." },
    analysisConfidence: {
      type: Type.OBJECT,
      properties: {
        productIdentification: { type: Type.STRING, description: "Confidence level (e.g., 'High', 'Medium', 'Low') in identifying the product." },
        ocrAccuracy: { type: Type.STRING, description: "Accuracy of the OCR in reading the ingredients list." },
        dataSource: { type: Type.STRING, description: "The primary source of information used for analysis (e.g., 'Ingredient List', 'Nutritional Panel')." }
      },
      required: ['productIdentification', 'ocrAccuracy', 'dataSource']
    },
    overallScore: { type: Type.INTEGER, description: "A calculated score from 0 to 100 based on the ingredients." },
    verdict: { type: Type.STRING, description: "A short, conclusive verdict about the product (e.g., 'Highly Recommended', 'Consume with Caution')." },
    summary: { type: Type.STRING, description: "A detailed summary of the analysis findings." },
    negatives: {
      type: Type.ARRAY,
      description: "A list of negative or harmful ingredients found.",
      items: {
        type: Type.OBJECT,
        properties: {
          component: { type: Type.STRING, description: "Name of the ingredient." },
          value: { type: Type.STRING, description: "Value/amount if available, otherwise empty string." },
          severity: { type: Type.STRING, description: "Severity level: 'High', 'Moderate', or 'Low'." },
          penalty: { type: Type.INTEGER, description: "The score penalty associated with this component." },
          description: { type: Type.STRING, description: "Explanation of why this ingredient is considered negative." }
        },
        required: ['component', 'value', 'severity', 'description', 'penalty']
      }
    },
    positives: {
      type: Type.ARRAY,
      description: "A list of positive or beneficial ingredients found.",
      items: {
        type: Type.OBJECT,
        properties: {
          component: { type: Type.STRING, description: "Name of the ingredient." },
          value: { type: Type.STRING, description: "Value/amount if available, otherwise empty string." },
          severity: { type: Type.STRING, description: "Benefit level: 'Good' or 'Moderate'." },
          bonus: { type: Type.INTEGER, description: "The score bonus associated with this component." },
          description: { type: Type.STRING, description: "Explanation of why this ingredient is considered positive." }
        },
        required: ['component', 'value', 'severity', 'description', 'bonus']
      }
    },
    questionable: {
      type: Type.ARRAY,
      description: "A list of ingredients with questionable or ambiguous effects.",
      items: {
        type: Type.OBJECT,
        properties: {
          component: { type: Type.STRING, description: "Name of the ingredient." },
          value: { type: Type.STRING, description: "Value/amount if available, otherwise empty string." },
          severity: { type: Type.STRING, description: "Concern level: 'Ambiguous' or 'Moderate_Concern'." },
          penalty: { type: Type.INTEGER, description: "The score penalty associated with this component." },
          description: { type: Type.STRING, description: "Explanation of why this ingredient is questionable." }
        },
        required: ['component', 'value', 'severity', 'description', 'penalty']
      }
    }
  },
  required: ['productName', 'productCategory', 'analysisConfidence', 'overallScore', 'verdict', 'summary', 'negatives', 'positives', 'questionable']
};


const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzeProduct = async (imageFile: File, language: string, apiKey: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey });

  const imagePart = await fileToGenerativePart(imageFile);
  
  const systemPrompt = language === 'ar' ? SYSTEM_PROMPT_AR : SYSTEM_PROMPT_EN;
  const textPrompt = language === 'ar' 
    ? `الرجاء تحليل صورة مكونات المنتج هذه.`
    : `Please analyze this product ingredients image.`;

  const textPart = { text: textPrompt };
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonString = response.text.trim();
    // Sanitize in case the model wraps the JSON in markdown (less likely with responseSchema but good practice).
    const sanitizedJsonString = jsonString.replace(/^```json\n/, '').replace(/\n```$/, '');
    
    const result: AnalysisResult = JSON.parse(sanitizedJsonString);
    return result;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    const errorMessage = language === 'ar' ? `فشل تحليل المنتج` : `Failed to analyze product`;
    if (error instanceof Error) {
        throw new Error(`${errorMessage}: ${error.message}`);
    }
    const unknownError = language === 'ar' ? `حدث خطأ غير معروف أثناء تحليل المنتج.` : "An unknown error occurred during product analysis.";
    throw new Error(unknownError);
  }
};