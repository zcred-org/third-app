export class Config {
    port;
    host;
    secret;
    serverOrigin;
    redirectURL;
    verifierOrigin;
    issuerURL;
    credentialHolderURL;
    constructor(options) {
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
