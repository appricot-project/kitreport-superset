import { useState, useEffect } from 'react';
import { t, styled } from '@superset-ui/core';
import { EmptyState } from '@superset-ui/core/components';
import {
  Button,
  Modal,
  Upload,
  Table,
  Space,
  Popconfirm,
  Select,
  Tooltip,
} from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import withToasts from 'src/components/MessageToasts/withToasts';
import SubMenu from 'src/features/home/SubMenu';
import { TableTab } from 'src/views/CRUD/types';
import { useMaterialManifest } from 'src/features/materialLibrary/useMaterialManifest';
import {
  ALL_TAB,
  BASKET_MAP,
  MaterialTab,
  TAB_MAP,
  MaterialLibraryFolder,
} from 'src/features/materialLibrary/types';
import {
  extractBasketAndFilenameFromUrl,
  filterDocumentsByCategory,
  formatSize,
  transformManifestToDocuments,
} from 'src/features/materialLibrary/utils';
import { deleteFile, uploadFile } from 'src/features/materialLibrary/apiClient';

export const ALLOWED_FILE_TYPES = '.pdf,.doc,.docx,.txt';
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_FILE_SIZE = 50 * 1024 * 1024;
export const MAX_FILE_SIZE_MB = MAX_FILE_SIZE / (1024 * 1024);

const PageContainer = styled.div`
  padding: 24px;
  background: ${({ theme }) => theme.colorBgLayout};
  min-height: calc(100vh - 64px);

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 16px;

    h1 {
      font-size: 20px;
      margin: 0;
    }

    button {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 18px;
    }
  }
`;

const NoPaddingButton = styled(Button)`
  padding: 0 !important;
  height: auto;
  min-height: 24px;
  font-size: 13px;

  @media (max-width: 768px) {
    min-height: 44px;
    font-size: 14px;
  }
`;

const ActionsWrapper = styled(Space)`
  @media (max-width: 768px) {
    flex-direction: column !important;
    gap: 4px !important;
  }
`;

const ResponsiveModal = styled(Modal)`
  @media (max-width: 768px) {
    max-width: calc(100vw - 32px) !important;
    margin: 16px auto;

    .ant-modal-body {
      padding: 16px;
    }

    .ant-select-selector {
      height: 44px !important;
      line-height: 44px !important;
    }

    .ant-select-selection-item {
      line-height: 44px !important;
    }
  }

  @media (max-width: 480px) {
    max-width: calc(100vw - 16px) !important;
    margin: 8px auto;

    .ant-modal-body {
      padding: 12px;
    }
  }
`;

const TableWrapper = styled.div`
  @media (max-width: 768px) {
    .ant-table-pagination {
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center !important;

      .ant-pagination-total-text {
        flex-basis: 100%;
        text-align: center;
        order: -1;
      }
    }

    .ant-table-thead > tr > th {
      padding: 12px 8px;
      font-size: 13px;
    }

    .ant-table-tbody > tr > td {
      padding: 12px 8px;
      font-size: 13px;
    }
  }

  @media (max-width: 480px) {
    .ant-table-thead > tr > th {
      padding: 10px 6px;
      font-size: 12px;
    }

    .ant-table-tbody > tr > td {
      padding: 10px 6px;
      font-size: 12px;
    }

    .ant-pagination-options {
      display: none;
    }
  }

  .ant-table-thead > tr > th {
    word-break: keep-all;
    white-space: normal;
  }

  .ant-table-cell {
    > span {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

interface Document {
  id: string;
  title: string;
  category: string;
  size_in_bytes: number;
  url: string;
  published_at: string;
}

interface MaterialLibraryListProps {
  addDangerToast: (message: string) => void;
  addSuccessToast: (message: string) => void;
}

function MaterialLibraryList({
  addDangerToast,
  addSuccessToast,
}: MaterialLibraryListProps) {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<MaterialTab>(ALL_TAB);
  const [selectedUploadTab, setSelectedUploadTab] =
    useState<MaterialTab | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { data, isLoading, refetch } = useMaterialManifest();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuTabs = [
    {
      name: ALL_TAB,
      label: TAB_MAP[ALL_TAB],
      onClick: () => setActiveTab(ALL_TAB),
    },
    {
      name: TableTab.Strategic,
      label: TAB_MAP[TableTab.Strategic],
      onClick: () => setActiveTab(TableTab.Strategic),
    },
    {
      name: TableTab.Operating,
      label: TAB_MAP[TableTab.Operating],
      onClick: () => setActiveTab(TableTab.Operating),
    },
    {
      name: TableTab.CompanyLevel,
      label: TAB_MAP[TableTab.CompanyLevel],
      onClick: () => setActiveTab(TableTab.CompanyLevel),
    },
  ];

  const allDocuments = transformManifestToDocuments(data);
  const filteredDocuments = filterDocumentsByCategory(allDocuments, activeTab);

  const handleUpload = async (file: File, uploadCategory?: MaterialTab) => {
    const uploadTab = uploadCategory || activeTab;
    if (!uploadTab || uploadTab === ALL_TAB) {
      addDangerToast(t('Пожалуйста, выберите категорию для загрузки файла'));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      addDangerToast(
        t(
          'Размер файла превышает максимально допустимый (%s МБ). Размер вашего файла: %s МБ',
          MAX_FILE_SIZE_MB,
          (file.size / (1024 * 1024)).toFixed(2),
        ),
      );
      return;
    }

    setUploading(true);
    try {
      const basket = BASKET_MAP[uploadTab];
      await uploadFile({
        basket,
        file,
        filename: file.name,
      });
      addSuccessToast(
        t(
          'Документ "%s" успешно загружен в категорию "%s"',
          file.name,
          TAB_MAP[uploadTab],
        ),
      );
      setUploadModalVisible(false);
      setSelectedUploadTab(null);
      if (refetch) refetch();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      addDangerToast(t('Не удалось загрузить документ: %s', errorMessage));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (document: Document) => {
    try {
      const { basket, filename } = extractBasketAndFilenameFromUrl(
        document.url,
      );

      if (!basket || !filename) {
        throw new Error('Не удалось определить корзину или имя файла');
      }

      await deleteFile({
        basket,
        filename,
      });

      addSuccessToast(t('Документ "%s" успешно удален', document.title));

      if (refetch) {
        refetch();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      addDangerToast(t('Не удалось удалить документ: %s', errorMessage));
    }
  };

  const columns: ColumnsType<Document> = [
    {
      title: t('Название'),
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      ellipsis: {
        showTitle: false,
      },
      render: (title: string) => (
        <Tooltip title={title} placement="topLeft">
          <span>{title}</span>
        </Tooltip>
      ),
      width: '40%',
    },
    {
      title: t('Категория'),
      dataIndex: 'category',
      key: 'category',
      filters:
        activeTab === ALL_TAB
          ? data?.folders.map((folder: MaterialLibraryFolder) => ({
              text: folder.title,
              value: folder.title,
            }))
          : undefined,
      onFilter: (value, record) => record.category === value,
      responsive: ['md'] as Array<'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'>,
      ellipsis: {
        showTitle: false,
      },
      render: (category: string) => (
        <Tooltip title={category}>
          <span>{category}</span>
        </Tooltip>
      ),
      width: '18%',
    },
    {
      title: t('Размер'),
      dataIndex: 'size_in_bytes',
      key: 'size',
      render: (size: number) => formatSize(size),
      sorter: (a, b) => a.size_in_bytes - b.size_in_bytes,
      responsive: ['lg'] as Array<'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'>,
      width: 100,
      align: 'right' as const,
    },
    {
      title: t('Дата публикации'),
      dataIndex: 'published_at',
      key: 'published_at',
      render: (date: string) => {
        const dateObj = new Date(date);
        const formatted = dateObj.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        const fullDate = dateObj.toLocaleString('ru-RU', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        return (
          <Tooltip title={fullDate}>
            <span>{formatted}</span>
          </Tooltip>
        );
      },
      sorter: (a, b) =>
        new Date(a.published_at).getTime() - new Date(b.published_at).getTime(),
      responsive: ['sm'] as Array<'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'>,
      width: 135,
    },
    {
      title: t('Actions'),
      key: 'actions',
      render: (_, record) => (
        <ActionsWrapper size={8}>
          <NoPaddingButton
            href={record.url}
            rel="noopener noreferrer"
            target="_blank"
            type="link"
          >
            {t('Посмотреть')}
          </NoPaddingButton>
          <Popconfirm
            cancelText={t('Нет')}
            okText={t('Да')}
            title={t('Вы уверены, что хотите удалить этот документ?')}
            onConfirm={() => handleDelete(record)}
            placement="left"
            overlayStyle={{
              maxWidth: 240,
              minWidth: 180,
              whiteSpace: 'normal',
            }}
            getPopupContainer={trigger =>
              trigger.parentElement || document.body
            }
          >
            <NoPaddingButton
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              {t('Удалить')}
            </NoPaddingButton>
          </Popconfirm>
        </ActionsWrapper>
      ),
    },
  ];

  const isUploadDisabled =
    uploading || (activeTab === ALL_TAB && !selectedUploadTab);

  return (
    <>
      <PageContainer>
        <>
          <ContentHeader>
            <h1>{t('Управление библиотекой материалов')}</h1>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => {
                setUploadModalVisible(true);
                setSelectedUploadTab(activeTab !== ALL_TAB ? activeTab : null);
              }}
            >
              {t('Загрузить документ')}
            </Button>
          </ContentHeader>

          <SubMenu
            activeChild={activeTab}
            backgroundColor="transparent"
            tabs={menuTabs}
          />
        </>

        {!filteredDocuments.length && !isLoading && (
          <EmptyState
            title={t('Нет доступных материалов')}
            description={t('В данный момент нет информации для отображения.')}
          />
        )}

        {!!filteredDocuments.length && (
          <TableWrapper>
            <Table
              columns={columns}
              dataSource={filteredDocuments}
              loading={isLoading}
              scroll={{ x: 800 }}
              pagination={{
                pageSize: DEFAULT_PAGE_SIZE,
                showSizeChanger: !isMobile,
                showQuickJumper: !isMobile,
                showTotal: (total, range) =>
                  t('%s-%s из %s материалов', range[0], range[1], total),
                responsive: true,
                simple: isMobile,
              }}
              rowKey="id"
            />
          </TableWrapper>
        )}

        <ResponsiveModal
          footer={null}
          open={uploadModalVisible}
          title={t('Загрузить документ')}
          onCancel={() => {
            setUploadModalVisible(false);
            setSelectedUploadTab(null);
          }}
        >
          {activeTab === ALL_TAB && (
            <Select
              style={{ width: '100%', marginBottom: 16 }}
              placeholder={t('Выберите категорию')}
              value={selectedUploadTab ?? undefined}
              onChange={value => setSelectedUploadTab(value as MaterialTab)}
              options={[
                {
                  value: TableTab.Strategic,
                  label: TAB_MAP[TableTab.Strategic],
                },
                {
                  value: TableTab.Operating,
                  label: TAB_MAP[TableTab.Operating],
                },
                {
                  value: TableTab.CompanyLevel,
                  label: TAB_MAP[TableTab.CompanyLevel],
                },
              ]}
            />
          )}
          <Upload.Dragger
            accept={ALLOWED_FILE_TYPES}
            beforeUpload={file => {
              if (activeTab === ALL_TAB && !selectedUploadTab) {
                addDangerToast(
                  t('Пожалуйста, выберите категорию для загрузки файла'),
                );
                return false;
              }
              handleUpload(
                file,
                activeTab === ALL_TAB
                  ? (selectedUploadTab ?? undefined)
                  : undefined,
              );
              return false;
            }}
            disabled={isUploadDisabled}
            maxCount={1}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">
              {t('Нажмите или перетащите файл для загрузки')}
            </p>
            <p className="ant-upload-hint">
              {t(
                'Поддержка файлов PDF, DOC, DOCX, TXT. Максимальный размер: %s МБ',
                MAX_FILE_SIZE_MB,
              )}
            </p>
          </Upload.Dragger>
        </ResponsiveModal>
      </PageContainer>
    </>
  );
}

export default withToasts(MaterialLibraryList);
