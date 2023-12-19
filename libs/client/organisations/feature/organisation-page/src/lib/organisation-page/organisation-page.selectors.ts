import { Environment } from '@app/client/core/environment';
import { FileEntity, filesQuery } from '@app/client/files/feature/state';
import { OrganisationsFeature } from '@app/client/organisations/state';
import { routerQuery } from '@app/client/shared/util-router';
import { tagsQuery } from '@app/client/tags/state';
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

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
      ? `https://graph.microsoft.com/v1.0/sites/${environment.sharepointSiteId}/drive/items/${file.id}/children`
      : '',
    childrenCount: file.folder?.childCount,
  });

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectFileTags = (file: FileEntity) =>
  createSelector(
    filesQuery.selectFileTags,
    (fileTags) => fileTags[file.id!] ?? [],
  );

export const selectFilesTableViewModelFactory = (environment: Environment) =>
  createSelector(
    filesQuery.selectAll,
    tagsQuery.tagsFeature.selectTabTags,
    OrganisationsFeature.selectCurrentOrganisation,
    filesQuery.selectLoadedFolders,
    filesQuery.selectFileTags,
    (files, tags, organisation, loadedFolders, fileTags) => {
      return {
        source: files
          .filter((t) => t.folderId === organisation?.sharepointDirectory)
          .map(toFileRow(environment)),
        tags,
        isLoading:
          !organisation || !loadedFolders[organisation.sharepointDirectory!],
        fileTags,
        rootFolder: organisation?.sharepointDirectory,
      };
    },
  );

export const selectOrganisationDetails = createSelector(
  OrganisationsFeature.selectCurrentOrganisation,
  (organisation) =>
    [
      {
        label: organisation?.name,
        subLabel: organisation?.domains[0],
      },
      {
        label: organisation?.opportunities?.length
          ? _.orderBy(
              organisation.opportunities,
              (x) => new Date(x?.createdAt ?? ''),
              'desc',
            )[0].tag?.name ?? ''
          : null,
        subLabel: 'Last Funding Round',
      },
    ].filter(({ label }) => !!label),
);

export const selectOrganisationPageViewModel = createSelector(
  OrganisationsFeature.selectCurrentOrganisation,
  routerQuery.selectCurrentOrganisationId,
  selectOrganisationDetails,
  OrganisationsFeature.selectLoadingOrganisation,
  (currentOrganisation, currentOrganisationId, details, isLoading) => {
    return {
      currentOrganisationId,
      currentOrganisation,
      details,
      isLoading,
      opportunities: currentOrganisation?.opportunities ?? [],
    };
  },
);
