import { memo, useMemo } from 'react';
import { Document, Page } from 'react-pdf';

interface PdfThumbnailProps {
  file: File;
}

const PdfThumbnail = memo(
  ({ file }: PdfThumbnailProps) => {
    const documentComponent = useMemo(
      () => (
        <Document
          file={file}
          error={null}
          loading={null}
          noData={null}
          options={{
            cMapUrl: `//unpkg.com/pdfjs-dist@${
              // @ts-ignore
              globalThis.pdfjsLib?.version || '3.11.174'
            }/cmaps/`,
            cMapPacked: true,
            standardFontDataUrl: `//unpkg.com/pdfjs-dist@${
              // @ts-ignore
              globalThis.pdfjsLib?.version || '3.11.174'
            }/standard_fonts/`,
          }}
        >
          <Page
            height={130}
            key="pdf-page-1"
            pageNumber={1}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            width={91}
          />
        </Document>
      ),
      [file],
    );

    return documentComponent;
  },
  (prevProps, nextProps) => prevProps.file === nextProps.file,
);

PdfThumbnail.displayName = 'PdfThumbnail';

export default PdfThumbnail;
