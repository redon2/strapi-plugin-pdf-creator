export interface FileType {
  id?: any;
  documentId?: string;
  name?: string;
  ext?: string;
  mine?: string;
  hash?: string;
  description?: string;
  size?: number;
}
export interface FileResponse {
  results: FileType[];
}
export interface SettingsType {
  folder_id?: number;
  permissions?: string;
}
export interface TemplateType {
  id: any;
  enabled: boolean;
  documentId: string;
  name?: string;
  collectionName: string | '';
  file?: FileType;
}
