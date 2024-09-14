type ConstructorConfigOptions = {
  port: string;
  host: string;
  secret: string;
  redirectURL: URL;
  webhookURL: URL;
  issuerURL: URL;
  credentialHolderURL: URL;
  verifierOrigin: string;
}

export class Config implements ConstructorConfigOptions {

  readonly port: string;
  readonly host: string;
  readonly secret: string;
  readonly redirectURL: URL;
  readonly webhookURL: URL;
  readonly verifierOrigin: string;
  readonly issuerURL: URL;
  readonly credentialHolderURL: URL;

  constructor(options: ConstructorConfigOptions) {
    this.port = options.port;
    this.host = options.host;
    this.secret = options.secret;
    this.redirectURL = options.redirectURL;
    this.webhookURL = options.webhookURL;
    this.issuerURL = options.issuerURL;
    this.credentialHolderURL = options.credentialHolderURL;
    this.verifierOrigin = options.verifierOrigin;
  }
}