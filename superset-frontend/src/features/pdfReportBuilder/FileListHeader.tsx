import { Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { t } from '@apache-superset/core';

import { ClearAllButton, FileListInfo } from './styles';
import { formatFileSize } from './utils';

interface FileListHeaderProps {
  disabled: boolean;
  fileCount: number;
  totalSize: number;
  onRemoveAll: () => void;
}

export default function FileListHeader({
  disabled,
  fileCount,
  totalSize,
  onRemoveAll,
}: FileListHeaderProps) {
  return (
    <>
      <FileListInfo>
        <div className="info-item">
          <span>{t('Загружено файлов:')}</span>
          <strong>{fileCount}</strong>
        </div>
        <div className="info-item">
          <span>{t('Общий размер:')}</span>
          <strong>{formatFileSize(totalSize)}</strong>
        </div>
      </FileListInfo>
      <Popconfirm
        cancelText={t('Нет')}
        description={t('Это действие нельзя отменить.')}
        okText={t('Да')}
        placement="topRight"
        title={t('Вы уверены, что хотите удалить все файлы?')}
        onConfirm={onRemoveAll}
      >
        <ClearAllButton
          disabled={disabled}
          icon={<DeleteOutlined />}
          size="middle"
        >
          {t('Удалить все файлы')}
        </ClearAllButton>
      </Popconfirm>
    </>
  );
}
