import { Public } from '@app/rvns-api';
import {
  Body,
  Controller,
  Get,
  Next,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { ApiConsumes, ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import { environment } from '../../../environments/environment';
import { ParseUserFromIdentityPipe } from '../../shared/pipes/parse-user-from-identity.pipe';
import { Identity } from '../rvn-users/decorators/identity.decorator';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { CreateSasTokenDto } from './dto/create-sas-token.dto';
import { SasTokenDto } from './dto/sas-token.dto';
import { StorageAccountProxyMiddleware } from './storage-account-proxy.middleware';
import { StorageAccountService } from './storage-account.service';

@ApiTags('Storage Account')
@Controller('storage-account')
@ApiOAuth2([environment.scopes.apiAccess])
export class StorageAccountController {
  public constructor(
    private readonly storageAccountService: StorageAccountService,
    private readonly storageAccountProxyMiddleware: StorageAccountProxyMiddleware,
  ) {}

  @ApiConsumes('multipart/form-data')
  @Put('*')
  public async proxyForUpload(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ): Promise<void> {
    return this.storageAccountProxyMiddleware.use(req, res, next);
  }

  @Public()
  @Get('*')
  public async proxyForDownload(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ): Promise<void> {
    return this.storageAccountProxyMiddleware.use(req, res, next);
  }

  @Post()
  public async createSasToken(
    @Identity(ParseUserFromIdentityPipe) userEntity: UserEntity,
    @Body() dto: CreateSasTokenDto,
  ): Promise<SasTokenDto> {
    if (dto.permission === 'write') {
      const sasToken =
        await this.storageAccountService.createStorageAccountFile(
          'default',
          dto.fileName,
          dto.noteRootVersionId,
          userEntity.id,
        );
      return {
        sasToken: sasToken.sasToken,
        fileName: sasToken.storageAccountFile.fileName,
      } as SasTokenDto;
    } else {
      const sasToken = await this.storageAccountService.getSasTokenForFile(
        'default',
        dto.fileName,
      );
      return {
        sasToken,
        fileName: dto.fileName,
      } as SasTokenDto;
    }
  }
}
