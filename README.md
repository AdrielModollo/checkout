# Dependências utilizadas:

# Criar database no mysql

CREATE DATABASE develcode;
use develcode

# Install nest and migrations

1°npm install

2°npm run typeorm:migration:generate
Obs: Caso ocorrer algum erro ao migrar alterar na base de dados: 
1°ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';
2°FLUSH PRIVILEGES;

3°npm run typeorm:migration:run

# Docker container para rabbitMq

1°Baixar serviço rabbitMq no container docker: docker pull rabbitmq:management
2°Iniciar rabbit docker: docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management

# Iniciar projeto

start:dev