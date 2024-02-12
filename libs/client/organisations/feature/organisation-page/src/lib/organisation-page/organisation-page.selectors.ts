/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Environment } from '@app/client/core/environment';
import { FileEntity, filesQuery } from '@app/client/files/feature/state';
import { opportunitiesFeature } from '@app/client/opportunities/data-access';
import {
  organisationStatusColorDictionary,
  organisationsFeature,
} from '@app/client/organisations/state';
import { pipelinesQuery } from '@app/client/pipelines/state';
import { DialogQueryParams } from '@app/client/shared/shelf';
import { routerQuery } from '@app/client/shared/util-router';
import { tagsQuery } from '@app/client/tags/state';
import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { CompanyStatus } from 'rvns-shared';

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

export const selectFileTags = (file: FileEntity) =>
  createSelector(
    filesQuery.selectFileTags,
    (fileTags) => fileTags[file.id!] ?? [],
  );

export const selectFilesTableViewModelFactory = (environment: Environment) =>
  createSelector(
    filesQuery.selectAll,
    tagsQuery.tagsFeature.selectTabTags,
    organisationsFeature.selectCurrentOrganisation,
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
  organisationsFeature.selectCurrentOrganisation,
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
  organisationsFeature.selectCurrentOrganisation,
  routerQuery.selectCurrentOrganisationId,
  selectOrganisationDetails,
  organisationsFeature.selectLoadingOrganisation,
  organisationsFeature.selectCreatingSharepointFolder,
  pipelinesQuery.selectStagePrimaryColorDictionary,
  organisationsFeature.selectUpdateLoading,
  opportunitiesFeature.selectCreate,
  (
    currentOrganisation,
    currentOrganisationId,
    details,
    isLoading,
    isCreatingSharepointFolder,
    stageColorDictionary,
    updateLoading,
    { isLoading: createLoading },
  ) => {
    const opportunities =
      currentOrganisation?.opportunities?.map((opportunity) => ({
        ...opportunity,
        status: {
          name: opportunity!.stage?.displayName ?? '',
          color: stageColorDictionary?.[opportunity!.stage?.id] ?? '#000',
        },
      })) ?? [];

    const companyStatusDisplayName = currentOrganisation?.companyStatus
      ?.split('_')
      .join(' ');

    const status = {
      name: companyStatusDisplayName,
      color:
        organisationStatusColorDictionary[
          currentOrganisation?.companyStatus as CompanyStatus
        ],
    };

    return {
      currentOrganisationId,
      currentOrganisation,
      details,
      isLoading,
      opportunities,
      isCreatingSharepointFolder,
      status,
      createLoading,
      updateLoading,
      sharepointFolder: currentOrganisation?.sharePointPath,
      hasFileFolder: !!currentOrganisation?.sharepointDirectory,
      showPassButton:
        ![CompanyStatus.PASSED, CompanyStatus.PORTFOLIO].some(
          (status) => status === currentOrganisation?.companyStatus,
        ) && !isLoading,
      showStatus: !isLoading && companyStatusDisplayName,
      showOutreachButton: !isLoading && !currentOrganisation?.companyStatus,
      outreachQueryParams: {
        [DialogQueryParams.moveToOutreachCompany]: currentOrganisation?.id,
      },
    };
  },
);
