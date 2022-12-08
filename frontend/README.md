# Altamira Hub Frontend

Internal management app for Altamira Software

### Prerequisites

- [Install Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
- [Install Angular CLI](https://angular.io/cli)

### Setup project locally

```bash
git clone https://github.com/Altamira-Software/altamira-app-web.git
cd altamira-app-web
yarn install
ng serve
```

### Import DTO files from server
> **_NOTE:_** DTO files **must not** be manually created or updated!

To import DTO files, start the server and execute the following command from project root:

```bash
sh ./openapi-refresh.sh
```
