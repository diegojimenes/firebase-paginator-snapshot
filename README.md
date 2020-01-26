# firebase-paginator-snapshot

install package

```sh
$ npm install firebase-paginator-snapshot
```
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

paginator().get(QUERY(), callback(), limit)
```

- get more items

```javascript
const limit = 10
const callback = ({data}) => {
  console.log(data)
}

paginator().get(QUERY(), callback(), limit)
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
