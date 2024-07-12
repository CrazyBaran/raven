import { pdf } from '@progress/kendo-drawing';
import { PaperSize } from '@progress/kendo-drawing/dist/npm/pdf';

export type PDFExportBaseField = {
  label: string;
  value: PDFExportBaseValueField;
  type?: 'url' | 'array';
};
export type PDFExportBaseValueField = {
  value: string;
  replacementValue: string;
};

export type PDFExportCategoryContainer = {
  label: string;
  items: PDFExportBaseField[];
};
export type PDFExportConfiguration = {
  title: PDFExportBaseField;
  headerSection: PDFExportCategoryContainer[];
  noteSections?: PDFExportCategoryContainer[];
};

export type PDFGeneralConfig = {
  paperSize: PaperSize;
  margin: string | number | pdf.PageMargin;
  scale: number;
};
