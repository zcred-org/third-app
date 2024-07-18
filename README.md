# KYC throw Zero-Knowledge Passport and zCred protocol Demo app.

## Motivation

There are instances where a user must undergo the KYC procedure to gain access to a specific service. When there are
multiple such services, the user has to go through a similar KYC procedure for each of them. However, what if the user
could undergo the KYC procedure only once to receive a digital identity document – a digital passport? With this digital
passport, the user can then prove to various services that they are not a citizen of countries on the sanction list,
that they are over 18 years old, or that they are male. The user can fully control which attributes will be disclosed to
the third-party service, ensuring the authentication and authorization process is maximally secure for the user. All
this is possible with the [`zCred`](https://github.com/zcred-org/ZCIPs) protocol, which is based on [`zero-knowledge
credentials`](https://github.com/zcred-org/ZCIPs/blob/main/ZCIPs/zcip-2.md) and the triangle of trust.

## Requirements

- [Metamask](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) installed as browser
  extension
- Node JS
- pnpm

## Try out

1. Clone repo
2. Install dependencies

```shell 
pnpm i
```

3. Open file `./scripts/create-verifier.ts` and specify assertion commands

![image.png](/public/assertion-commands.png)

4. Send verification program to verifier server

```shell
pnpm run create-verifier
```

5. Run and open frontend application

```shell
pnpm run dev
```

6. Go throw zCred verification (the process of creating proof can take about one minute)

A proving result will be displayed in the browser console after verification

## Advantages

- Services can save money on KYC
- User needs to undergo the verification process only once
- The digital passport is stored in the database in an encrypted form
- The user discloses only the information that the service needs and can reject verification
- Service can solve sybil problem

`sybilId` is special passport identifier. One physical passport is one `sybilId`.
To get passport `sybilId` you need to specify `credential.attributes.document.sybilId` in `publicInput`

![image.png](/public/sybil-id.png)

After that you can get sybil id from `provingResult`

![image.png](/public/proving-result.png)