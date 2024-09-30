import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class MigrateSharepointDto {
    @ApiProperty()
    @IsString()
    @MaxLength(256)
    public readonly siteId?: string;

    @ApiProperty()
    @IsString()
    @MaxLength(256)
    public readonly driveId?: string;

    @ApiProperty()
    @IsString()
    @MaxLength(256)
    public readonly rootFolderId?: string;

    @ApiProperty()
    @IsString()
    @MaxLength(256)
    public readonly newSiteId?: string;

    @ApiProperty()
    @IsString()
    @MaxLength(256)
    public readonly newDriveId?: string;

    @ApiProperty()
    @IsString()
    @MaxLength(256)
    public readonly newRootFolderId?: string;
}
  