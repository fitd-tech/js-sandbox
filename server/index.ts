import express from 'express'
import cors from 'cors'
import createList from './sortingAlgorithms/list.ts'
import { selectionSortIntuited } from './sortingAlgorithms/algorithms/selectionSortIntuited.ts'
import { bubbleSortIntuited } from './sortingAlgorithms/algorithms/bubbleSortIntuited.ts'
import { insertionSortIntuited } from './sortingAlgorithms/algorithms/insertionSortIntuited.ts'
import { mergeSortIntuited } from './sortingAlgorithms/algorithms/mergeSortIntuited.ts'
import { paginate } from './sortingAlgorithms/utility/pagination.ts'
import { getPerformanceDuration } from './sortingAlgorithms/utility/performance.ts'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json({ limit: '50mb' }))

const LIST_SIZE_LIMIT = 1000000

let savedList: number[] = []
let savedSortedList: number[] = []

app.post('/list', (req, res) => {
    console.log('someone hit /list')
    const { listSize, pageSize, page } = req.body
    console.log('listSize from /list', listSize)
    console.log('pageSize from /list', pageSize)
    console.log('page from /list', page)
    if (listSize < 1 || listSize > LIST_SIZE_LIMIT) {
        const errorData = {
            error: 'Invalid list size requested. Please request a list size between 1 and 10,000.',
        }
        res.status(400).json(errorData)
    } else if (pageSize === undefined) {
        const errorData = {
            error: 'Please include a page size in your request.',
        }
        res.status(400).json(errorData)
    } else if (listSize) {
        savedList = createList(listSize)
        const paginationOptions = {
            pageSize,
            page: 1,
        }
        res.json(paginate(savedList, paginationOptions))
    } else {
        res.json(paginate(savedList, req.body))
    }
})

function buildSortResponse(req, res, sortFunc) {
    const { pageSize, page } = req.body
    console.log('req.body', req.body)
    if (pageSize === undefined) {
        const errorData = {
            error: 'Please include a page size in your request.',
        }
        res.status(400).json(errorData)
    } else if (page === undefined) {
        const { result: sortedList, duration } = getPerformanceDuration(() =>
            sortFunc(savedList)
        )
        savedSortedList = sortedList
        const paginationOptions = {
            pageSize,
            page: 1,
        }
        const data = {
            ...paginate(savedSortedList, paginationOptions),
            duration,
        }
        console.log('data', data)
        res.json(data)
    } else {
        res.json(paginate(savedSortedList, req.body))
    }
}

app.post('/selection-sort/intuited', (req, res) => {
    console.log('someone hit /selection-sort/intuited')
    buildSortResponse(req, res, selectionSortIntuited)
})

app.post('/bubble-sort/intuited', (req, res) => {
    console.log('someone hit /bubble-sort/intuited')
    buildSortResponse(req, res, bubbleSortIntuited)
})

app.post('/insertion-sort/intuited', (req, res) => {
    console.log('someone hit /insertion-sort/intuited')
    buildSortResponse(req, res, insertionSortIntuited)
})

app.post('/merge-sort/intuited', (req, res) => {
    console.log('someone hit /merge-sort/intuited')
    buildSortResponse(req, res, mergeSortIntuited)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
