import { Document, Page } from 'react-pdf';
import { Space, Popconfirm } from 'antd';
import { SortableElement } from 'react-sortable-hoc';
import { t } from '@superset-ui/core';
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

type UploadedFileWithPreview = UploadedFile & { file?: File; size?: number };

interface FileListItemProps {
  file: UploadedFileWithPreview;
  idx: number;
  onPreview: (key: string) => void;
  onDownload: (key: string, fileName: string) => void;
  onRemove: (index: number) => void;
}

const FileListItem = SortableElement(
  ({ file, idx, onPreview, onDownload, onRemove }: FileListItemProps) => (
    <StyledListItem>
      <FileItem>
        <FileNumber>{idx + 1}</FileNumber>
        {file.file && (
          <PdfPreviewWrapper>
            <Document
              file={file.file}
              error={null}
              loading={null}
              noData={null}
            >
              <Page
                height={130}
                pageNumber={1}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                width={91}
              />
            </Document>
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
);

export default FileListItem;
export type { UploadedFileWithPreview };
