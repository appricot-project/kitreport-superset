export function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const newArr = arr.slice();
  const [moved] = newArr.splice(from, 1);
  newArr.splice(to, 0, moved);

  return newArr;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Б';

  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
