// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
     private readonly configService: ConfigService,
     private readonly usersService: UsersService,
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: fs.readFileSync(path.join(__dirname, '../../../', configService.get<string>('JWT_PUBLIC_KEY_PATH'))),
      algorithms: ['ES256'],
    });
  }

  async validate(payload: any) {
    return this.usersService.findOneByEmail(payload.email);
  }
}
