import { Upload } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import { t } from '@apache-superset/core';

import { MAX_FILES_COUNT, MAX_FILE_SIZE_MB } from './constants';

interface FileUploadZoneProps {
  disabled: boolean;
  beforeUpload: (file: File) => Promise<boolean>;
}

export default function FileUploadZone({
  disabled,
  beforeUpload,
}: FileUploadZoneProps) {
  return (
    <Upload.Dragger
      accept=".pdf"
      beforeUpload={beforeUpload}
      disabled={disabled}
      fileList={[]}
      multiple
      showUploadList={false}
      style={{
        marginBottom: 32,
        maxHeight: 250,
        minHeight: 120,
        overflow: 'auto',
        borderRadius: 12,
        background: '#f8fafc',
        border: '1.5px dashed #bdbdbd',
      }}
    >
      <p className="ant-upload-drag-icon">
        <FilePdfOutlined style={{ color: '#cf222e', fontSize: 38 }} />
      </p>
      <p
        className="ant-upload-text"
        style={{ fontSize: '1.1em', fontWeight: 500 }}
      >
        {t('Перетащите PDF файлы или кликните для выбора')}
      </p>
      <p
        className="ant-upload-hint"
        style={{ color: '#888', fontSize: '0.98em' }}
      >
        {t(
          'Можно добавить до %s файлов. Максимальный размер файла: %s МБ',
          MAX_FILES_COUNT,
          MAX_FILE_SIZE_MB,
        )}
      </p>
    </Upload.Dragger>
  );
}
