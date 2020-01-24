var data = {}
var listeners = []
var end = null
var changes = []
var status = ""

const retirarDaLista = () => {
    var n = []
    changes.forEach((e) => {
        if (!e.type == 'removed' && e.doc.id) {
            n.push(e)
        }
    })
    changes = n
}

const retirarRemovidos = (changes, docs) => {
    var idsRemove = changes.map(({ type, doc }) => type == 'removed' && doc.id)
    var n = []
    docs.forEach((r) => {
        if (!idsRemove.find((e) => e == r.id)) {
            n.push(r)
        }
    })
    return n
}

const verificarSeQueryTemResultados = (limit, snapshots) => {
    if (limit == snapshots.size) {
        status = false;
    } else {
        status = true;
    }
}

export default testePaginator = () => ({
    get: (query, callback, limit) => {
        return query
            .limit(limit).onSnapshot((snapshots) => {
                // definindo o fim da ultima lista
                end = snapshots.docs[snapshots.docs.length - 1]
                let listener = query
                    .limit(limit)
                    .onSnapshot((snap) => {
                        snap.forEach((roteiro) => {
                            roteiros = {
                                ...roteiros, [roteiro.id]: roteiro.data()
                            }
                        })
                        return callback({ data: toArray(roteiros) })
                    })
                verificarSeQueryTemResultados(limit, snapshots)
                listeners.push(listener)
            })
    },
    more: (query, callback, limit) => {
        return query
            .startAt(end)
            .limit(limit).onSnapshot((snapshots) => {
                // definindo o fim da ultima lista
                end = snapshots.docs[snapshots.docs.length - 1]
                let listener = query
                    .startAt(end)
                    .limit(limit)
                    .onSnapshot((snap) => {
                        // guardando alterações do snapshot para verificar se tem algum item pra deletar
                        changes = [...changes, ...snap.docChanges()]
                        snap.forEach((roteiro) => {
                            roteiros = {
                                ...roteiros, [roteiro.id]: roteiro.data()
                            }
                        })
                        // salvando novos dados e verificando se tem algum para deletar
                        return callback({ data: retirarRemovidos(changes, toArray(roteiros)) })
                    })
                listeners.push(listener)
                verificarSeQueryTemResultados(limit, snapshots)
                retirarDaLista()
            })
    },
    offListeners: () => {
        listeners.forEach(listener => listener())
    },
    hasEnded: () => status
})