$(document).ready(() => {

    fetchTodos();

    alertify.set('notifier', 'position', 'top-center');
    alertify.success('All is OK');

    $('#datepicker').datetimepicker({
        uiLibrary: 'bootstrap4',
        footer: true,
        showRightIcon: false
    });

    $('#form-save-todo').keypress(function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        console.log(code);
        if (code == 13) {
            e.preventDefault();
            saveTodo();
            fetchTodos();
            clearFormTodo();
        }
    });

    $('#input-todo').on('keypress', function () {
        $('#form-date-time').collapse('show');
    });

    $('#btn-form-save-todo').click(function () {
        $('#form-date-time').collapse('toggle');
    });

    $(document).on('keypress', '#input-edit-todo', function (e) {
        let code = (e.KeyCode ? e.KeyCode : e.which);
        if (code == 13) {
            e.preventDefault();
            let element = $(this)[0].parentElement.parentElement.parentElement.parentElement;
            let id = $(element).attr('todo-id');
            let input_edit = $(this)[0];
            let input_edit_value = $(input_edit).val();

            postEditTodo = {
                ID: id,
                Todo: input_edit_value
            };

            $.post('./php/edit_todo.php', postEditTodo, (response) => {
                if (response == 1) {
                    fetchTodos();
                    console.log('Edit todo: ' + response);
                } else {
                    alertify.error('Something is wrong :(');
                    /* TODO: Crear una funcion para mostrar los errores al cliente */
                }
            });
        }
    });

    $('#todos').on('click', '#check-todo', function () {
        if (confirm('¿Are you sure?')) {
            let element = $(this)[0].parentElement.parentElement.parentElement;
            let ID = $(element).attr('todo-id');

            $.post('./php/check_todo.php', {
                ID: ID
            }, function (response) {
                console.log(response);
                fetchTodos();
            });
        }
    });

    $('#todos').on('click', '#btn-edit-todo', function () {
        let element = $(this)[0].parentElement.parentElement.parentElement;
        let ID = $(element).attr('todo-id');

        $.post('./php/fetch_one_todo.php', {
            ID: ID
        }, function (response) {

            let todo = JSON.parse(response);
            let date = new Date(todo.Due_date);
            let dateFormated = dateFormat(date, 'h:MM TT yyyy-mm-dd');

            $('#input_edit_date_' + ID).datetimepicker({
                uiLibrary: 'bootstrap4',
                footer: true,
                showRightIcon: false,
                format: 'h:MM TT yyyy-mm-dd',
                value: dateFormated
            });
        });
    });

    $('#todos').on('click', '#btn_save_changes_todo', function () {
        let buttonRoot = $(this)[0];

        let element_id = $(buttonRoot).parents('#todo-container');
        let ID = $(element_id).attr('todo-id');

        let edit_menu_elements = $(buttonRoot).parents('#edit-menu-' + ID)

        let input_todo = $(edit_menu_elements).find('input#input_edit_todo').val();
        console.log(input_todo);

        let input_date = $(edit_menu_elements).find('input#input_edit_date_' + ID).val();
        console.log(input_date);

        let input_category = $(edit_menu_elements).find('#input_edit_category').find(':selected').val();
        console.log(input_category);

        //TODO: Crear un post para los datos editados.

    });

});

function getCurrentDateTime() {
    return dateFormat(new Date(), "h:MM TT yyyy-mm-dd");
}

function clearFormTodo() {
    $('#input-todo').val('');
    $('#datepicker').val('');
    /* $('#input-select-category option:contains("2")').prop('selected',true); */
    $('#input-select-category').val(1);
}

function saveTodo() {
    const postSaveTodo = {
        Todo: $('#input-todo').val()
    };

    $.post('./php/save_todo.php', postSaveTodo, (response) => {
        $('#form-save-todo').trigger('reset');
        fetchTodos();
        console.log('Save todo: ' + response);
    });
}

function fetchTodos() {
    $.get('./php/fetch_todos.php', 'aplication/json', (response) => {
        let todos = JSON.parse(response);
        let template = '';

        todos.forEach(todo => {

            let due_Date = dateFormat(new Date(todo.Due_date), "hh:MM TT,yyyy-mm-dd");
            let due_Date_Array = due_Date.split(",");

            template +=
                `
                <div class="list-group-item bg-dark-lux mb-1" id="todo-container" todo-id="${todo.ID}">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <span class="d-flex flex-column">
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <span>${todo.Todo}</span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-12 d-flex">
                                                        <span class="badge badge-primary badge-pill align-self-start"><i
                                                                class="far fa-calendar"></i> ${due_Date_Array[0]}</span>
                                                        <span class="badge badge-primary badge-pill align-self-start ml-1"><i
                                                                class="far fa-clock"></i> ${due_Date_Array[1]}</span>
                                                    </div>
                                                </div>
                                            </span>
                                            <span>
                                                <button class="btn btn-primary" id="btn-edit-todo" type="button"
                                                    data-toggle="collapse" data-target="#edit-menu-${todo.ID}"
                                                    aria-expanded="false" aria-controls="edit-menu-${todo.ID}">
                                                    <i class="far fa-edit"></i>
                                                </button>
                                                <button class="btn btn-success check-todo" id="check-todo">
                                                    <i class="far fa-check-square"></i>
                                                </button>
                                            </span>
                                        </div>
                                        <div class="collapse" id="edit-menu-${todo.ID}">
                                            <div class="row mt-4">
                                                <div class="col-md-12">
                                                    <input class="form-control" id="input_edit_todo" type="text" value="${todo.Todo}" placeholder="Edit your todo here"/>
                                                </div>
                                            </div>
                                            <div class="row mt-4">
                                                <div class="col-md-12">
                                                    <div class="row d-flex justify-content-between m-auto">
                                                        <div class="col-md-5 pb-3">
                                                            <div class="input-group bg-dark">
                                                                <input class="form-control bg-white" type="text"
                                                                    id="input_edit_date_${todo.ID}" placeholder="Edit your Due Date here"
                                                                    autocomplete="off">
                                                            </div>
                                                        </div>
                                                        <div class="col-md-5 pb-3">
                                                            <div class="input-group d-flex">
                                                                <select class="form-control bg-white"
                                                                    name="todo_category" id="input_edit_category">
                                                                    <option value="One">One</option>
                                                                    <option value="Two">Two</option>
                                                                    <option value="Three">Three</option>
                                                                </select>
                                                                <div class="input-group-append">
                                                                    <button
                                                                        class="input-group-text d-flex bg-dark text-muted">
                                                                        <i class="far fa-folder"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-2 ">
                                                            <button class="btn btn-dark" id="btn_save_changes_todo"><i class="far fa-save"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
            `;
        });

        $('#todos').html(template);

    })
}