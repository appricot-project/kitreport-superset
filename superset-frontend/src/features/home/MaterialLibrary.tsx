import { useState, useEffect } from 'react';
import { t, styled } from '@superset-ui/core';
import { EmptyState, Loading } from '@superset-ui/core/components';

import { TableTab } from 'src/views/CRUD/types';
import withToasts from 'src/components/MessageToasts/withToasts';
import SubMenu from './SubMenu';

const mockMaterialData = {
  folders: [
    {
      title: 'Стратегический уровень',
      items: [
        {
          title: 'Стратегический-1.pdf',
          size_in_bytes: '395000',
          url: 'https://s3.twcstorage.ru/85c86d18-kitreport-document-library/%D0%90%D0%BD%D0%B0%D0%BB%D0%B8%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0_%C2%AB%D0%A2%D1%80%D0%B8_%D0%9A%D0%B8%D1%82%D0%B0%C2%BB_%D0%B2%D0%B0%D1%80_1.pdf',
          published_at: '2025-08-04T10:00:00Z',
        },
        {
          title: 'Стратегический-2.pdf',
          size_in_bytes: '100000',
          url: 'https://s3.twcstorage.ru/85c86d18-kitreport-document-library/%D0%90%D0%BD%D0%B0%D0%BB%D0%B8%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0_%C2%AB%D0%A2%D1%80%D0%B8_%D0%9A%D0%B8%D1%82%D0%B0%C2%BB_%D0%B2%D0%B0%D1%80_1.pdf',
          published_at: '2025-01-01T01:00:00Z',
        },
      ],
    },
    {
      title: 'Операционный уровень',
      items: [
        {
          title: 'Операционный-1.pdf',
          size_in_bytes: '395000',
          url: 'https://s3.twcstorage.ru/85c86d18-kitreport-document-library/%D0%90%D0%BD%D0%B0%D0%BB%D0%B8%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0_%C2%AB%D0%A2%D1%80%D0%B8_%D0%9A%D0%B8%D1%82%D0%B0%C2%BB_%D0%B2%D0%B0%D1%80_1.pdf',
          published_at: '2025-08-04T10:00:00Z',
        },
        {
          title: 'Операционный-2.pdf',
          size_in_bytes: '100000',
          url: 'https://s3.twcstorage.ru/85c86d18-kitreport-document-library/%D0%90%D0%BD%D0%B0%D0%BB%D0%B8%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0_%C2%AB%D0%A2%D1%80%D0%B8_%D0%9A%D0%B8%D1%82%D0%B0%C2%BB_%D0%B2%D0%B0%D1%80_1.pdf',
          published_at: '2025-01-01T01:00:00Z',
        },
      ],
    },
    {
      title: 'Уровень компании',
      items: [
        {
          title: 'Уровень-компании-1.pdf',
          size_in_bytes: '395000',
          url: 'https://s3.twcstorage.ru/85c86d18-kitreport-document-library/%D0%90%D0%BD%D0%B0%D0%BB%D0%B8%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0_%C2%AB%D0%A2%D1%80%D0%B8_%D0%9A%D0%B8%D1%82%D0%B0%C2%BB_%D0%B2%D0%B0%D1%80_1.pdf',
          published_at: '2025-08-04T10:00:00Z',
        },
        {
          title: 'Уровень-компании-2.pdf',
          size_in_bytes: '100000',
          url: 'https://s3.twcstorage.ru/85c86d18-kitreport-document-library/%D0%90%D0%BD%D0%B0%D0%BB%D0%B8%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0_%C2%AB%D0%A2%D1%80%D0%B8_%D0%9A%D0%B8%D1%82%D0%B0%C2%BB_%D0%B2%D0%B0%D1%80_1.pdf',
          published_at: '2025-01-01T01:00:00Z',
        },
      ],
    },
  ],
};

const CardGrid = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  margin-top: 16px;
`;

const MaterialCard = styled.a`
  display: block;

  background: ${({ theme }) => theme.colorBgElevated};
  border: 1px solid ${({ theme }) => theme.colorBorder};
  border-radius: 8px;
  padding: 16px;
  min-width: 220px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  cursor: pointer;

  text-decoration: none;
  color: inherit;

  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: ${({ theme }) => theme.boxShadowSecondary};
  }

  .card-title {
    margin-bottom: 8px;

    font-weight: 600;
  }
`;

const TopBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 4px;
`;

const formatSize = (bytes: string) => {
  const num = Number(bytes);
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;

  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
};

function formatDateToLocale(date: string) {
  return new Date(date).toLocaleDateString();
}

const TAB_MAP: {
  [key in
    | TableTab.Strategic
    | TableTab.Operating
    | TableTab.CompanyLevel]: string;
} = {
  [TableTab.Strategic]: 'Стратегический уровень',
  [TableTab.Operating]: 'Операционный уровень',
  [TableTab.CompanyLevel]: 'Уровень компании',
};

type MaterialTab =
  | TableTab.Strategic
  | TableTab.Operating
  | TableTab.CompanyLevel;

const isMaterialTab = (tab: TableTab): tab is MaterialTab => {
  return (
    tab === TableTab.Strategic ||
    tab === TableTab.Operating ||
    tab === TableTab.CompanyLevel
  );
};

export interface MaterialLibraryData {
  folders: {
    title: string;
    items: {
      title: string;
      size_in_bytes: string;
      url: string;
      published_at: string;
    }[];
  }[];
}

const URL =
  'https://s3.twcstorage.ru/85c86d18-kitreport-document-library/manifest.json';

function useMaterialManifest() {
  const [data, setData] = useState<MaterialLibraryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch(URL)
      .then(response => response.json())
      .then(json => {
        if (isMounted) setData(json);
      })
      .catch(() => {
        if (isMounted) setData(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading };
}

function MaterialLibrary() {
  const [activeTab, setActiveTab] = useState<MaterialTab>(TableTab.Strategic);
  // const data = mockMaterialData;
  // const isLoading = false;
  const { data, isLoading } = useMaterialManifest();

  const menuTabs = [
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

  const folder =
    isMaterialTab(activeTab) && data
      ? data.folders.find(folder => folder.title === TAB_MAP[activeTab])
      : undefined;

  return (
    <>
      <TopBar>
        <SubMenu
          activeChild={activeTab}
          backgroundColor="transparent"
          tabs={menuTabs}
        />
      </TopBar>

      {isLoading && <Loading />}

      {!folder?.items?.length && !isLoading && (
        <EmptyState title={t('Нет доступных материалов')} />
      )}

      {!!folder?.items?.length && (
        <CardGrid>
          {folder.items.map(item => (
            <MaterialCard
              key={item.title}
              title={t('Открыть материал')}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="card-title">{item.title}</div>
              <div>
                {t('Дата публикации')}: {formatDateToLocale(item.published_at)}
              </div>
              <div>
                {t('Размер')}: {formatSize(item.size_in_bytes)}
              </div>
            </MaterialCard>
          ))}
        </CardGrid>
      )}
    </>
  );
}

export default withToasts(MaterialLibrary);
