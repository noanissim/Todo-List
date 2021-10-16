'use strict'


//render only the requested todos by the filter of select(option)
function renderTodos(selector) {
    if (gDisplayTodo === 'TABLE') {


        const todos = getTodosForDisplay();
        var strHeader = `<table><thead>
          <th>ID</th>
            <th>Task Name</th>
           <th>Importance</th>
          <th>Status</th>
          <th>Edit</th>
          <th>Remove</th>
          <th>Change Order</th>
           </thead>
          <tbody class="table-body">`
        // console.log(strHeader);

        var strHtmls = todos.map(function (todo) {
            // var status = (todo.isDone) ? 'TODO' : 'COMPLETE'
            return `<tr class="${!todo.isDone ? 'row': 'row complete'}"> 
            <td class="todoId">${todo.id}</td>
            <td class="todoTxt">${todo.txt}</td>
            <td class="todoImp">${todo.importance}</td>
            <td class="todoStatus">
                <input class="input-checkbox" type="checkbox" ${todo.isDone?'checked':''} onchange="onSetStatus(this.value, '${todo.id}')">
            </td>
            <td class="todoEdit ${todo.isDone ? 'disable-btn' : ' '}">
                <button class="edit-btn" onclick="onEditTodo('${todo.id}')">Edit</button>
            </td>
            <td class="todoRemove">
                <button class="remove-btn" onclick="onRemoveTodo('${todo.id}')">Remove</button>
            </td>
            <td class="todoOrder">
                <button class="arrow-up" onclick="onMoveTodoUp( '${todo.id}')" >⬆</button>
                <button class="arrow-down" onclick="onMoveTodoDown( '${todo.id}')" >⬇</button>
            </td>
        </tr>`
        }).join('')
        if (!todos.length) {
            handleNoTodos()
        } else document.querySelector('.if-empty').innerText = '';

        // console.log(strHtmls);
        strHeader += strHtmls + `</tbody></table>`
        document.querySelector(selector).innerHTML = strHeader //to cancel the , of converting the array to string

        document.querySelector('.total-count').innerText = getTodosCount();
        document.querySelector('.active-count').innerText = getActiveTodosCount();
    } else onCardsSelection()
}


//render only the requested todos by the filter of select(option) in cards form
function renderTodosCards(selector) {
    console.log(selector);
    const todos = getTodosForDisplay()

    var strHtmls = todos.map(function (todo) {
        return `<div class="card">
            <h2>Task name: <br>${todo.txt}</h2>
            <p>ID: ${todo.id}</p>
            <p>Importance: ${todo.importance}</p>

            <p class="todoStatus">Status:<input class="input-checkbox" type="checkbox" ${todo.isDone?'checked':''} onchange="onSetStatus(this.value, '${todo.id}')"></p>

            <p class="todoEdit "><button class="edit-btn" onclick="onEditTodo('${todo.id}')">Edit</button></p>

            <p class="todoRemove"><button class="remove-btn" onclick="onRemoveTodo('${todo.id}')">Remove</button></p>

            <p class="todoOrder">Change Order<br><button class="arrow-up" onclick="onMoveTodoUp( '${todo.id}')" >⬆</button><br><button class="arrow-down" onclick="onMoveTodoDown( '${todo.id}')" >⬇</button><p>
        </div>`
    }).join('')
    if (!todos.length) {
        handleNoTodos()
    } else document.querySelector('.if-empty').innerText = '';

    document.querySelector(selector).innerHTML = strHtmls //to cancel the , of converting the array to string
    document.querySelector('.total-count').innerText = getTodosCount();
    document.querySelector('.active-count').innerText = getActiveTodosCount();

}

//handels with the table selection view
function onTableSelection() {
    gDisplayTodo = 'TABLE'
    renderTodos('.table-container')
}

//handels with the cards selection view
function onCardsSelection() {
    gDisplayTodo = 'CARDS'
    renderTodosCards('.table-container')
}

//calls the move up function 
function onMoveTodoUp(todoId) {
    console.log('UP todo', todoId);
    moveTodouP(todoId)
    if (gDisplayTodo === 'TABLE') renderTodos('.table-container')
    else renderTodosCards('.table-container')
}

//calls the move down function 
function onMoveTodoDown(todoId) {
    console.log('DOWN todo', todoId);
    moveTodoDown(todoId)
    if (gDisplayTodo === 'TABLE') renderTodos('.table-container')
    else renderTodosCards('.table-container')

}

//calls the remove function
function onRemoveTodo(todoId) {
    console.log(todoId, '1');
    //ev.stopPropagation(); //to cancel the function of the click on the li
    console.log('Removing todo', todoId, '2');
    removeTodo(todoId); //happens in the services(the model in MVC)
    if (gDisplayTodo === 'TABLE') renderTodos('.table-container')
    else renderTodosCards('.table-container')
}

//calls the add function
function onAddTodo() {
    const elTxt = document.querySelector('.input-task');
    const elImpor = document.querySelector('.input-importance');
    const txt = elTxt.value
    const importance = parseInt(elImpor.value)
    addTodo(txt, importance)
    goToLastPage()
    if (gDisplayTodo === 'TABLE') renderTodos('.table-container')
    else renderTodosCards('.table-container')
    renderPaging()
    elTxt.value = '';
    elImpor.value = ''
}

//calls the edit function
function onEditTodo(todoId) {
    const txt = prompt('Enter task name')
    const importance = prompt('Enter importance level between 1-3')
    console.log(todoId);
    editTodo(todoId, txt, importance)
    if (gDisplayTodo === 'TABLE') renderTodos('.table-container')
    else renderTodosCards('.table-container')
}

//calls the filter function
function onSetFilter(filterBy) {
    console.log('Filtering By:', filterBy);
    setFilter(filterBy);
    if (gDisplayTodo === 'TABLE') renderTodos('.table-container')
    else renderTodosCards('.table-container')
}

//calls the sort function
function onSetSort(sortBy) {
    console.log(sortBy);
    setSort(sortBy)
    if (gDisplayTodo === 'TABLE') renderTodos('.table-container')
    else renderTodosCards('.table-container')
}

//calls the status function
function onSetStatus(sortStatusBy, todoId) {
    setStatus(sortStatusBy)
    toggleTodo(todoId)
    if (gDisplayTodo === 'TABLE') renderTodos('.table-container')
    else renderTodosCards('.table-container')
}

//render the paging numbered buttons
function renderPaging() {
    var strHtml = ''
    for (var i = 0; i <= (Math.ceil(gTodos.length / PAGE_SIZE) - 1); i++) {
        var pageClass = ''
        if (i === gPageIdx) pageClass = 'marked'
        strHtml += `<button class="paging page${i} ${pageClass}" onclick="goToPage(${i})">${i+1}</button>`
    }
    document.querySelector('.paging-section').innerHTML = strHtml
}

//when > is pressed, calling the next page function
function onNextPage() {
    nextPage();
    renderPaging()
    if (gDisplayTodo === 'TABLE') renderTodos('.table-container')
    else renderTodosCards('.table-container')
}

//when < is pressed, calling the prev page function
function onPrevPage() {
    prevPage();
    renderPaging()
    if (gDisplayTodo === 'TABLE') renderTodos('.table-container')
    else renderTodosCards('.table-container')
}

//when numbered button is pressed
function goToPage(selectedPage) {
    document.querySelector(`.page${gPageIdx}`).classList.remove('marked');
    if (gPageIdx !== selectedPage) gPageIdx = selectedPage
    renderPaging()
    if (gDisplayTodo === 'TABLE') renderTodos('.table-container')
    else renderTodosCards('.table-container')
    document.querySelector(`.page${gPageIdx}`).classList.add('marked');
}



// function onSetImportance(importanceLevel) {
//     console.log('important level:', importanceLevel);
//     setImportance(importanceLevel)
//     renderTodos()
// }


{
    /* <select class="selector" onchange="onSetStatus(this.value, '${todo.id}')">
    <option value="none" selected disabled hidden> Select an Option </option>
    <option class="todo-option" value="TODO">Todo</option>
    <option class="complete-option" value="COMPLETE">Complete</option>
    </select> */
}