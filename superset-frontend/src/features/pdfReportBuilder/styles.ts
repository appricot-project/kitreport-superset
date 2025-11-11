import styled from '@emotion/styled';
import { Button, List } from 'antd';

export const PageContainer = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 10px auto;
  padding: 24px 24px 80px 24px;
  background: ${({ theme }) => theme.colorBgLayout};
  border-radius: 18px;
  box-sizing: border-box;

  @media (max-width: 1200px) {
    max-width: 98vw;
    padding: 24px 8px 60px 8px;
  }

  @media (max-width: 600px) {
    padding: 12px 2vw 40px 2vw;
    border-radius: 8px;
  }
`;

export const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  margin-bottom: 24px;

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

export const StyledListItem = styled(List.Item)`
  margin-bottom: 8px !important;
  background: ${({ theme }) => theme.colorBgElevated || '#fafbfc'};
  border-radius: 10px;
  box-shadow: 0 1px 4px #0001;

  transition:
    background 0.18s,
    box-shadow 0.18s;
  cursor: grab;

  &:hover {
    background: ${({ theme }) => theme.colorPrimaryBgHover || '#f0f4ff'};
    box-shadow: 0 2px 12px #0002;
  }

  &:active {
    cursor: grabbing;
  }
`;

export const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  width: 100%;
  padding: 12px 0 12px 0;
`;

export const FileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;

  margin-left: 8px;
`;

export const FileNameText = styled.span`
  font-size: 1.08em;
  font-weight: 500;
  color: #222;
  word-break: break-all;
`;

export const FileSizeText = styled.span`
  font-size: 0.85em;
  font-weight: 400;
  color: #888;
`;

export const FileNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  margin-right: 12px;
  box-shadow: 0 2px 6px rgba(23, 101, 216, 0.25);
  min-width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #1765d8 0%, #0d47a1 100%);
  color: white;
  border-radius: 8px;

  font-weight: 700;
  font-size: 0.95em;
`;

export const PdfPreviewWrapper = styled.div`
  flex-shrink: 0;
  margin-right: 12px;
  border-radius: 6px;
  overflow: hidden;
  border: 1.5px solid #e0e0e0;
  box-shadow: 0 1px 6px #0001;

  @media (max-width: 600px) {
    margin-right: 8px;
    margin-bottom: 12px;
    width: 42px !important;
    height: auto !important;
  }
`;

export const DeleteButton = styled(Button)`
  background: #fff !important;
  color: #cf222e !important;
  border: 1.5px solid #f0f0f0 !important;
  box-shadow: 0 1px 4px #0001 !important;

  transition: all 0.2s ease !important;

  &:hover {
    background: #fff5f5 !important;
    border-color: #ffcdd2 !important;
    box-shadow: 0 2px 8px rgba(207, 34, 46, 0.15) !important;

    color: #b71c1c !important;

    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const PreviewButton = styled(Button)`
  background: #fff !important;
  border: 1.5px solid #f0f0f0 !important;
  box-shadow: 0 1px 4px #0001 !important;

  color: #1765d8 !important;

  transition: all 0.2s ease !important;

  &:hover {
    background: #f0f4ff !important;
    border-color: #bdd7ff !important;
    box-shadow: 0 2px 8px rgba(23, 101, 216, 0.15) !important;

    color: #0d47a1 !important;

    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const DownloadButton = styled(Button)`
  background: #fff !important;
  border: 1.5px solid #f0f0f0 !important;
  box-shadow: 0 1px 4px #0001 !important;

  color: #2e7d32 !important;

  transition: all 0.2s ease !important;

  &:hover {
    background: #f1f8f4 !important;
    border-color: #a5d6a7 !important;
    box-shadow: 0 2px 8px rgba(46, 125, 50, 0.15) !important;

    color: #1b5e20 !important;

    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const ActionsBlock = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;

  margin-top: 32px;
  margin-bottom: 32px;

  & > button {
    min-width: 180px;

    font-weight: 600;
    font-size: 1.05em;
  }

  & > button:last-child {
    min-width: 220px;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 12px;

    & > button {
      width: 100%;
      min-width: 0;
    }
  }
`;

export const ClearAllButton = styled(Button)`
  background: #fff !important;
  color: #cf222e !important;
  border: 1.5px solid #f0f0f0 !important;
  box-shadow: 0 1px 4px #0001 !important;
  margin-bottom: 16px !important;

  transition: all 0.2s ease !important;

  &:hover {
    background: #fff5f5 !important;
    border-color: #ffcdd2 !important;
    box-shadow: 0 2px 8px rgba(207, 34, 46, 0.15) !important;
    color: #b71c1c !important;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const FileListInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 12px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colorBgElevated || '#f8fafc'};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colorBorder || '#e0e0e0'};

  font-size: 0.95em;
  color: #555;

  .info-item {
    display: flex;
    align-items: center;
    gap: 8px;

    strong {
      font-weight: 600;
      color: #1765d8;
    }
  }
`;
