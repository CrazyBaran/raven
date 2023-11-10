import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  public constructor(private readonly jwtService: JwtService) {}

  public decodeToken(
    token: string,
  ): string | { [key: string]: unknown } | null {
    try {
      return this.jwtService.decode(token);
    } catch (err) {
      return null;
    }
  }
}
