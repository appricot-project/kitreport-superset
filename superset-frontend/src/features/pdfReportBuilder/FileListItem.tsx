import { memo } from 'react';
import { Space, Popconfirm } from 'antd';
import { SortableElement } from 'react-sortable-hoc';
import { t } from '@apache-superset/core';
import {
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { UploadedFile } from './apiClient';
import {
  StyledListItem,
  FileItem,
  FileNumber,
  PdfPreviewWrapper,
  FileInfo,
  FileNameText,
  FileSizeText,
  PreviewButton,
  DownloadButton,
  DeleteButton,
} from './styles';
import { formatFileSize } from './utils';
import PdfThumbnail from './PdfThumbnail';

type UploadedFileWithPreview = UploadedFile & { file?: File; size?: number };

interface FileListItemProps {
  file: UploadedFileWithPreview;
  idx: number;
  onPreview: (key: string) => void;
  onDownload: (key: string, fileName: string) => void;
  onRemove: (index: number) => void;
}

const BaseFileListItem = memo(
  ({ file, idx, onPreview, onDownload, onRemove }: FileListItemProps) => (
    <StyledListItem>
      <FileItem>
        <FileNumber>{idx + 1}</FileNumber>
        {file.file && (
          <PdfPreviewWrapper>
            <PdfThumbnail file={file.file} />
          </PdfPreviewWrapper>
        )}
        <FileInfo>
          <FileNameText>{file.name}</FileNameText>
          {file.size && (
            <FileSizeText>{formatFileSize(file.size)}</FileSizeText>
          )}
        </FileInfo>
        <Space>
          <PreviewButton
            icon={<EyeOutlined />}
            size="middle"
            title={t('Открыть в новой вкладке')}
            onClick={() => onPreview(file.key)}
          />
          <DownloadButton
            icon={<DownloadOutlined />}
            size="middle"
            title={t('Скачать файл')}
            onClick={() => onDownload(file.key, file.name)}
          />
          <Popconfirm
            title={t('Удалить этот файл?')}
            description={t('Файл "%s" будет удалён из списка', file.name)}
            onConfirm={() => onRemove(idx)}
            okText={t('Да')}
            cancelText={t('Нет')}
            placement="left"
          >
            <DeleteButton
              icon={<DeleteOutlined />}
              size="middle"
              title={t('Удалить файл')}
            />
          </Popconfirm>
        </Space>
      </FileItem>
    </StyledListItem>
  ),
  (prevProps, nextProps) =>
    prevProps.file.key === nextProps.file.key &&
    prevProps.file.file === nextProps.file.file &&
    prevProps.idx === nextProps.idx &&
    prevProps.onPreview === nextProps.onPreview &&
    prevProps.onDownload === nextProps.onDownload &&
    prevProps.onRemove === nextProps.onRemove,
);

BaseFileListItem.displayName = 'BaseFileListItem';

const FileListItem = SortableElement(BaseFileListItem);

export default FileListItem;
export type { UploadedFileWithPreview };
