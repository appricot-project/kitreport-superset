const API_BASE_PATH = 'https://ss.kitreport.ru/api/pdf/files';
const API_TOKEN = 'fb46769d-d040-4cfc-ab9d-fa71e705e488';

export interface UploadedFile {
  name: string;
  key: string;
}

export async function uploadPdfFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const url = `${API_BASE_PATH}/upload`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Token ${API_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ошибка загрузки PDF:', errorText);

      try {
        const errorData = JSON.parse(errorText);
        throw new Error(
          errorData.detail?.[0]?.msg ||
            errorData.message ||
            `Ошибка загрузки PDF, статус ${response.status}`,
        );
      } catch {
        throw new Error(`Ошибка загрузки PDF: ${errorText || response.status}`);
      }
    }

    const responseText = await response.text();

    try {
      const responseData = JSON.parse(responseText);
      if (
        responseData &&
        typeof responseData === 'object' &&
        responseData.key
      ) {
        return responseData.key;
      }
      return responseText;
    } catch {
      return responseText;
    }
  } catch (error) {
    console.error('Ошибка загрузки PDF:', error);
    throw error;
  }
}

export async function downloadPdfFile(key: string): Promise<Blob> {
  const url = `${API_BASE_PATH}/${encodeURIComponent(key)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Token ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ошибка скачивания PDF:', errorText);

      try {
        const errorData = JSON.parse(errorText);
        throw new Error(
          errorData.detail?.[0]?.msg ||
            errorData.message ||
            `Ошибка скачивания PDF, статус ${response.status}`,
        );
      } catch {
        throw new Error(
          `Ошибка скачивания PDF: ${errorText || response.status}`,
        );
      }
    }

    return await response.blob();
  } catch (error) {
    console.error('Ошибка скачивания PDF:', error);
    throw error;
  }
}

export async function mergePdfFiles(keys: string[]): Promise<Blob> {
  const url = `${API_BASE_PATH}/merge`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${API_TOKEN}`,
      },
      body: JSON.stringify(keys),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ошибка объединения PDF:', errorText);

      try {
        const errorData = JSON.parse(errorText);
        throw new Error(
          errorData.detail?.[0]?.msg ||
            errorData.message ||
            `Ошибка объединения PDF, статус ${response.status}`,
        );
      } catch {
        throw new Error(
          `Ошибка объединения PDF: ${errorText || response.status}`,
        );
      }
    }

    return await response.blob();
  } catch (error) {
    console.error('Ошибка объединения PDF:', error);
    throw error;
  }
}

export async function mergeAndSavePdfFiles(keys: string[]): Promise<string> {
  const url = `${API_BASE_PATH}/merge/save`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${API_TOKEN}`,
      },
      body: JSON.stringify(keys),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ошибка объединения и сохранения PDF:', errorText);

      try {
        const errorData = JSON.parse(errorText);
        throw new Error(
          errorData.detail?.[0]?.msg ||
            errorData.message ||
            `Ошибка объединения и сохранения PDF, статус ${response.status}`,
        );
      } catch {
        throw new Error(
          `Ошибка объединения и сохранения PDF: ${errorText || response.status}`,
        );
      }
    }

    const responseText = await response.text();

    try {
      const responseData = JSON.parse(responseText);
      if (
        responseData &&
        typeof responseData === 'object' &&
        responseData.key
      ) {
        return responseData.key;
      }
      return responseText;
    } catch {
      return responseText;
    }
  } catch (error) {
    console.error('Ошибка объединения и сохранения PDF:', error);
    throw error;
  }
}
