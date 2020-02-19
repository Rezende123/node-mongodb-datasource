# mongodb-datasource

## CONEXÃO COM O BANCO DE DADOS

Para fazer sua conexão com o banco basta importar a classe [Datasource](./src/index.js) e no construtor inserir a url de conexão, como ocorre no [exemplo](./test/test.js), então vai poder chamar o método _connectToDatabase()_ e esperar.

## BUSCA

A busca é feita através do método _.find(nome-database, nome-collection, filtro-de-busca, opções)_ onde:

* Filtro de busca: Funciona como o [filtro do busca do mongodb](https://docs.mongodb.com/manual/reference/operator/query/), todos os operadores podem ser utilizados.
* Opções: A principal opção é o campo **_include_**, que é definida por um vetor de objetos do tipo _{model, foreignKey, field}_, **modelo** é o nome da collection, **foreignKey** é o nome do campo na collection que está sendo buscada e **field** que é o campo em que será criado o objeto embarcado. As demais opções são **_limit_**, **_sort_**, **_skip_**, que funcionam como os respectivos operadores da [documentação do mongodb](https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/).


## Instalação

    npm install mongodb-datasource