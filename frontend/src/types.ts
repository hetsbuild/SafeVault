export interface Folder {
  _id: string;
  userId?: string;
  title: string;
  desc: string;
  isPrivate: boolean;
  parentId?: string | null;
  notes?: Note[];
  folders?: Folder[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isDeleted?: boolean;
}

export interface Note {
  userId?: string;
  isPrivate: boolean;
  _id: string;
  desc: string;
  title: string;
  parentId?: string | null;
  files_url: {
    file_type: string;
    url: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isDeleted?: boolean;
}