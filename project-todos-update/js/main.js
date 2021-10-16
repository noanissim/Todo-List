'use strict'

function onInit() {
    _createTodos()
    renderTodos('.table-container')
    renderPaging()

}