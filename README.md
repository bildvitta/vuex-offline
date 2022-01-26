# Vuex Offline
Vuex offline é um gerador de modulos genérico para o vuex integrado com o [rxdb](https://rxdb.info/), utiliza o PouchDB como storage e Couchdb para replicação.

## Instalação
```bash
$ npm i @bildvitta/vuex-offline
```

## API
```js
import {
  PouchDB,
  createDateTime,
  createUUID,
  database,
  find,
  findByIds,
  findOne,
  nestField
}, VuexOffline from '@bildvitta/vuex-offline'

// retorna instancia do PouchDB (https://pouchdb.com/)
console.log(PouchDB)

// retorna data/hora atual
console.log(createDateTime())

// retorna uuid randomico
console.log(createUUID())

// retorna instancia do rxDB da aplicação criado
console.log(database)

// função para buscar varios documentos em uma collection (https://rxdb.info/rx-document.html#find)
console.log(await find('posts', { selector: { isActive: { $eq: true } } }))

// função para buscar um documentos em uma collection por uma lista de ids, tendo um desempenho superior a um find convencional  (https://rxdb.info/rx-database.html)
console.log(await findByIds('posts', ['id1', 'id2']))

// função para buscar um documento em uma collection (https://rxdb.info/rx-document.html#findOne)
console.log(await findOne('posts', { selector: { uuid: { $eq: 'id1' } } }))

const nested = [
  {
    label: '1',
    value: 1,
  },
  
  {
    label: '2',
    value: 2,
    destroyed: true
  }
]

// função para remover todo objeto do array que contenha determinada key, neste caso "destroyed: true"
// Obs: destroyed já é o default, não é necessário passar o valor no segundo parametro
// retorna [{ label: '1', value: 1 }]
console.log(nestField(nested, 'destroyed'))

// VuexOffline
const vuexOffline = new VuexOffline({
  idKey: 'uuid',

  database: {
    name: 'vxoff',
    multiInstance: true,
    ignoreDuplicate: true,
  },

  modules: [
    posts,
    users
  ]
})

// cria e configura o banco de dados
await vuexOffline.createDatabase()

// inicializa todas collections, após este processo, você tem acesso a outros metodos abaixo
await vuexOffline.setupCollections()

// retorna todas as collections
console.log(vuexOffline.getCollections())

// retorna uma collection especifica por nome
console.log(vuexOffline.getCollectionByName())

// retorna todos os modulos
console.log(vuexOffline.getStoreModules())

// define quais collections terão sync e faz o sync
vuexoffline.makeSync(['posts', 'categories'])

// https://rxdb.info/rx-database.html#destroy
await vuexOffline.destroyDatabase()

// https://rxdb.info/rx-database.html#remove
await vuexOffline.removeDatabase()
```

## Uso em desenvolvimento
Vá para o diretório raiz da aplicação do vuexOffline, altere o `main` dentro do `package.json` para: `"main": "./src/index.js"`, dentro do diretório raiz no terminal execute:

```bash
npm link
```

Após isto, abra o terminal no diretório raiz da aplicação que está instalado o VuexOffline, e execute:

```bash
npm link @bildvitta/vuex-offline
```

Pronto, seu projeto está linkado com o VuexOffline, tudo que fizer dentro do VuexOffline será aplicado instantaneamente no seu projeto.

## Uso
Exemplos de modulos:
```js
import { createUUID, createDateTime } from '@bildvitta/vuex-offline'

const posts = {
  // nome da collection
  name: 'posts',

  // o valor default já é 12
  perPage: 12,

  // fields usados para o asteroid
  // https://www.notion.so/API-Design-Patterns-5c2509b697614bbbac49cbed0aab70a1
  fields: {
    title: {
      name: 'title',
      type: 'text',
      label: 'Título'
    },

    isActive: {
      name: 'isActive',
      type: 'boolean',
      label: 'Ativo'
    },

    description: {
      name: 'description',
      type: 'text',
      label: 'Descrição'
    },

    categories: {
      name: 'categories',
      type: 'select',
      label: 'Categorias'
    },

    createdAt: {
      name: 'createdAt',
      type: 'datetime',
      label: 'Criado em'
    },

    updatedAt: {
      name: 'updatedAt',
      type: 'datetime',
      label: 'Atualizado em'
    }
  },

  // rx-schema https://rxdb.info/rx-schema.html
  schema: {
    title: 'Posts Schema',
    version: 0,
    type: 'object',
    primaryKey: 'uuid',
    properties: {
      uuid: {
        type: 'string',
      },

      title: {
        type: 'string',
        minLength: 3,
        maxLength: 255
      },

      isActive: {
        type: 'boolean',
      },

      description: {
        type: 'string',
        minLength: 3,
        maxLength: 255
      },

      categories: {
        type: 'array',
        ref: 'categories',
        items: {
          type: 'string'
        }
      }
    },

    required: [
      'title',
      'isActive',
      'description',
      'categories',
      'createdAt',
      'updatedAt'
    ],

    indexes: ['createdAt']
  },

  // filtros dinamicos do asteroid
  filters: {
    fields: {
      isActive: {
        name: 'isActive',
        type: 'boolean',
        label: 'Ativo'
      },

      categories: {
        name: 'categories',
        type: 'select',
        label: 'Categorias'
      }
    },

    // mesma coisa relationshipt abaixo
    relationship: {
      categories: {
        name: 'categories',
        type: 'select',
        label: 'Categorias'
      }
    },

    // querys para os filtros, usando o mangoquery https://github.com/cloudant/mango
    queryOperators: {
      isActive: '$eq', // tipo de operador que busca por igualdade
      categories: value => ({
        value, // aqui você poderia normalizar o value caso necessário
        operator: '$in', // tipo de operador, nesse caso é para buscar em array
        model: 'categories' // nome do modelo, no caso seria categories
      })
    },

    // seleciona por quais campos será feita a busca na área de "pesquisar"
    search: ['name']
  }

  // sort dos documents por ordem crescente considerando o campo createdAt na listagem
  sort: { createdAt: 'asc' },

  // valor padrão para os campos quando o documento é criado
  defaults: { 
    uuid: createUUID, // gera um random UUID
    createdAt: createDateTime, // pega a data atual
    updatedAt: createDateTime // pega a data atual
  },

  // valor padrão para os campos quando o documento é atualizado
  updateDefaults: {
    updatedAt: createDateTime
  },

  // relacionamentos
  relationships: {
    categories: {
      ref: 'categories', // nome da collection de referência
      label: 'name' // campo da collection de referência que será usado como label, neste caso será o "name"
      value: 'uuid', // campo da collection de referência que será usado como value, neste caso será o "uuid", OBS: o valor default já é uuid, então não é necessário declarar
      methods: [ // o default já é todos esse metodos, mas você pode especificar quais deles você quer usar para pegar o valor do relacionamento automaticamente
        'fetchList',
        'fetchSingleCreate',
        'fetchSingleEdit',
        'fetchSingleShow'
      ]
    },

    // caso catetegories fosse um field type nested no asteroid, seria desta forma:
    // categories: {
    //   category: {
    //     ref: 'categories',
    //     label: 'name',
    //     value: 'uuid'
    //   }
    // }
  },

  // configurações padrão de sync para esta collection
  // https://rxdb.info/replication-couchdb.html
  sync: { 
    options: {
      direction: {
        push: true,
        pull: true
      }
    }
  },

  // rxdb hooks https://rxdb.info/middleware.html
  hooks: {
    // estou sendo chamado antes de criar o documento o/
    preInsert (payload) {
      // todo "title" deve ser em letra minuscula
      payload.title.toLowerCase()
      return payload
    }
  },

  interceptors: {
    // estou sendo chamado antes da action `fetchList` executar a busca no banco e posso alterar a query o/
    preQueryList: ({ search, filters }) => {
      return {
        search,
        filters: {
          ...filters,
          isActive: true
        }
      }
    })
  }

  // Vuex
  actions: {},
  getters: {},
  mutations: {},
  state: {},
}

// categorias
const categories = {
  name: 'categories',

  fields: {
    name: {
      name: 'name',
      type: 'text',
      label: 'Nome'
    },

    type: {
      name: 'type',
      type: 'string',
      label: 'Tipo'
    },

    createdAt: {
      name: 'createdAt',
      type: 'datetime',
      label: 'Criado em'
    },

    updatedAt: {
      name: 'updatedAt',
      type: 'datetime',
      label: 'Atualizado em'
    }
  },

  schema: {
    title: 'Categories Schema',
    version: 0,
    type: 'object',
    primaryKey: 'uuid',
    properties: {
      uuid: {
        type: 'string',
      },

      name: {
        type: 'string',
        minLength: 3,
        maxLength: 255
      },

      type: {
        type: 'string',
        minLength: 3,
        maxLength: 255
      },

      createdAt: {
        type: 'string',
        format: 'date-time'
      },

      updatedAt: {
        type: 'string',
        format: 'date-time'
      }
    },

    required: [
      'name',
      'type',
      'createdAt',
      'updatedAt'
    ],

    indexes: ['createdAt']
  },

  defaults: {
    uuid: createUUID,
    createdAt: createDateTime,
    updatedAt: createDateTime
  },

  updateDefaults: {
    updatedAt: createDateTime
  }
}

export {
  posts,
  categories
}
```

```js
import { posts, categories } from 'caminho-para-o-arquivo-de-exemplo-de-modulos'
import VuexOffline from 'vuex-offline'
import Vuex from 'vuex'

Vue.use(Vuex)

const vuexOffline = new VuexOffline({
  // chave para setar a chave primaria "primaryKey"
  idKey: 'uuid',

  // configuração de criação do banco pelo rxdb
  // https://rxdb.info/rx-database.html#creation
  database: {
    name: 'vxoff',
    multiInstance: true,
    ignoreDuplicate: true,
  },

  // "storage" é o tipo de adapter que será utilizado, existem 2 opções por hora, "idb" (default) e "memory" (muito utilizado para testes, uma vez que não persiste os dados e é muito rápido). Então no caso "idb" não é necessário declarar.
  storage: 'idb', // idb ou memory

  // modulos do vuex modules
  modules: [
    posts,
    categories
  ]

  // configuração geral de sync
  // Obs: essas configurações não sobrepõem as configurações de sync de cada collection
  sync: {
    // https://rxdb.info/replication-couchdb.html
    options: {},
    query: {},

    // callback customizado da aplicação para saber a porcantagem do sync
    onSync: percentage => {
      console.log(percentage)
    }
  },

  interceptors: {
    // toda vez que a action update/replace de QUALQUER module (no nosso exemplo "posts" ou "categories") usado no vuex-offline é chamado, após sua execução, esse callback é chamado.
    postSaveByAction (context) {
      console.log(context)
    }
  }
})

await vuexOffline.createDatabase()
await vuexOffline.setupCollections()

new Vuex.Store({
  modules: {
    ...vuexOffline.getStoreModules()
  }
})
```

## Links úteis
- [RxDB](https://rxdb.info/)
- [Asteroid](http://asteroid.nave.dev/)
- [Asteroid - API Design Patterns](https://www.notion.so/API-Design-Patterns-5c2509b697614bbbac49cbed0aab70a1)
- [PouchDB](https://pouchdb.com/)
- [CouchDB](https://couchdb.apache.org/)
- [Mango](https://github.com/cloudant/mango)
- [VuexStoreModule](https://github.com/bildvitta/vuex-store-module)