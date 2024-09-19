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

3. Set your `SECRET` in `./backend/.env`

4. Open file `./backend/src/main.ts` and specify assertion commands in `ceateJalProgram` function

![image.png](/assets/images/jal-program.png)

5. Start backend application

```shell
cd ./backend && pnpm run dev 
```

6. Open new terminal and start frontend

```shell
cd ./frontend && pnpm run dev
```

7. Open frontend application in browser, default `http://localhost:5180`

8. Go through zCred verification (the process of creating proof can take about one minute)

A proving result will be displayed in backend terminal logs

## Advantages

- Services can save money on KYC
- User needs to undergo the verification process only once
- The digital passport is stored in the database in an encrypted form
- The user discloses only the information that the service needs and can reject verification
- Service can solve sybil problem

`sybilId` is special passport identifier. One physical passport is one `sybilId`.
To get passport `sybilId` you need to specify `credential.attributes.document.sybilId` in `publicInput`

![image.png](/assets/images/sybil-id.png)

You can get user sybil id from webhook request body

![image.png](/assets/images/sybil-id-log.png)

### Zcred verifier

To learn how to create your frontend application to verify users using zero-knowledge credentials, you can read
this: https://github.com/sybil-center/sybil-center/blob/dev/verifier/README.md

### Working application

Instead of running this app on your computer, you can open the link: https://demo.zcred.sybil.center/