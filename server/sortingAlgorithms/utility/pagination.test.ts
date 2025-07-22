import { paginate } from './pagination'

function createTestList(length) {
  const list: number[] = []
  for (let i = 0; i < length; i++) {
    list.push(i)
  }
  return list
}

describe('createTestList', () => {
  test('creates a list of requested length', () => {
    expect(createTestList(100).length).toBe(100)
  })
})

describe('paginate', () => {
  const list = createTestList(100)

  test('first page begins at the correct element', () => {
    const options = {
      pageSize: 10,
      page: 1,
    }
    const { list: listPage } = paginate(list, options)
    expect(listPage[0]).toBe(0)
  })

  test('first page is the correct number of elements long', () => {
    const options = {
      pageSize: 10,
      page: 1,
    }
    const { list: listPage } = paginate(list, options)
    expect(listPage.length).toBe(10)
  })

  test('first page ends at the correct element', () => {
    const options = {
      pageSize: 10,
      page: 1,
    }
    const { list: listPage } = paginate(list, options)
    expect(listPage[9]).toBe(9)
  })

  test('second page begins at the correct element', () => {
    const options = {
      pageSize: 10,
      page: 2,
    }
    const { list: listPage } = paginate(list, options)
    expect(listPage[0]).toBe(10)
  })
})
