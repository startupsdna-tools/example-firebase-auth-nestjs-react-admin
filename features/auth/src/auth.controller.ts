import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  FirebaseAuthRequest,
  FirebaseAuthService,
  SESSION_COOKIE_NAME,
  UseAuthGuard,
} from '@app/firebase-auth';
import { AccountDto, AccountUpdateDto, AuthConfig } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: FirebaseAuthService) {}

  @Get('/config')
  getConfig(): AuthConfig {
    const apiKey = process.env.FIREBASE_API_KEY;
    if (!apiKey) {
      throw new ServiceUnavailableException('FIREBASE_API_KEY is not set');
    }

    return {
      firebase: {
        apiKey: apiKey,
        projectId: process.env.FIREBASE_PROJECT_ID,
      },
    };
  }

  @Post('/login')
  async login(
    @Body() body: { idToken: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const idToken = body.idToken;
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    // Create the session cookie. This will also verify the ID token in the process.
    // The session cookie will have the same claims as the ID token.
    // To only allow session cookie setting on recent sign-in, auth_time in ID token
    // can be checked to ensure user was recently signed in before creating a session cookie.
    const sessionCookie = await this.authService.createSessionCookie(idToken, {
      expiresIn,
    });

    // Send the session cookie in the response to the client
    response.cookie(SESSION_COOKIE_NAME, sessionCookie, {
      path: '/',
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
    });

    return { message: 'Logged in' };
  }

  @Get('/account')
  @UseAuthGuard()
  async account(@Req() request: FirebaseAuthRequest): Promise<AccountDto> {
    return this.authService.getUser(request.auth.uid);
  }

  @Post('/account')
  async updateAccount(
    @Req() req: FirebaseAuthRequest,
    @Body() body: AccountUpdateDto,
  ): Promise<AccountDto> {
    return this.authService.updateUser(req.auth.uid, {
      displayName: body.fullName,
      password: body.password || undefined,
    });
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(SESSION_COOKIE_NAME);
    return { message: 'Logged out' };
  }
}
