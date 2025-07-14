import React from 'react'
import { FixedSizeList, type ListOnItemsRenderedProps } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import CircularProgress from '@mui/material/CircularProgress'

interface ScrollListProps {
    list: number[] | string[]
    getMore: () => void
    hasMorePages: boolean
    title?: string
    isLoading?: boolean
    isLoadingMore?: boolean
    placeholder?: React.ReactElement
}

interface InfiniteLoaderItemProps {
    index: number
    style: React.CSSProperties
}

interface InfiniteLoaderCallbackParams {
    onItemsRendered: (_: ListOnItemsRenderedProps) => React.ReactNode
    ref: React.Ref<FixedSizeList<unknown>> | undefined
}

export default function ScrollList({
    list,
    getMore,
    hasMorePages,
    title,
    isLoading,
    isLoadingMore,
    placeholder,
}: ScrollListProps) {
    const items = list.length ? list : [placeholder || 'The list is empty.']

    const defaultPlaceholder = (
        <div>
            <div>The list is empty.</div>
        </div>
    )

    const itemCount = hasMorePages ? items.length + 1 : items.length
    const loadMoreItems = isLoadingMore ? () => {} : getMore

    function isItemLoaded(index: number) {
        return !hasMorePages || index < items.length
    }

    const Item = ({ index, style }: InfiniteLoaderItemProps) => (
        <div
            style={{
                ...style,
                fontFamily: 'monospace',
                textAlign: 'right',
                fontSize: '20px',
                left: 'unset',
                right: '20px',
            }}
        >
            {list[index]}
        </div>
    )

    let content
    if (isLoading) {
        content = (
            <div
                style={{
                    marginTop: '220px',
                }}
            >
                <CircularProgress />
            </div>
        )
    } else if (!list.length) {
        content = placeholder || defaultPlaceholder
    } else {
        content = (
            <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={itemCount}
                loadMoreItems={loadMoreItems}
            >
                {({ onItemsRendered, ref }: InfiniteLoaderCallbackParams) => (
                    <FixedSizeList
                        itemCount={itemCount}
                        onItemsRendered={onItemsRendered}
                        ref={ref}
                        itemSize={20}
                        height={500}
                        width={400}
                    >
                        {Item}
                    </FixedSizeList>
                )}
            </InfiniteLoader>
        )
    }

    return (
        <div>
            {title && <h4>{title}</h4>}
            <div
                style={{
                    height: '500px',
                    width: '400px',
                    border: '1px solid rgba(255, 255, 255, 0.87)',
                    borderRadius: '5px',
                }}
            >
                {content}
            </div>
        </div>
    )
}
