# Dolado: Movie Reviews

## Experience

### Como foi a experiência no decorrer de todo o processo de desenvolvimento?

A experiência no desenvolvimento da aplicação foi tranquila, mas tive que me controlar para evitar over engineering, já que o problema era relativamente simples. O desafio foi principalmente na definição da arquitetura, onde precisei manter o foco em soluções objetivas e práticas, sem adicionar complexidade desnecessária.


### Quais foram as principais decisões tomadas?

As principais decisões foram priorizar o desacoplamento do repository e da API de busca de informações dos filmes, além de criar entidades para que quando houver mais regras de negócio fiquem isoladas e não vazem para a camada de service. 

### Como foi organizado o projeto em termos de estrutura de pastas e arquivos?

Organizei os módulos da aplicação na pasta `modules`, e cada módulo segue a estrutura: `entity` para as entidades de negócio, `controller` para os controladores e DTOs que chamam os services, `service` separado por fluxo/operação, e `infrastructure` para implementações de repositórios e schemas.

### Instruções de como rodar o projeto.

O projeto pode ser executado utilizando o docker compose. Lembrando de criar o .env na raiz do projeto com as seguintes variaveis. 
```
OMDB_API_KEY=<sua-api-key>
DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=example
DB_NAME=app_database
```
`AVISO`: Por estar rodando no Docker, o DB_HOST deve ser o nome do container do banco de dados definido no arquivo `docker-compose.yml`. Geralmente, é `db` se não tiver sido alterado.

Após os contêineres serem iniciados, você pode acessar a documentação da aplicação através do navegador, usando o endereço:

``` http://localhost:3000/docs ```

## O Desafio
Você é um programador backend que já trabalha a muito tempo na área e, apesar de trabalhar duro durante a semana, seu hobby preferido sempre foi avaliar filmes. Tendo feito isso durante anos, suas anotações começaram a se perder entre os arquivos de um computador e outro e você teve a brilhante ideia de organizá-las numa api simples, de modo que pudesse sempre voltar e encontrar facilmente suas anotações sobre os filmes já vistos.

No intuito de desenvolver a api, como qualquer bom programador, você ficou com preguiça de preencher repetidamente uma infinidade de dados sobre cada filme assistido e resolveu simplificar a vida integrando com um serviço já existente ([The Open Movie Database](https://www.omdbapi.com/)).

Entre todas as suas anotações de filmes, encontramos também um esboço da api que você irá montar.

Começando por uma rota de criação de anotações: nela, a ideia é integrar com a api do OMDB e salvar todas as informações que julgar relevante para o banco de dados, trazendo obrigatoriamente a data de lançamento (campo "Released" da api do OMDB) e avaliação (campo "imdbRating" da api do OMDB), em conjunto com o "body" abaixo.  
```
Endpoint: '/movie-reviews'
Método: 'POST'
Body: {
    "title": string; // título é o que será usado para buscar as demais informações no OMDB
    "notes": string; // minhas anotações
}
```

Uma sugestão é usar o seguinte endpoint do OMDB para buscar as informações extras sobre o título em questão:
```
curl --location 'http://www.omdbapi.com/?apikey=aa9290ba&t=assassins%2Bcreed'
```

---

Em seguida, uma rota para listar as suas anotações. Nesta rota, você mesmo deixou como futura melhoria os filtros na query e a ordenação:
```
Endpoint: '/movie-reviews'
Método: 'GET'
```
**Opcional**
- Ter a capacidade de ordenar por data de lançamento e avaliação, de maneira ascendente ou descendente.
- Capacidade de filtrar as suas anotações por título, atores ou diretores (caso preciso, incluir os demais campos no banco de dados).

---

Listar uma anotação específica:
```
Endpoint: '/movie-reviews/:id'
Método: 'GET'
```

---

Atualizar uma anotação:
```
Endpoint: '/movie-reviews/:id'
Método: 'PUT'
```

---

Deletar uma anotação:
```
Endpoint: '/movie-reviews/:id'
Método: 'DELETE'
```

---

### Extra

Opcionalmente, encontramos algumas ideias de implementação que você deixou anotado mas acabou não tendo tempo de levar adiante:
```
TODO: Colocar paginação nas rotas de listagens
TODO: Ter uma boa documentação de todas as rotas da api e disponibilizá-las no endpoint "/docs"
TODO: Disponibilizar a api na internet. Para isso, gostaria de contar as visualizações que cada uma das minhas anotações vêm tendo. Criar também uma outra rota de listagem pra mostrar as mais visualizadas.
```

### Instruções de como gerar a chave de API
Você pode gerar a sua chave de api diretamente no site do [OMDB Api Keys](https://www.omdbapi.com/apikey.aspx). Um email de confirmação deve chegar na sua conta com as credenciais e você só precisa clicar no link para ativá-las.

Caso queira utilizar a nossa:
```
apikey: aa9290ba
```

### Requisitos do projeto
- API Rest em Typescript desenvolvida utilizando o framework [NestJS](https://nestjs.com/)
- Utilização do [Typeorm](https://docs.nestjs.com/recipes/sql-typeorm) para se comunicar com o banco de dados
- Banco de dados [MySQL](https://www.mysql.com/)



