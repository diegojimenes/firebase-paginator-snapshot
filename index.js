var data = {}
var listeners = []    // list of listeners
var end = null       // end position of listener
var changes = []
var status = ""

const retirarDaLista = () => {
    changes = []
}

const atualizarLista = (changes) => {
    changes.forEach(change => {
        switch (change.type) {
            case 'removed': {
                delete data[change.doc.id];
                break;
            }
            case 'added': {
                data[change.doc.id] = change.doc.data();
                break;
            }
            default: {
                data[change.doc.id] = change.doc.data();
            }
        }
    })
}

const verificarSeQueryTemResultados = (limit, snapshots) => {
    if (limit == snapshots.size) {
        status = false;
    } else {
        status = true;
    }
}

const handleSnap = (limit, callback) => (snap) => {
    changes = [...snap.docChanges()]
    end = snap.docs[snap.docs.length - 1]
    atualizarLista(changes)
    verificarSeQueryTemResultados(limit, snap)
    retirarDaLista()
    return callback({ data: toArray(data) })
}
/**
 * Get: chamando quando deseja obter registros, iniciais ou nao.
 */
export default paginator = () => ({
    get: (query, callback, limit) => {
        let listener = query;
        if (end != null) {
            //após a primeira query, existe o start after.
            listener = listener.startAfter(end)
        }
        //padrão que todas as querys terão.
        listener = listener.limit(limit)
            .onSnapshot(handleSnap(limit, callback))
        listeners.push(listener)
    },
    offListeners: () => {
        //desliga os listeber
        listeners.forEach(listener => listener())
    },
    hasEnded: () => status
})