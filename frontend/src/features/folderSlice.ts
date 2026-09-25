import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Folder, Note } from "../types"

interface FolderState {
  folders: Folder[]
}

const initialState: FolderState = {
  folders: [],
}

function findAndMutate(folders: Folder[], folderId: string, mutate: (folder: Folder) => void): boolean {
  for (const folder of folders) {
    if (folder._id === folderId) {
      mutate(folder)
      return true
    }
    if (folder.folders && findAndMutate(folder.folders, folderId, mutate)) return true
  }
  return false
}

const folderSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    setFolders: (state, action: PayloadAction<Folder[]>) => {
      state.folders = action.payload
    },
    addFolder: (state, action: PayloadAction<Folder>) => {
      state.folders.push(action.payload)
    },
    addNoteToFolder: (
      state,
      action: PayloadAction<{ folderId: string; note: Note }>
    ) => {
      findAndMutate(state.folders, action.payload.folderId, (folder) => {
        if (!folder.notes) folder.notes = []
        folder.notes!.push(action.payload.note)
      })
    },
    addSubFolder: (
      state,
      action: PayloadAction<{ parentId: string; folder: Folder }>
    ) => {
      findAndMutate(state.folders, action.payload.parentId, (folder) => {
        if (!folder.folders) folder.folders = []
        folder.folders!.push(action.payload.folder)
      })
    },
  },
})

export const { setFolders, addFolder, addNoteToFolder, addSubFolder } =
  folderSlice.actions

export default folderSlice.reducer