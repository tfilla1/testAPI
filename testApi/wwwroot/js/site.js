const uri = 'api/todo';
let todos = null;
function getCount(data) {
    const el = document.querySelector('#counter');
    let name = 'to-do';
    if (data) {
        if (data > 1) {
            name = 'to-dos';
        }
        el.innerText = data + ' ' + name;
    } else {
        el.innerText = 'No ' + name;
    }
}

function addItem() {
    const item = {
        name: document.querySelector('#add-name').value,
        isComplete: false
    };
    const prom = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uri, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.onload = () => resolve(xhr.responseText);
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(JSON.stringify(item));
    });

    prom.then((data) => {
        console.log(data);
        getData();
    });
    console.log(item);
}
function deleteItem(id) {
    const prom = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', uri + "/" + id, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.onload = () => resolve(xhr.responseText);
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
    });

    prom.then((data) => {
        console.log(data);
        getData();
    });
}
function editItem(id) {
    document.querySelector('#spoiler').setAttribute('style', 'display:block');
    todos.forEach(function(todo) {
        if (todo.id === id) {
            document.querySelector('#edit-name').value = todo.name;
            document.querySelector('#edit-id').value = todo.id;
            document.querySelector('#edit-isComplete').checked = todo.isComplete;
        }
    });
}

document.querySelector('.my-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const item = {
        name: document.querySelector('#edit-name').value,
        isComplete: document.querySelector('#edit-isComplete').checked,
        id: document.querySelector('#edit-id').value
    };

    const prom = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', uri + '/' + document.querySelector('#edit-id').value, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.onload = () => resolve(xhr.responseText);
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(JSON.stringify(item));
    });
    prom.then((data) => {
        console.log(data);
        closeInput();
        getData();
    });
    console.log('submitted');
});
function getData() {
    console.log('hello');
    const prom = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', uri, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
        xhr.onload = () => resolve(xhr.responseText);
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
    });

    prom.then((data) => {
        var body = document.querySelector('#todos');
        body.innerHTML = '';
        var dataParse = JSON.parse(data);
        getCount(dataParse.length);
        console.log(typeof dataParse);
        dataParse.forEach(function(key) {
            console.log(key.id);
            console.log(key.name);
            body.innerHTML += `<tr><td>${key.isComplete}</td><td>${key.name}</td><td><button onclick='deleteItem(${key.id});'>delete</button></td><td><button onclick='editItem(${key.id});'>edit</button></td></tr>`;
        });
        todos = dataParse;
    }).catch((reason) => {
        console.log(reason);
    });

}

function closeInput() {
    document.querySelector('#spoiler').setAttribute('style', 'display:none');
}
    
document.addEventListener('DOMContentLoaded', getData);