export interface AzureAdPayload {
  readonly unique_name: string;
  readonly family_name: string;
  readonly given_name: string;
  readonly aud: string;
  readonly iss: string;
  readonly iat: number;
  readonly nbf: number;
  readonly exp: number;
  readonly acr: string;
  readonly aio: string;
  readonly appid: string;
  readonly appidacr: string;
  readonly ipaddr: string;
  readonly name: string;
  readonly oid: string;
  readonly pwd_exp: string;
  readonly pwd_url: string;
  readonly rh: string;
  readonly scp: string;
  readonly sub: string;
  readonly tid: string;
  readonly upn: string;
  readonly uti: string;
  readonly ver: string;
  readonly roles: string[];
}
