$(document).ready(() => {

    fetchTodos();

    $('#form-save-todo').keypress(function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            e.preventDefault();
            saveTodo();
            fetchTodos();
        }
    });

    $('#form-edit-todo').keypress(function (e) {
        var code = (e.keyCode ? e.KeyCode : e.which);
        if (code == 13) {
            e.preventDefault();
            let element = $(this)[0];
            console.log(element);
        }
    });
    
});

function saveTodo()
{
    const postTodoSave = {
        Todo: $('#input-todo').val()
    };

    $.post('./php/save_todo.php', postTodoSave, (response) => {
        $('#form-save-todo').trigger('reset');
        fetchTodos();
        console.log('Save todo: ' + response);
    });
}

function fetchTodos()
{
    $.get('./php/fetch_todos.php', 'aplication/json', (response) => {
        let todos = JSON.parse(response);
        let template = '';

        todos.forEach(todo => {
            template +=
            `
            <div class="list-group-item bg-dark mb-1" todo-id = "${todo.ID}">
            <div class="d-flex justify-content-between align-items-center">
                <span class="d-flex flex-column">
                    <span>${todo.Todo}</span>
                    <span class="badge badge-primary badge-pill">${todo.Date}</span>
                </span>
                <span>
                    <button class="btn btn-primary" id="edit-todo" type="button" data-toggle="collapse"
                        data-target="#edit-menu-${todo.ID}" aria-expanded="false" aria-controls="edit-menu-${todo.ID}">
                        <i class="far fa-edit"></i>
                    </button>
                    <button class="btn btn-success" id="check-todo">
                        <i class="far fa-check-square"></i>
                    </button>
                </span>
            </div>
            <div class="collapse" id="edit-menu-${todo.ID}">
                <form class="form-inline form-group align-self-center w-100 mx-0 my-2" id="form-edit-todo">
                    <div class="input-group w-100">
                        <input class="form-control bg-dark border-primary w-100 text-white" id="input-edit-todo" value='${todo.Todo}'
                            type="text" placeholder="Edit your todo here">
                    </div>
                </form>
            </div>
        </div>
            `;
        });

        $('#todos').html(template);
    })
}

function editTodo()
{
    /* postTodoEdit = {
        Todo
    } */
}