import { useState } from 'react';
import { t, styled } from '@superset-ui/core';
import { EmptyState } from '@superset-ui/core/components';
import { Button, Modal, Upload, Table, Space, Popconfirm, Select } from 'antd';
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

const PageContainer = styled.div`
  padding: 24px;
  background: ${({ theme }) => theme.colorBgLayout};
  min-height: calc(100vh - 64px);
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const NoPaddingButton = styled(Button)`
  padding: 0 !important;
  height: auto;
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

  const { data, isLoading, refetch } = useMaterialManifest();

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

  const handleUpload = async (file: File, uploadCategory?: MaterialTa) => {
    const uploadTab = uploadCategory || activeTab;
    if (!uploadTab || uploadTab === ALL_TAB) {
      addDangerToast(t('Пожалуйста, выберите категорию для загрузки файла'));
      return;
    }

    setUploading(true);
    try {
      const basket = BASKET_MAP[activeTab];
      await uploadFile({
        basket,
        file,
        filename: file.name,
      });
      addSuccessToast(
        t('Документ "%s" успешно загружен в категорию "%s"', file.name, basket),
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
    },
    {
      title: t('Категория'),
      dataIndex: 'category',
      key: 'category',
      filters:
        activeTab === ALL_TAB
          ? // TODO: исправить тип
            data?.folders.map((folder: any) => ({
              text: folder.title,
              value: folder.title,
            }))
          : undefined,
      onFilter: (value, record) => record.category === value,
    },
    {
      title: t('Размер'),
      dataIndex: 'size_in_bytes',
      key: 'size',
      render: (size: number) => formatSize(size),
      sorter: (a, b) => a.size_in_bytes - b.size_in_bytes,
    },
    {
      title: t('Дата публикации'),
      dataIndex: 'published_at',
      key: 'published_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) =>
        new Date(a.published_at).getTime() - new Date(b.published_at).getTime(),
    },
    {
      title: t('Actions'),
      key: 'actions',
      render: (_, record) => (
        <Space direction="vertical" size={4}>
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
        </Space>
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
          <Table
            columns={columns}
            dataSource={filteredDocuments}
            loading={isLoading}
            pagination={{
              pageSize: DEFAULT_PAGE_SIZE,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                t('%s-%s из %s материалов', range[0], range[1], total),
            }}
            rowKey="id"
          />
        )}

        <Modal
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
                activeTab === ALL_TAB ? selectedUploadTab : undefined,
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
              {t('Поддержка файлов PDF, DOC, DOCX, TXT')}
            </p>
          </Upload.Dragger>
        </Modal>
      </PageContainer>
    </>
  );
}

export default withToasts(MaterialLibraryList);
