import {Body, Controller, Next, Post, Put, Req, Res} from "@nestjs/common";
import {ApiOAuth2, ApiTags} from "@nestjs/swagger";
import { createProxyMiddleware } from 'http-proxy-middleware';
import {CreateSasTokenDto} from "./dto/create-sas-token.dto";
import {SasTokenDto} from "./dto/sas-token.dto";

const proxy = createProxyMiddleware({
  target: 'http://localhost:8090/api',
  pathRewrite: {
    '/api/v2/todos-api': ''
  },
  secure: false,
  onProxyReq: (proxyReq, req, res) => {
    console.log(
      `[ProxyMiddleware]: Proxying ${req.method} request originally made to '${req.originalUrl}'...`
    );
  }
});

@ApiTags('Storage Account')
@Controller("storage-account")
@ApiOAuth2(['https://raven.test.mubadalacapital.ae/api'])
export class StorageAccountController {
  @Put()
  public proxyForUpload(@Req() req, @Res() res, @Next() next){
    proxy(req, res, next);
  }

  @Post()
  public createSasToken(@Body() dto: CreateSasTokenDto): Promise<SasTokenDto> {
    return new Promise((resolve, reject) => {
      resolve({
        fileName: dto.fileName
      } as SasTokenDto);
    });
  }
}
