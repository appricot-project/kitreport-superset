const API_BASE_PATH = 'https://ss.kitreport.ru/api/library';
const API_TOKEN = 'fb46769d-d040-4cfc-ab9d-fa71e705e488';

interface UploadFileParams {
  basket: string;
  file: File;
  filename?: string;
}

interface UploadFileResponse {
  url: string;
  filename: string;
  size: number;
}

interface DeleteFileParams {
  basket: string;
  filename: string;
}

export async function uploadFile({
  basket,
  file,
  filename,
}: UploadFileParams): Promise<UploadFileResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const queryParams = new URLSearchParams();
  if (filename) {
    queryParams.append('filename', filename);
  }

  const url = `${API_BASE_PATH}/s3_storage/${encodeURIComponent(basket)}${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`;

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
      console.error('Ошибка загрузки файла:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(
          errorData.detail?.[0]?.msg ||
            errorData.message ||
            `Ошибка загрузки файла не удалась, статус ${response.status}`,
        );
      } catch {
        throw new Error(
          `Ошибка загрузки файла не удалась: ${errorText || response.status}`,
        );
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    throw error;
  }
}

export async function deleteFile({
  basket,
  filename,
}: DeleteFileParams): Promise<void> {
  const url = `${API_BASE_PATH}/s3_storage/${encodeURIComponent(
    basket,
  )}/${encodeURIComponent(filename)}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ошибка удаления файла:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(
          errorData.detail?.[0]?.msg ||
            errorData.message ||
            `Удаление не удалось, статус ${response.status}`,
        );
      } catch {
        throw new Error(`Удаление не удалось: ${errorText || response.status}`);
      }
    }
  } catch (error) {
    console.error('Ошибка удаления файла:', error);
    throw error;
  }
}
