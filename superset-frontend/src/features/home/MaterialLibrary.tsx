import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { t, styled } from '@superset-ui/core';
import { EmptyState, Loading } from '@superset-ui/core/components';

import { TableTab } from 'src/views/CRUD/types';
import withToasts from 'src/components/MessageToasts/withToasts';
import { useMaterialManifest } from 'src/features/materialLibrary/useMaterialManifest';
import {
  isMaterialTab,
  MaterialTab,
  TAB_MAP,
  MaterialLibraryItem,
} from 'src/features/materialLibrary/types';
import {
  findFolderByCategory,
  formatDateToLocale,
  formatSize,
} from 'src/features/materialLibrary/utils';
import SubMenu from './SubMenu';

const TopBar = styled.div`
  // display: flex;
  // align-items: flex-start;
  // justify-content: space-between;
  // gap: 4px;
`;

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

function MaterialLibrary() {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState<MaterialTab>(TableTab.Strategic);
  const { data, isLoading } = useMaterialManifest();

  console.log('data ===', data);

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

  const folder = isMaterialTab(activeTab)
    ? findFolderByCategory(data, activeTab)
    : undefined;

  return (
    <>
      <TopBar>
        <SubMenu
          activeChild={activeTab}
          backgroundColor="transparent"
          tabs={menuTabs}
          // TODO: показывать кнопку только админу
          buttons={[
            {
              name: t('Посмотреть все'),
              buttonStyle: 'link',
              onClick: () => {
                history.push('/material-library/list');
              },
            },
          ]}
        />
      </TopBar>

      {isLoading && <Loading />}

      {!folder?.items?.length && !isLoading && (
        <EmptyState
          title={t('Нет доступных материалов')}
          description={t('В данный момент нет информации для отображения.')}
        />
      )}

      {!!folder?.items?.length && (
        <CardGrid>
          {folder.items.map((item: MaterialLibraryItem) => (
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
