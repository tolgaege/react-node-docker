<!--
title: 'AWS Serverless Github Webhook Listener example in NodeJS'
description: 'This service will listen to github webhooks fired by a given repository.'
layout: Doc
framework: v1
platform: AWS
language: nodeJS
authorLink: 'https://github.com/adambrgmn'
authorName: 'Adam Bergman'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13746650?v=4&s=140'
-->
# Serverless Github webhook listener

This service will listen to github webhooks fired by a given repository.

## How it works

```
┌───────────────┐               ┌───────────┐
│               │               │           │
│  Github repo  │               │   Github  │
│   activity    │────Trigger───▶│  Webhook  │
│               │               │           │
└───────────────┘               └───────────┘
                                      │
                     ┌────POST────────┘
                     │
          ┌──────────▼─────────┐
          │ ┌────────────────┐ │
          │ │  API Gateway   │ │
          │ │    Endpoint    │ │
          │ └────────────────┘ │
          └─────────┬──────────┘
                    │
                    │
         ┌──────────▼──────────┐
         │ ┌────────────────┐  │
         │ │                │  │
         │ │     Lambda     │  │
         │ │    Function    │  │
         │ │                │  │
         │ └────────────────┘  │
         └─────────────────────┘
                    │
                    │
                    ▼
         ┌────────────────────┐
         │                    │
         │   Put To Postgres  │
         │                    │
         └────────────────────┘
```

## Setup

First need to make sure that Lambda has a static IP for Postgres whitelisting. Create

- VPC
- NAT + Elastic IP
- Internet Gateway
- 2 Subnets
- Routing Tables

These steps are explained in this [post](https://medium.com/@balkaran.brar/aws-lambda-with-static-ip-address-c82e3043c2ed). Afterwards, fill the secrets in yml file


```yml
  org: kanyilmaz
  app: github-hooks
  service: aws-node-github-webhook-listener

  provider:
    name: aws
    runtime: nodejs10.x
    timeout: 6
    environment:
      GITHUB_WEBHOOK_SECRET: <secret>
      POSTGRES_HOST: <secret>
      POSTGRES_PORT: <secret>
      POSTGRES_USERNAME: <secret>
      POSTGRES_PASSWORD: <secret>
      POSTGRES_DATABASE: <secret>

  functions:
    githubWebhookListener:
      handler: handler.githubWebhookListener
      events:
        - http:
            path: webhook
            method: post
            cors: true
      vpc:
        securityGroupIds:
          - <securityGroupId>
        subnetIds:
          - <subnetGroupId>
  ```

2. Deploy the service

  ```bash
  serverless deploy
  ```

  After the deploy has finished you should see something like:
  ```bash
  Service Information
  service: github-webhook-listener
  stage: dev
  region: us-east-1
  api keys:
    None
  endpoints:
    POST - https://abcdefg.execute-api.us-east-1.amazonaws.com/dev/webhook
  functions:
    github-webhook-.....github-webhook-listener-dev-githubWebhookListener
  ```

3. Configure your webhook in your github repository settings. [Setting up a Webhook](https://developer.github.com/webhooks/creating/#setting-up-a-webhook)

4. Manually trigger/test the webhook from settings or do something in your github repo to trigger a webhook.

  You can tail the logs of the lambda function with the below command to see it running.
  ```bash
  serverless logs -f githubWebhookListener -t
  ```

  You should see the event from github in the lambda functions logs.

