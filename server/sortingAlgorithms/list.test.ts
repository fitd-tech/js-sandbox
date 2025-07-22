import createList from './list'

describe('createList', () => {
  test('creates a list of requested length', () => {
    expect(createList(100).length).toBe(100)
  })
})
