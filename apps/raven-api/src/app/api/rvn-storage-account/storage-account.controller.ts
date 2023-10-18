import { Body, Controller, Next, Post, Put, Req, Res } from '@nestjs/common';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import { CreateSasTokenDto } from './dto/create-sas-token.dto';
import { SasTokenDto } from './dto/sas-token.dto';
import { StorageAccountProxyMiddleware } from './storage-account-proxy.middleware';
import { StorageAccountService } from './storage-account.service';

@ApiTags('Storage Account')
@Controller('storage-account')
@ApiOAuth2(['https://raven.test.mubadalacapital.ae/api'])
export class StorageAccountController {
  public constructor(
    private readonly storageAccountService: StorageAccountService,
    private readonly storageAccountProxyMiddleware: StorageAccountProxyMiddleware,
  ) {}
  @Put('*')
  public async proxyForUpload(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ): Promise<void> {
    return this.storageAccountProxyMiddleware.use(req, res, next);
  }

  @Post()
  public async createSasToken(
    @Body() dto: CreateSasTokenDto,
  ): Promise<SasTokenDto> {
    const sasToken = await this.storageAccountService.createStorageAccountFile(
      'default',
      dto.fileName,
    );
    return {
      sasToken: sasToken.sasToken,
      fileName: sasToken.storageAccountFile.fileName,
    } as SasTokenDto;
  }
}
