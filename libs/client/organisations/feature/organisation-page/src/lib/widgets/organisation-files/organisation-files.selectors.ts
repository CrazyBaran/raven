/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Environment } from '@app/client/core/environment';
import { FileEntity } from '@app/client/files/feature/state';
import { organisationsFeature } from '@app/client/organisations/state';
import { createSelector } from '@ngrx/store';

export type FileRow = {
  type: 'file' | 'folder';
  id: string;
  url: string;
  name: string;
  createdBy: string;
  updatedAt: Date;
  folderUrl?: string;
  childrenCount?: number | null;
};

export const toFileRow =
  (environment: Environment) =>
  (file: FileEntity): FileRow => ({
    type: file.file ? 'file' : 'folder',
    id: file.id!,
    url: file.webUrl!,
    name: file.name!,
    createdBy: file.createdBy?.user?.displayName ?? '',
    updatedAt: new Date(file.lastModifiedDateTime ?? ''),
    folderUrl: file.folder
      ? `https://graph.microsoft.com/v1.0/sites/${environment.sharepointSiteId}/drives/${environment.sharepointDriveId}/items/${file.id}/children`
      : '',
    childrenCount: file.folder?.childCount,
  });

export const selectOrganisationFilesViewModel = createSelector(
  organisationsFeature.selectCurrentOrganisation,
  organisationsFeature.selectLoadingOrganisation,
  organisationsFeature.selectCreatingSharepointFolder,
  (currentOrganisation, isLoading, isCreatingSharepointFolder) => {
    return {
      isLoading,
      isCreatingSharepointFolder,
      sharepointFolder: currentOrganisation?.sharePointPath,
      hasFileFolder: !!currentOrganisation?.sharepointDirectory,
      currentOrganisationId: currentOrganisation?.id,
      sharepointDirectory: currentOrganisation?.sharepointDirectory,
    };
  },
);
