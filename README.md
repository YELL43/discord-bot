<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# production mode
$ npm run start:server
```

# การกำหนดค่า Environments ใน Github

## ENV - Auth0 setup
| Key | Value |
|--|--|
| AUTH0_DOMAIN | https://dev-j4px7xxxxxxxxx.us.auth0.com |
| AUTH0_CLIENT_ID | QpPgcLV2lCjzzxxxxxxxxxxxxxxx |
| AUTH0_CLIENT_SECRET | wRwZgAZY9mlsix0yxxxxxxx_xxxxxxx7yLjX |
| AUTH0_SECRET | c751785aaxxxxxxxxxxxxxxxx4b55fd3 |
| AUTH0_APP_BASE_URL | http://localhost:3000 |

## ENV - AWS setup

### 1. - AWS - configure aws credentials สำหรับ connect AWS Service
| Key | Value |
|--|--|
| AWS_ACCESS_KEY | **AKIXXXXXXXXXXX653** |
| AWS_SECRET_KEY | oY08/xxxxxxxxxxxxxxxxxxxxxxxxxxx6V1+j |

### 2. - AWS - connect EC2 for deploy
| Key | Value |
|--|--|
| EC2_SSH_HOST | 43.255.255.141 |
| EC2_SSH_USERNAME | ubuntu |
| EC2_SSH_KEY | **( key ที่อยู่ใน file.pem )** |

### 3. - AWS - connect ECR for Push image docker
| Key | Value |
|--|--|
| AWS_ECR_URI | 123456789000.dkr.ecr.ap-southeast-7.amazonaws.com |
| AWS_REGION | ap-southeast-7 |
| AWS_REPOSITORY | ecr-repository-name |

### 4. - AWS - connect RDS for database postgres
| Key | Value |
|--|--|
| RDS_DATABASE_HOST | rds-xxxx-app.xxxxx.ap-southeast-7.rds.amazonaws.com | 
| RDS_DATABASE_NAME | db_name_app |
| RDS_DATABASE_USERNAME | root |
| RDS_DATABASE_PASSWORD | xxxxxxxxxxxx |
| RDS_DATABASE_PORT | 5432 |
| RDS_DATABASE_ENABLE_SSL | true `กำหนด true หรือ false` |

## ENV - Front-end connect API URL
| Key | Value |
|--|--|
| ENV_FRONT_HOST_API | https://api.app-xxxx.com |

