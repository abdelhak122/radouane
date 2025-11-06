import React from 'react';
import { useTranslation } from 'react-i18next';

interface ProductCategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  disabled: boolean;
}

const ProductCategorySelector: React.FC<ProductCategorySelectorProps> = ({ selectedCategory, onCategoryChange, disabled }) => {
  const { t } = useTranslation();
  const categories = [
    { key: 'food_beverage', label: t('category.options.food_beverage') },
    { key: 'cosmetics_skincare', label: t('category.options.cosmetics_skincare') },
    { key: 'cleaning_supplies', label: t('category.options.cleaning_supplies') },
    { key: 'other', label: t('category.options.other') },
  ];

  return (
    <div className="w-full max-w-sm mx-auto mb-6">
      <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {t('category.label')}
      </label>
      <div className="relative">
        <select
          id="product-category"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none rounded-md border border-gray-300 bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-base shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm disabled:bg-gray-200 dark:disabled:bg-gray-600 disabled:cursor-not-allowed dark:border-gray-600"
        >
          {categories.map((cat) => (
            <option key={cat.key} value={cat.key}>
              {cat.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );
};

export default ProductCategorySelector;
