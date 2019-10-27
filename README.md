# Shopify App Node

Boilerplate to create an embedded Shopify app made with Node, [Next.js](https://nextjs.org/), [Shopify-koa-auth](https://github.com/Shopify/quilt/tree/master/packages/koa-shopify-auth), [Polaris](https://github.com/Shopify/polaris-react), and [App Bridge React](https://github.com/Shopify/app-bridge/tree/master/packages/app-bridge-react).

## Installation

## Install

Shopify App CLI installs using a shell script. Download and run it in your terminal with one command:

### Mac OS and Ubuntu
```sh
eval "$(curl -sS https://raw.githubusercontent.com/Shopify/shopify-app-cli/master/install.sh)"
```

### Windows
Install [Linux Subsystem for Windows](https://docs.microsoft.com/en-us/windows/wsl/install-win10) and the [Ubuntu VM](https://www.microsoft.com/en-ca/p/ubuntu/9nblggh4msv6), then:

```sh
eval "$(curl -sS https://raw.githubusercontent.com/Shopify/shopify-app-cli/master/install.sh)"
```
> NOTE: Installing the Shopify App CLI requires [curl](https://curl.haxx.se/). You can to see if it's on your system by running: `curl --version`

## Getting started

Developers should have some prior knowledge of the Shopify app ecosystem. Currently Shopify App CLI creates apps using either Node or Ruby.

Using the [Shopify-App-CLI](https://github.com/Shopify/shopify-app-cli) run:

```sh
~/ $ shopify server
```

## Requirements

- If you don’t have one, [create a Shopify partner account](https://partners.shopify.com/signup).
- If you don’t have one, [create a Development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) where you can install and test your app.
- In the Partner dashboard, [create a new app](https://help.shopify.com/en/api/tools/partner-dashboard/your-apps#create-a-new-app). You’ll need this app’s API credentials during the setup process.

## Usage

This repository is used by [Shopify-App-CLI](https://github.com/Shopify/shopify-app-cli) as a scaffold for Node apps. You can clone or fork it yourself, but it’s faster and easier to use Shopify App CLI, which handles additional routine development tasks for you.

## License

This respository is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
