import {
  MaterialDocument,
  MaterialLibraryData,
  TAB_MAP,
} from 'src/features/materialLibrary/types';

/**
 * Форматирует размер файла из байтов в читаемый формат
 * @param bytes - размер файла в байтах
 * @returns строка с отформатированным размером файла
 */
export const formatSize = (bytes: string | number): string => {
  const num = typeof bytes === 'string' ? Number(bytes) : bytes;
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;

  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Форматирует дату в локальный формат
 * @param date - дата в строковом формате
 * @returns строка с отформатированной датой
 */
export const formatDateToLocale = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

/**
 * Преобразует данные манифеста в массив документов для таблицы
 * @param data - данные манифеста
 * @returns массив документов
 */
export const transformManifestToDocuments = (
  data: MaterialLibraryData | null,
): MaterialDocument[] => {
  if (!data) return [];

  return data.folders.flatMap(folder =>
    folder.items.map(item => ({
      id: `${folder.title}-${item.title}`,
      title: item.title,
      category: folder.title,
      size_in_bytes: Number(item.size_in_bytes),
      url: item.url,
      published_at: item.published_at,
    })),
  );
};

/**
 * Фильтрует документы по категории
 * @param documents - массив документов
 * @param category - категория для фильтрации
 * @returns отфильтрованный массив документов
 */
export const filterDocumentsByCategory = (
  documents: MaterialDocument[],
  category: keyof typeof TAB_MAP,
): MaterialDocument[] => {
  if (category === 'all') return documents;

  return documents.filter(doc => doc.category === TAB_MAP[category]);
};

/**
 * Находит папку по названию категории
 * @param data - массив папок
 * @param category - категория для фильтрации
 * @returns отфильтрованный массив папок
 */
export const findFolderByCategory = (
  data: MaterialLibraryData | null,
  category: keyof typeof TAB_MAP,
): MaterialLibraryData['folders'][0] | undefined => {
  if (!data) return undefined;

  return data.folders.find(folder => folder.title === TAB_MAP[category]);
};

/**
 * Извлекает basket и filename из URL файла
 * @param url - URL файла
 * @returns объект с basket и filename
 */
export function extractBasketAndFilenameFromUrl(url: string): {
  basket: string;
  filename: string;
} {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split('/').filter(Boolean);

    if (parts.length >= 3) {
      const basket = decodeURIComponent(parts[1]);
      const filename = decodeURIComponent(parts.slice(2).join('/'));
      return { basket, filename };
    }
    return { basket: '', filename: '' };
  } catch {
    return { basket: '', filename: '' };
  }
}
