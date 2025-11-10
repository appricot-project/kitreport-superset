import { useCallback, useMemo, useState } from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { pdfjs } from 'react-pdf';
import { t } from '@superset-ui/core';
import { Loading } from '@superset-ui/core/components';
import { Button, List, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import {
  uploadPdfFile,
  mergePdfFiles,
  mergeAndSavePdfFiles,
  downloadPdfFile,
} from 'src/features/pdfReportBuilder/apiClient';
import {
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_MB,
  MAX_FILES_COUNT,
  MAX_TOTAL_SIZE,
  MAX_TOTAL_SIZE_MB,
} from 'src/features/pdfReportBuilder/constants';
import { arrayMove } from 'src/features/pdfReportBuilder//utils';
import {
  PageContainer,
  ContentHeader,
  ActionsBlock,
} from 'src/features/pdfReportBuilder/styles';
import FileListItem, {
  UploadedFileWithPreview,
} from 'src/features/pdfReportBuilder/FileListItem';
import FileUploadZone from 'src/features/pdfReportBuilder/FileUploadZone';
import FileListHeader from 'src/features/pdfReportBuilder/FileListHeader';

import 'src/features/pdfReportBuilder/sortable-helper.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PdfReportBuilder() {
  const [fileList, setFileList] = useState<UploadedFileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);

  const totalSize = fileList.reduce((sum, file) => sum + (file.size || 0), 0);
  const isUploading = uploading || uploadingCount > 0;

  const beforeUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      message.error(t('Можно загружать только PDF файлы'));
      return false;
    }

    if (fileList.length >= MAX_FILES_COUNT) {
      message.error(
        t(
          'Достигнуто максимальное количество файлов (%s). Удалите некоторые файлы перед загрузкой новых.',
          MAX_FILES_COUNT,
        ),
      );
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      message.error(
        t(
          'Размер файла превышает максимально допустимый (%s МБ). Размер вашего файла: %s МБ',
          MAX_FILE_SIZE_MB,
          (file.size / (1024 * 1024)).toFixed(2),
        ),
      );
      return false;
    }

    if (totalSize + file.size > MAX_TOTAL_SIZE) {
      message.error(
        t(
          'Добавление этого файла превысит максимальный общий размер (%s МБ). Текущий размер: %s МБ, размер файла: %s МБ',
          MAX_TOTAL_SIZE_MB,
          (totalSize / (1024 * 1024)).toFixed(2),
          (file.size / (1024 * 1024)).toFixed(2),
        ),
      );
      return false;
    }

    try {
      setUploadingCount(prev => prev + 1);
      const key = await uploadPdfFile(file);

      console.log('========================');
      console.log('beforeUpload - file === ', file);
      console.log('beforeUpload - key === ', key);

      setFileList(files => [
        ...files,
        { name: file.name, key, file, size: file.size },
      ]);
      message.success(t('Файл %s загружен', file.name));
    } catch (e: any) {
      message.error(t('Ошибка загрузки файла: %s', e.message));
    } finally {
      setUploadingCount(prev => prev - 1);
    }

    return false;
  };

  const onRemove = useCallback((index: number) => {
    setFileList(files => files.filter((_, i) => i !== index));
  }, []);

  const onPreview = useCallback(async (key: string) => {
    try {
      const blob = await downloadPdfFile(key);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (e: any) {
      message.error(t('Ошибка при открытии файла: %s', e.message));
    }
  }, []);

  const onDownload = useCallback(async (key: string, fileName: string) => {
    try {
      const blob = await downloadPdfFile(key);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      message.success(t('Файл %s скачан', fileName));
    } catch (e: any) {
      message.error(t('Ошибка при скачивании файла: %s', e.message));
    }
  }, []);

  const onRemoveAll = useCallback(() => {
    setFileList([]);
    message.success(t('Все файлы удалены'));
  }, []);

  const onSortStart = useCallback(() => {
    document.body.classList.add('dragging');
  }, []);

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
      document.body.classList.remove('dragging');
      if (oldIndex !== newIndex) {
        setFileList(files => arrayMove(files, oldIndex, newIndex));
      }
    },
    [],
  );

  const handleMerge = async () => {
    if (fileList.length < 2) {
      message.warning(t('Добавьте минимум два PDF файла'));
      return;
    }

    const keys = fileList.map(f => f.key);
    console.log('keys === ', keys);

    setUploading(true);
    try {
      const keys = fileList.map(f => f.key);
      const blob = await mergePdfFiles(keys);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
      message.success(t('Файл успешно собран и загружен'));
    } catch (e: any) {
      message.error(t('Ошибка при сборке PDF: %s', e.message));
    } finally {
      setUploading(false);
    }
  };

  const handleMergeAndSave = async () => {
    if (fileList.length < 2) {
      message.warning(t('Добавьте минимум два PDF файла'));
      return;
    }

    setUploading(true);
    try {
      const keys = fileList.map(f => f.key);
      const mergedKey = await mergeAndSavePdfFiles(keys);
      const blob = await downloadPdfFile(mergedKey);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged_saved.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
      message.success(t('Файл успешно собран, сохранён и загружен'));
    } catch (e: any) {
      message.error(t('Ошибка при сборке/сохранении PDF: %s', e.message));
    } finally {
      setUploading(false);
    }
  };

  const SortableList = useMemo(
    () =>
      SortableContainer(({ items }: { items: UploadedFileWithPreview[] }) => (
        <List
          bordered
          dataSource={items}
          locale={{ emptyText: t('Нет выбранных файлов') }}
          renderItem={(file, idx) => (
            <FileListItem
              key={file.key}
              index={idx}
              file={file}
              idx={idx}
              onPreview={onPreview}
              onDownload={onDownload}
              onRemove={onRemove}
            />
          )}
          style={{
            marginTop: 12,
            marginBottom: 24,
            overflow: 'visible',
            padding: '16px',
            borderRadius: '12px',
            background: '#fafbfc',
          }}
        />
      )),
    [onPreview, onDownload, onRemove],
  );

  return (
    <PageContainer>
      <ContentHeader>
        <h1>{t('Сборка отчёта из PDF файлов')}</h1>
      </ContentHeader>

      <FileUploadZone beforeUpload={beforeUpload} disabled={isUploading} />

      {isUploading && <Loading />}

      {fileList.length > 0 && (
        <FileListHeader
          fileCount={fileList.length}
          totalSize={totalSize}
          onRemoveAll={onRemoveAll}
          disabled={isUploading}
        />
      )}

      <SortableList
        distance={5}
        helperClass="sortable-helper"
        items={fileList}
        lockAxis="y"
        onSortEnd={onSortEnd}
        onSortStart={onSortStart}
      />

      <ActionsBlock>
        <Button
          disabled={fileList.length < 2 || isUploading}
          icon={<UploadOutlined />}
          loading={uploading}
          type="primary"
          onClick={handleMerge}
        >
          {t('Собрать и скачать PDF')}
        </Button>
        <Button
          disabled={fileList.length < 2 || isUploading}
          icon={<UploadOutlined />}
          loading={uploading}
          style={{ background: '#fff' }}
          onClick={handleMergeAndSave}
        >
          {t('Собрать, сохранить и скачать PDF')}
        </Button>
      </ActionsBlock>
    </PageContainer>
  );
}
