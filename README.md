# firebase-paginator-snapshot

install package

```sh
$ npm install firebase-paginator-snapshot
```

### get parameters
List of params

name       | Type    | Description
---------- | ------- | ---------- |
query | Function | Query from firebase
callback | Function | function for received results from firebase query
limit | Number | limit of documents firebase must return
key | String | key to identify your data in the paginator object



```javascript
import paginator from 'firebase-paginator-snapshot'
```

how to use

- create default query

```javascript
import firebase from 'firebase'

const QUERY = () =>
    firebase
    .firestore()
    .collection("list")
    .where("x","==","y")
```

- get first items

```javascript
const limit = 10
const callback = ({data}) => {
  console.log(data)
}

paginator().get(QUERY(), callback, limit, 'key')
```

- get more items

```javascript
const limit = 10
const callback = ({data}) => {
  console.log(data)
}

paginator().get(QUERY(), callback, limit, 'key')
```

- verify end of query

```javascript
paginator().hasEnded()
// return a boolean
```

- shotdown all listeners

```javascript
paginator().offListeners()
```
