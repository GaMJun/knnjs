[![Univita](https://i.imgur.com/se3gbwm.png)](http://www.univitasaude.com.br/)

# Api Univita

> Esta API fornece rotas para gerenciar usuários, médicos, pacientes, secretárias bem como agendar e desmarcar consultas. Também é possível armazenar o prontuário do paciente e ainda notícias em um blog de saúde.

## Instalação

### Clone
- Clone este repositório em sua máquina `https://github.com/GaMJun/Api-Monolitico`

### Setup

> Baixe a versão LTS do nodejs em `https://nodejs.org/` e abra o terminal no local salvo

```shell
sudo mkdir /usr/local/lib/nodejs
sudo tar -xJvf NOMEDOARQUIVO.tar.xz -C /usr/local/lib/nodejs 
sudo mv /usr/local/lib/nodejs/NOMEDOARQUIVO /usr/local/lib/nodejs/node-VERSAOBAIXADA
```

> Agora abra seu arquivo de variáveis de ambiente `~/.bashrc` em seu editor preferido, e adicione ao final

```shell
# Nodejs
export NODEJS_HOME=/usr/local/lib/nodejs/node-$VERSION/bin
export PATH=$NODEJS_HOME:$PATH
```

> Atualize o arquivo de variáveis de ambiente no terminal

```shell
. ~/.bashrc
```

> Teste a instalação

```shell
node -v
npm version
```

> Output normal

```shell
➜  node -v
v10.15.0
➜  npm version
{ npm: '6.4.1',
  ares: '1.15.0',
  cldr: '33.1',
  http_parser: '2.8.0',
  icu: '62.1',
  modules: '64',
  napi: '3',
  nghttp2: '1.34.0',
  node: '10.15.0',
  openssl: '1.1.0j',
  tz: '2018e',
  unicode: '11.0',
  uv: '1.23.2',
  v8: '6.8.275.32-node.45',
  zlib: '1.2.11' }
```

> Instale a última versão do yarn

```shell
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
```

```shell
sudo apt-get update
``` 

```shell
sudo apt-get install yarn
``` 

> Instale a última versão do mongoDB
```shell
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
```

```shell
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
``` 

```shell
sudo apt-get update
``` 

```shell
sudo apt-get install -y mongodb-org
``` 

---

## Must Know
>Para usar o populate.js

```shell
sudo service mongod start
mongo < populate.js
``` 

>Algum problema não relatado

```shell
sudo killall -9 node 
sudo service mongod start
sudo yarn run dev
``` 

>Iniciar API

```shell
sudo yarn run dev
``` 

>Iniciar serviço do mongoDB e abrir o banco

```shell
sudo service mongod start
sudo mongo univita
``` 

>Documentacão do mongoose `https://mongoosejs.com/docs/api.html`
---

<h2><a href="https://documenter.getpostman.com/view/6350371/RznFqJcf" target="_blank">Documentação</a></h2>

<h2><a href="https://docs.google.com/spreadsheets/d/1T8sz7mWGaATyuJIkEr21ud1jPHCLHMWq9Xq3EyFTKyw" target="_blank">Collections</a></h2>

## Time

> Nosso time de desenvolvimento

| <a href="https://github.com/GaMJun" target="_blank">**Gilberto Antunes**</a> | <a href="https://github.com/MuriloSchaefer" target="_blank">**Murilo Schaefer**</a> | <a href="https://github.com/murillomachado" target="_blank">**Murillo Machado**</a> | <a href="https://github.com/brendoperes1" target="_blank">**Brendo Peres**</a> |
|:---:|:---:|:---:|:---:|
| <a href="https://www.linkedin.com/in/gamjun"><img alt="Gilberto Antunes" src="https://avatars0.githubusercontent.com/u/27792876" width="150" height="150"></a> | <a href="https://www.linkedin.com/in/murilo-schaefer-82a7b992"><img alt="Murilo Schaefer" src="https://avatars1.githubusercontent.com/u/14366202" width="150" height="150"></a> | <a href="https://www.linkedin.com/in/murillo-machado-73623091"><img alt="Murillo Machado" src="https://avatars1.githubusercontent.com/u/15464958" width="150" height="150"></a> | <a href=""><img alt="Brendo Peres" src="https://avatars2.githubusercontent.com/u/28881972" width="150" height="150"></a> |
| <a href="https://github.com/GaMJun" target="_blank">`  github.com/gamjun  `</a> | <a href="https://github.com/MuriloSchaefer" target="_blank">`github.com/MuriloSchaefer`</a> | <a href="https://github.com/murillomachado" target="_blank">`github.com/murillomachado`</a> | <a href="https://github.com/brendoperes1" target="_blank">`github.com/brendoperes1`</a> |

---

<!--## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2015 © <a href="http://fvcproductions.com" target="_blank">FVCproductions</a>.
