# Projeto NestJS com RabbitMQ, MySQL e TypeORM

Este projeto utiliza NestJS para criar uma API para gerenciamento de pedidos, RabbitMQ para filas de mensagens, MySQL como banco de dados e TypeORM para migrações e interações com o banco. Abaixo estão os passos para configuração, execução e testes do projeto.

## Dependências utilizadas:

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [MySQL](https://www.mysql.com/)
- [Swagger](https://swagger.io/)
- [Winston](https://github.com/winstonjs/winston)

## Configuração

### 1. Criar Banco de Dados MySQL

Execute os seguintes comandos para criar e configurar o banco de dados:

```sql
CREATE DATABASE develcode;
USE develcode;
```

### 2. Instalar as Dependências

Instale as dependências do projeto com o seguinte comando:

```bash
npm install
```

3. Gerar e Rodar Migrações TypeORM
Gere as migrações do banco de dados:

```bash
npm run tsc
```

```bash
npm run typeorm:migration:generate
```

Caso ocorra algum erro ao gerar as migrações, altere a configuração de autenticação do MySQL para mysql_native_password:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';
FLUSH PRIVILEGES;
```

Depois, execute as migrações:
```bash
npm run typeorm:migration:run
```

### 4. Docker - Configuração RabbitMQ

Baixar e Iniciar o RabbitMQ no Docker

Baixe a imagem do RabbitMQ com o seguinte comando:

```bash
docker pull rabbitmq:management
Inicie o container do RabbitMQ:
```

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
Acesso ao RabbitMQ
URL: http://localhost:15672
Usuário: guest
Senha: guest
```

### 5. Iniciar o Projeto
Para iniciar o projeto em modo de desenvolvimento, execute o seguinte comando:

```bash
npm run start:dev
O servidor estará disponível em http://localhost:3000.
```

### 6. Testes
Execute os testes de cobertura com o comando:

```bash
npm run test:cov
```

### 7. Instruções para uso de JWT eterno no teste

Para os testes, é necessário utilizar um JWT eterno (que nunca expira). Você pode:

- Utilizar o JWT gerado no arquivo .env.test: Se já houver um JWT configurado no arquivo .env.test, você pode usá-lo diretamente.

- Gerar um novo JWT: Caso precise de um novo JWT, você pode gerar um token de longa duração (eterno). Para isso, siga o processo de geração de JWT conforme necessário para a sua aplicação.

Configuração na rota Swagger:

Ao testar a API via Swagger, insira o token JWT no campo de autorização. O Swagger geralmente possui um campo chamado Authorization onde você deve fornecer o token no formato:

```bash
Bearer <seu_token_aqui>
```

Configuração no Postman ou outra ferramenta de teste:

Ao realizar requisições no Postman ou em outra ferramenta de teste, adicione o JWT no cabeçalho da requisição, na seção Authorization. O formato correto também será:

```bash
Bearer <seu_token_aqui>
```

Exemplo de como preencher o campo no Postman:

```bash
Cabeçalho:
Key: Authorization
Value: Bearer <seu_token_aqui>
```

Observação:
Se você estiver utilizando um JWT com expiração definida (mesmo que longa), certifique-se de que o token não tenha expirado antes de realizar os testes.

### 8. Acessar a Documentação Swagger
A documentação da API pode ser acessada através de:

```bash
http://localhost:3000/api
```

### 9. Verificar a Fila RabbitMQ
Acesse a interface do RabbitMQ para visualizar as filas:

```bash
http://localhost:15672
Usuário: guest
Senha: guest
```


### 10. Estrutura de Pastas

- src/app/modules: Módulos do NestJS.
- src/app/config: Configurações como RabbitMQ e autenticação.
- src/app/entities: Entidades do TypeORM (Ex: Order).
- src/app/controllers: Controladores para as rotas da API.
- src/app/services: Serviços para lógica de negócios.
- src/app/dto: Objetos de transferência de dados (DTOs).
- src/app/communs: Utilitários e loggers.
- __tests__ : testes unitários