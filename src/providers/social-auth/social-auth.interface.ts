export interface IOAuth {
  /**
   * idToken from google auth
   * @example 'id123...'
   */
  idToken: string;
  /**
   * if choose apple, this parameter is required
   * @example 'sam balbau'
   */
  fullName?: string;
}

export interface IUserInfo {
  email: string;
  fullName: string;
  avatar?: string;
  emailActive: boolean;
}

export interface IAppleJwtPayload {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  c_hash: string;
  email: string;
  email_verified: string;
  auth_time: number;
  nonce_supported: boolean;
}

export interface ISocialAuthMethods {
  auth(authDto: IOAuth): Promise<IUserInfo>;
}
