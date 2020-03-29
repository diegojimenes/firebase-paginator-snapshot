export var data = {}
var listeners = []    // list of listeners
var end = {}       // end position of listener
var changes = []
var status = ""

const retirarDaLista = () => {
    changes = []
}

const atualizarLista = (changes, key) => {
    changes.forEach(change => {
        switch (change.type) {
            case 'removed': {
                delete data[key][change.doc.id];
                break;
            }
            case 'added': {
                data = { ...data, [key]: { ...data[key], [change.doc.id]: change.doc.data() } }
                break;
            }
            default: {
                data = { ...data, [key]: { ...data[key], [change.doc.id]: change.doc.data() } }
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

const handleSnap = (limit, callback, key) => (snap) => {
    changes = [...snap.docChanges()]
    end[key] = snap.docs[snap.docs.length - 1]
    atualizarLista(changes, key)
    verificarSeQueryTemResultados(limit, snap)
    retirarDaLista()
    return callback({ data: toArray(data[key]) })
}

const saveListeners = (query, callback, limit, key) => {
    let listener = query;
    if (end[key]) {
        //após a primeira query, existe o start after.
        listener = listener.startAfter(end[key])
    }
    //padrão que todas as querys terão.
    listener = listener.limit(limit)
        .onSnapshot(handleSnap(limit, callback, key))
    listeners.push(listener)
}
/**
 * Get: chamando quando deseja obter registros, iniciais ou nao.
 */
export const paginator = () => ({
    get: (query, callback, limit, key) => {
        saveListeners(query, callback, limit, key)
    },
    getMultiple: (querys, callback, limit, key) => {
        querys.forEach((query) => saveListeners(query, callback, limit, key))
    },
    clear: () => {
        // limpa todos os registros do paginator
        data = {}
        listeners = []
        end = {}
        changes = []
        status = ""
    },
    offListeners: () => {
        //desliga os listeber
        listeners.forEach(listener => listener())
    },
    hasEnded: () => status
})