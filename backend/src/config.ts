type ConstructorConfigOptions = {
  port: string;
  host: string;
  serverOrigin: URL;
  secret: string;
  redirectURL: URL;
  issuerURL: URL;
  credentialHolderURL: URL;
  verifierOrigin: string;
}

export class Config implements ConstructorConfigOptions {

  readonly port: string;
  readonly host: string;
  readonly secret: string;
  readonly serverOrigin: URL
  readonly redirectURL: URL;
  readonly verifierOrigin: string;
  readonly issuerURL: URL;
  readonly credentialHolderURL: URL;

  constructor(options: ConstructorConfigOptions) {
    this.port = options.port;
    this.host = options.host;
    this.secret = options.secret;
    this.redirectURL = options.redirectURL;
    this.serverOrigin = options.serverOrigin;
    this.issuerURL = options.issuerURL;
    this.credentialHolderURL = options.credentialHolderURL;
    this.verifierOrigin = options.verifierOrigin;
  }
}