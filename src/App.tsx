import React, {useState} from 'react';
import './App.css';


type TaskType = {
    id: number
    title: string
}

type TasksType = TaskType[]

type BordType = {
    id: number
    title: string
    items: TasksType
}

type BoardsType = BordType[]

export const App = () => {
    const [boards, setBoards] = useState<BoardsType>([
        {
            id: 1,
            title: 'Need to do',
            items: [{id: 1, title: 'Buy house'}, {id: 2, title: 'Buy car'}, {id: 3, title: 'Buy TV'}]
        },
        {
            id: 2,
            title: 'Check',
            items: [{id: 4, title: 'Ivan`s code'}, {id: 5, title: 'Toma`s code'}, {id: 6, title: 'My code'}]
        },
        {
            id: 3,
            title: 'Done',
            items: [{id: 7, title: 'Make a video'}, {id: 8, title: 'Get post'}, {id: 9, title: 'Create SPA'}]
        },
    ])

    const [currentBoard, setCurrentBoard] = useState<BordType>()
    const [currentItem, setCurrentItem] = useState<TaskType>()

    const dragOverHandler = (e: any) => {
        e.preventDefault()
        if (e.target.className === 'item') {
            e.target.style.boxShadow = '0 4px 3px gray'
        }
    }
    const dragLeaveHandler = (e: any) => {
        e.target.style.boxShadow = 'none'
    }
    const dragEndHandler = (e: any) => {
        e.target.style.boxShadow = 'none'
    }
    const dragStartHandler = (e: any, board: BordType, item: TaskType) => {
        setCurrentBoard(board)
        setCurrentItem(item)

    }
    const dropHandler = (e: any, board: BordType, item: TaskType) => {
        e.preventDefault()
        e.stopPropagation()

        if (!currentBoard || !currentItem) return;

        const currentIndex = currentBoard?.items.indexOf(currentItem ?? undefined);
        if (currentIndex !== undefined) {
            currentBoard?.items.splice(currentIndex, 1);
        }

        const dropIndex = board?.items.indexOf(item);
        if (dropIndex !== undefined) {
            board.items.splice(dropIndex + 1, 0, currentItem ?? undefined);
        }

        setBoards(boards.map(b => {
            if (b.id === board.id) {
                return board
            }
            if (currentBoard && b.id === currentBoard.id) {
                return currentBoard
            }
            return b
        }))

    }

    const dropCardHandler = (e: any, board: BordType) => {
        e.preventDefault()
        e.stopPropagation()

        if (!currentItem || !currentBoard) return;

        currentItem && board.items.push(currentItem)
        const currentIndex = currentBoard.items.indexOf(currentItem);
        if (currentIndex !== -1) {
            currentBoard.items.splice(currentIndex, 1);
        }

        setBoards(boards.map(b => {
            if (b.id === board.id) {
                return board
            }
            if (currentBoard && b.id === currentBoard.id) {
                return currentBoard
            }
            return b
        }))

    }

    return (
        <div className={'app'}>
            {boards.map(board =>
                <div key={board.id} className={'board'}
                     onDragOver={(e) => dragOverHandler(e)}
                     onDrop={(e) => dropCardHandler(e, board)}
                >
                    <div className={'board__title'}>{board.title}</div>
                    {board.items.map(item =>
                        <div
                            onDragOver={(e) => dragOverHandler(e)}
                            onDragLeave={(e) => dragLeaveHandler(e)}
                            onDragStart={(e) => dragStartHandler(e, board, item)}
                            onDragEnd={(e) => dragEndHandler(e)}
                            onDrop={(e) => dropHandler(e, board, item)}
                            key={item.id} className={'item'} draggable={true}>{item.title}</div>
                    )}
                </div>)}
        </div>
    );
}

