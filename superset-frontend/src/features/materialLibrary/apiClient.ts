import { SupersetClient } from '@superset-ui/core';

const API_BASE_PATH = 'http://147.45.175.242:8088/api/library';

const API_TOKEN = 'fb46769d-d040-4cfc-ab9d-fa71e705e488';

// TODO: добавить ограничение для типов файлов
// TODO: добавить ограничение по максимальному размеру файла

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

/**
 * Загружает файл в S3 storage
 * @param params - параметры загрузки файла
 * @returns Promise с информацией о загруженном файле
 */
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

    console.log('0000000000 response ===', response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail?.[0]?.msg ||
          errorData.message ||
          `Upload failed with status ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Upload file error:', error);
    throw error;
  }
}

/**
 * Удаляет файл из S3 storage
 * @param params - параметры удаления файла
 */
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail?.[0]?.msg ||
          errorData.message ||
          `Delete failed with status ${response.status}`,
      );
    }
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
}
