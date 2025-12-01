export interface MaterialDTO {
  id?: number;
  tipo: 'PDF' | 'VIDEO' | 'QUIZ';
  url: string;
  leccionId?: number;
  leccionTitulo?: string;
}