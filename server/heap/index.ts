// https://en.wikipedia.org/wiki/Heap_(data_structure)

enum HeapTypes {
    MIN,
    MAX,
}

export class Heap {
    array = []
    type = HeapTypes.MAX

    constructor(array, type) {
        if (array) {
            this.array = array
        }

        if (type) {
            this.type = type
        }
    }

    // BASIC

    findMax() {}

    insert() {}

    extractMax() {}

    deleteMax() {}

    replace() {}

    // CREATION

    createHeap() {}

    heapify() {}

    merge() {}

    meld() {}

    // INSPECTION

    size() {}

    isEmpty() {}

    // INTERNAL

    // Performs increase-key if a max-heap or decrease-key if a min-heap
    incrementKey() {}

    delete() {}

    siftUp() {}

    siftDown() {}
}
