export default function createList(length) {
    const list: number[] = []
    const size = length || 10000
    let count = 0
    while (count < size) {
        const value = Math.round(Math.random() * size)
        list.push(value)
        count++
    }
    return list
}
