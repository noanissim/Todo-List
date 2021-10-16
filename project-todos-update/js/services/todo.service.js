'use strict'

var gTodos
var gFilterBy = 'ALL'
var gSortBy = 'CREATED'
var gSortStatusBy = 'TODO'
var gDisplayTodo = 'TABLE'
var gPageIdx = 0
const PAGE_SIZE = 4;


//when clicking > ,increasing the gPageIdx according to the page
function nextPage() {
    gPageIdx++;
    if (gPageIdx * PAGE_SIZE >= gTodos.length || gPageIdx < 0) {
        gPageIdx = 0;
    }
}

//when clicking < ,decreasing the gPageIdx according to the page
function prevPage() {
    gPageIdx--
    if (gPageIdx * PAGE_SIZE >= gTodos.length || gPageIdx < 0) {
        gPageIdx = 0;
    }
}

//when new item is added, this function excecuted
function goToLastPage() {
    var lastPage = Math.ceil(gTodos.length / PAGE_SIZE) - 1
    gPageIdx = lastPage
    return gPageIdx
}

//filter the todos according to the filter request, return the gTodos
function getTodosForDisplay() {
    var fromIdx = gPageIdx * PAGE_SIZE
    sortTodoItems()
    var todos = filterTodos()
    console.log(todos);
    todos = todos.slice(fromIdx, fromIdx + PAGE_SIZE)
    console.log(todos);
    console.log(gPageIdx);
    if (todos || todos.length) return todos
    else {
        prevPage()
        return
    }
}

//filter the gTodos according the filter request
function filterTodos() {
    if (gFilterBy === 'ALL') return gTodos;
    var todos = gTodos.filter(function (todo) {
        return (todo.isDone && gFilterBy === 'DONE') ||
            (!todo.isDone && gFilterBy === 'ACTIVE')
    })
    return todos
}


//sort the gTodos according the sort request
function sortTodoItems() {
    if (!gSortBy) return //if I move up or down with the arrows
    gTodos.sort(function (todo1, todo2) {
        if (gSortBy === 'TXT') {
            if (todo1.txt.toLowerCase() > todo2.txt.toLowerCase()) return 1
            if (todo1.txt.toLowerCase() < todo2.txt.toLowerCase()) return -1
            return 0
        } else if (gSortBy === 'CREATED') return todo1.createdAt - todo2.createdAt
        else return todo2.importance.length - todo1.importance.length
    })
}

//display the user a text if there is nothing to show
function handleNoTodos() {
    console.log(gFilterBy);
    const strHeader = document.querySelector('.if-empty');
    if (gFilterBy === 'ALL') strHeader.innerText = 'No Todos'
    if (gFilterBy === 'DONE') strHeader.innerText = 'No Done Todos'
    if (gFilterBy === 'ACTIVE') strHeader.innerText = 'No Active Todos'
}

//remove the item and save the new gTodos to local storage
function removeTodo(todoId) {
    var isRemove = confirm('Are you sure you want to remove this item?')
    console.log(todoId, '3');

    if (!isRemove) return
    const idx = gTodos.findIndex(todo => todo.id === todoId) //will return the todo that the statement was true about
    gTodos.splice(idx, 1); //cutting it off the array
    _saveTodosToStorage() //saving it in local storage
}

//move the todo up in the list order if the button up is pressed
function moveTodouP(todoId) {
    var todoIndex = gTodos.findIndex(todo => todoId === todo.id)
    if (todoIndex > 0 && gFilterBy === 'ALL') {
        switchTodoPosition(todoId, todoIndex, todoIndex - 1) //the curr tidiId i want to switch, his position, his requested position
    } else return
}

//move the todo down in the list order if the button down is pressed
function moveTodoDown(todoId) {
    var todoIndex = gTodos.findIndex(todo => todoId === todo.id)
    if (todoIndex < gTodos.length - 1 && gFilterBy === 'ALL') {
        switchTodoPosition(todoId, todoIndex, todoIndex + 1) //the curr tidiId i want to switch, his position, his requested position
    } else return
}

//does the switch in positions if it was requested
function switchTodoPosition(todoId, todoCurrIndex, requestedIndex) {
    gSortBy = ''
    //save the todo in temp, put te todo from requested instead of te currIdx, put in the reqested the temp
    var tempTodo = gTodos.find(todo => todo.id === todoId)
    var switchTodo = gTodos.find(todo => todo.id === gTodos[requestedIndex].id)
    gTodos[todoCurrIndex] = switchTodo
    gTodos[requestedIndex] = tempTodo
    _saveTodosToStorage()

}

//edit the data with validation
function editTodo(todoId, txt, importance) {
    const todoIdx = gTodos.findIndex(todo => todo.id === todoId)
    var checkValidTxt = (txt.trim().length) ? true : false
    var regex = /^ *?[123] *?$/
    if (regex.test(importance) && checkValidTxt) {
        gTodos[todoIdx].txt = txt
        gTodos[todoIdx].importance = setImportance(importance)
    }
    _saveTodosToStorage()

}

//adding new task to gTodos with validation ,localstorage and
function addTodo(txt, importance) {
    var checkValidTxt = (txt.trim().length) ? true : false
    // var regex = /^ *?1 *?$|^ *?2 *?$|^ *?3 *?$/
    var regex = /^ *?[123] *?$/
    // console.log(regex.test(importance));
    if (regex.test(importance) && checkValidTxt) {
        const todo = _createTodo(txt, importance)
        gTodos.push(todo);
        _saveTodosToStorage();
    } else if (checkValidTxt) {
        alert('Please enter a valid importance level between 1 to 3')
    } else {
        alert('Please enter a valid text to the task')
    }

}

//return gTodos length
function getTodosCount() {
    return gTodos.length
}

//return active tasks
function getActiveTodosCount() {
    const todos = gTodos.filter(function (todo) {
        return !todo.isDone
    })
    return todos.length
}

//return curr filter
function setFilter(filterBy) {
    gFilterBy = filterBy
}

//return curr sort
function setSort(sortBy) {
    gSortBy = sortBy
}

function setStatus(sortStatusBy) {
    gSortStatusBy = sortStatusBy
    console.log('gSortStatusBy', gSortStatusBy);
}

//toggle the cross line over done todo
function toggleTodo(todoId) {
    const todoIdx = gTodos.findIndex(todo => todo.id === todoId)
    gTodos[todoIdx].isDone = !gTodos[todoIdx].isDone
    _saveTodosToStorage()
}

//return ! emojis by the level of importance
function setImportance(importanceLevel) {
    var str = ''
    var count = 0
    while (count < importanceLevel) {
        str += '❗'
        count++
    }
    return str
}

//save gTodos to storage
function _saveTodosToStorage() {
    saveToStorage('todosDB', gTodos)
}

//creato todo object
function _createTodo(txt, importance) {
    const todo = {
        id: _makeId(),
        txt: txt,
        importance: setImportance(importance),
        isDone: false,
        createdAt: Date.now(),
    }
    return todo;
}

//if todos is empty-render the defaults
function _createTodos() {
    var todos = loadFromStorage('todosDB')
    // Setup Demo data
    if (!todos || !todos.length) {
        //if the array is empty or if its the first time or if this key from localstorage was deleted
        todos = [
            _createTodo('Style with FlexBox', 3),
            _createTodo('Mater your HTML', 2),
            _createTodo('Practice Array Extras', 1),
        ];
    }
    gTodos = todos
    _saveTodosToStorage()
}

//make random id
function _makeId(length = 5) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var txt = '';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}



// function getDate(currDate) {
//     const year = new Date(currDate).getFullYear();
//     const month = new Date(currDate).getMonth();
//     const day = new Date(currDate).getDate();
//     const hours = new Date(currDate).getHours();
//     const minutes = new Date(currDate).getMinutes();
//     const seconds = new Date(currDate).getSeconds();
//     const date = new Date(Date.UTC(year, month, day));
//     const time = new Date(Date.UTC(0, 0, 0, hours, minutes, seconds));
//     const optionsDate = {
//         year: 'numeric',
//         month: 'numeric',
//         day: 'numeric'
//     };
//     const newDate = date.toLocaleDateString('en-GB', optionsDate);
//     const newTime = time.toUTCString().substring(17, 25);
//     return newDate + ' ' + newTime;
// }