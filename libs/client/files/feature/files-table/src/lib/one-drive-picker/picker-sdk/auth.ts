import { IPublicClientApplication, SilentRequest } from '@azure/msal-browser';
import { combine } from '@pnp/core';
import { IAuthenticateCommand } from './types';

export async function getToken(
  command: IAuthenticateCommand,
  client: IPublicClientApplication,
): Promise<string> {
  let authParams = { scopes: [] as string[] };

  switch (command.type) {
    case 'SharePoint':
      authParams = { scopes: [`${combine(command.resource, '.default')}`] };
      break;
    case 'Graph':
      authParams = { scopes: ['Files.ReadWrite.All'] };
      break;
    default:
      break;
  }

  return getTokenWithScopes(authParams.scopes, command.type, client);
}

export async function getTokenWithScopes(
  scopes: string[],
  type: string,
  client: IPublicClientApplication,
  additionalAuthParams?: Omit<SilentRequest, 'scopes'>,
): Promise<string> {
  // const clientId = get('CLIENT_ID').required().asString();
  // let authority = get('CLIENT_AUTHORITY_OD').required().asString();
  //
  // if (type == 'SharePoint') {
  //   authority = get('CLIENT_AUTHORITY_ODSP').required().asString();
  // }

  const app: IPublicClientApplication = client;

  let accessToken = '';
  const authParams = { scopes, ...additionalAuthParams };

  try {
    // see if we have already the idtoken saved
    const resp = await app.acquireTokenSilent(authParams!);
    accessToken = resp.accessToken;
  } catch (e) {
    // per examples we fall back to popup
    const resp = await app.loginPopup(authParams!);
    app.setActiveAccount(resp.account);

    if (resp.idToken) {
      const resp2 = await app.acquireTokenSilent(authParams!);
      accessToken = resp2.accessToken;
    } else {
      // throw the error that brought us here
      throw e;
    }
  }

  return accessToken;
}
