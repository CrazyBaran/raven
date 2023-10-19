import { Controller } from '@nestjs/common';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@ApiOAuth2(['openid'])
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}
}
