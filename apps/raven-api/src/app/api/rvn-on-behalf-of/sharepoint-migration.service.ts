import { Client } from "@microsoft/microsoft-graph-client";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import _ from "lodash";
import { OrganisationEntity } from "../rvn-opportunities/entities/organisation.entity";
import { IsNull, Not, Repository } from "typeorm";
import { OpportunityEntity } from "../rvn-opportunities/entities/opportunity.entity";
import { SharepointDirectoryStructureGenerator } from "../../shared/sharepoint-directory-structure.generator";
import { FileEntity } from "../rvn-files/entities/file.entity";
import { MigrateSharepointDto } from "./dto/migrate-sharepoint.dto";
import { DriveItem } from "@microsoft/microsoft-graph-types";

@Injectable()
export class SharepointMigrationService {
    public constructor(private readonly graphClient: Client,
        @InjectRepository(OrganisationEntity)
        private readonly organisationRepository: Repository<OrganisationEntity>,
        @InjectRepository(OpportunityEntity)
        private readonly opportunityRepository: Repository<OpportunityEntity>,
        @InjectRepository(FileEntity)
        private readonly fileRepository: Repository<FileEntity>,
    ) {
    }

    public async getFile(siteId: string, driveId: string, itemId: string): Promise<DriveItem> {
        const items = await this.graphClient
            .api(
                `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/items/${itemId}`,
            )
            .get();
        return items;
    }

    public async getFileByPath(siteId: string, driveId: string, path: string): Promise<DriveItem> {
        const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${path}`;
        const items = await this.graphClient
            .api(url)
            .get();

        return items;
    }

    public async checkPermissions(dto: MigrateSharepointDto): Promise<{
        currentStructureAccess: boolean,
        targetStructureAccess: boolean,
        currentFilesAccess: boolean,
        targetFilesAccess: boolean,
    }> {
        let currentStructureAccess = false;
        let targetStructureAccess = false;
        let currentFilesAccess = false;
        let targetFilesAccess = false;

        try {
            await this.getChildren(
                dto.siteId, dto.driveId, dto.rootFolderId
            );
            currentStructureAccess = true;
        } catch (e) {
            console.log(`No access to current structure. ${e?.message}`)
        }

        try {
            await this.getChildren(
                dto.newSiteId, dto.newDriveId, dto.newRootFolderId
            );
            targetStructureAccess = true;
        } catch (e) {
            console.log(`No access to target structure. ${e?.message}`)
        }
        const files = await this.fileRepository.find({
            where: {
                internalSharepointId: Not(IsNull())
            },
            take: 1,
            skip: 0,
        })

        let currentFilePath = null;

        try {
            const currentFile = await this.getFile(dto.siteId, dto.driveId, files[0].internalSharepointId);
            currentFilePath = `${currentFile?.parentReference.path.split(':/')[1]}/${currentFile?.name}`;
            currentFilesAccess = true;
        } catch (e) {
            console.log(`No access to current files structure. ${e?.message}`)
        }

        try {
            await this.getFileByPath(dto.newSiteId, dto.newDriveId, currentFilePath);
            targetFilesAccess = true;
        } catch (e) {
            console.log(`No access to current files structure. ${e?.message}`)
        }

        return {
            currentStructureAccess,
            targetStructureAccess,
            currentFilesAccess,
            targetFilesAccess,
        }
    }

    public async migrateFiles(dto: MigrateSharepointDto): Promise<void> {
        const [files, fCount] = await this.fileRepository.findAndCount({
            where: {
                internalSharepointId: Not(IsNull())
            }
        })
        const filesToSave: Partial<FileEntity>[] = [];

        for (const file of files) {
            try {
                const currentFile = await this.getFile(dto.siteId, dto.driveId, file.internalSharepointId);
                const currentFilePath = `${currentFile?.parentReference.path.split(':/')[1]}/${currentFile?.name}`;
                const newId = await this.getFileByPath(dto.newSiteId, dto.newDriveId, currentFilePath);

                filesToSave.push({ id: file.id, internalSharepointId: newId.id })
            } catch (e) {
                console.log(`File not found: ${file.id}, ${file.internalSharepointId}. ${e?.message}`);
                continue;
            }
        }

        console.log(`FILES TO UPDATE = ${filesToSave.length}, NOT FOUND = ${files.length - filesToSave.length}`)
        if (filesToSave.length) {
            await this.fileRepository.save(filesToSave);
        }
    }

    public async migrateOrganisationsAndOpportunities(dto: MigrateSharepointDto): Promise<void> {
        const current = await this.listDirectries(dto.siteId, dto.driveId, dto.rootFolderId)
        const migrationTarget = await this.listDirectries(dto.newSiteId, dto.newDriveId, dto.newRootFolderId)

        const matches = {};
        for (let i = 0; i < current.length; i++) {
            const match = migrationTarget.find(f => f.name === current[i].name);
            if (match) {
                matches[current[i].id] = match.id;
            }
        }
        const [organisations, orgsCount] = await this.organisationRepository.findAndCount({
            where: {
                sharepointDirectoryId: Not(IsNull())
            }
        })

        const orgsToSave: Partial<OrganisationEntity>[] = [];
        for (const org of organisations) {
            const found = matches[org.sharepointDirectoryId];
            if (found) {
                orgsToSave.push({ id: org.id, sharepointDirectoryId: found })
            } else {
                console.log(`NOT FOUND ${org.name}, ${org.sharepointDirectoryId}`)

            }
        }
        if (orgsToSave.length) {
            await this.organisationRepository.save(orgsToSave);
        }

        const [opportunities, oppCount] = await this.opportunityRepository.findAndCount({
            where: {
                sharepointDirectoryId: Not(IsNull())
            },
            relations: ['organisation', 'tag']
        })

        const oppsToSave: Partial<OpportunityEntity>[] = [];
        for (const opp of opportunities) {
            const foundOrgDirId = matches[opp.organisation.sharepointDirectoryId];
            const dirName = SharepointDirectoryStructureGenerator.getDirectoryNameForOpportunity(
                opp,
            );
            const foundTargetId = migrationTarget.find(targetOrg => targetOrg.id === foundOrgDirId)?.children?.find(child => child.name === dirName)?.id;
            if (foundTargetId) {
                oppsToSave.push({ id: opp.id, sharepointDirectoryId: foundTargetId })
            } else {
                console.log(`NOT FOUND ${dirName}, ${opp.organisation.name}, ${opp.organisation.sharepointDirectoryId}`)
            }
        }
        if (oppsToSave.length) {
            await this.opportunityRepository.save(oppsToSave);
        }
        console.log(`ORGS TO UPDATE = ${orgsToSave.length}, NOT FOUND = ${orgsCount - orgsToSave.length}`)
        console.log(`OPPS TO UPDATE = ${oppsToSave.length}, NOT FOUND = ${oppCount - oppsToSave.length}`)
    }

    public async listDirectries(siteId, driveId, rootFolderId): Promise<Partial<DriveItem[]>> {
        const currentDirectories = await this.getChildren(
            siteId, driveId, rootFolderId
        );

        for (const companyDir of currentDirectories) {
            companyDir.children = await this.getChildren(
                siteId, driveId, companyDir.id
            );

        }

        return currentDirectories
    }

    protected async getChildren(siteId: string, driveId: string, folderId: string): Promise<Partial<DriveItem>[]> {
        const items = await this.graphClient
            .api(
                `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/items/${folderId}/children`,
            )
            .get();

        return items.value.map(d => _.pick(d, ['id', 'name', 'folder']));
    }
}