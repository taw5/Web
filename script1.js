var todoList = [];
document.addEventListener('DOMContentLoaded', function() {

    var toDoList = document.getElementById('toDoList');
    var addButton = document.getElementById('addBTN');
    var clearButton = document.getElementById('clearBTN');
    var taskInput = document.getElementById('taskInput');

    addButton.addEventListener('click', function(){
        console.log('Add button clicked');
        var taskText = taskInput.value.trim()
        if (taskText === ''){ // checking if the text is empty
            alert('You have to put something..!')
            return
        } 
        // no need for an else because of the return at line 14
        // it will stop the code from executing further lines    
        // here we know that it isn't empty
        if(todoList.includes(taskText)){
            alert("Task is already apart of you todo list!")
            return // stop the code from going further, not allowing it to add more 
        }
        taskInput.value = ''
        todoList.push(taskText)
        toDoList.appendChild(
            createListItem(taskText)
        )
    })


    clearButton.addEventListener('click', function(){
        console.log('Clear button clicked');
        toDoList.innerHTML = null;
        todoList = []
    })
})

function createListItem(taskText){
    var listItem = document.createElement('li');
    listItem.innerText = taskText+" ";
    var removeBTN = document.createElement('button')

    var checkBox = document.createElement('input')
    checkBox.type = 'checkbox'
    listItem.prepend(checkBox)
    removeBTN.addEventListener('click',function(){

        // # First way to remove X element from the list, using list/array methods pop/push
        // var removedItems = []
        // for(i = todoList.length; i >= 0; i--){
        //     var removedItem = todoList.pop()
        //     if(removedItem == taskText)
        //         break
        //     removedItems.push(removedItem)
        // }
        // for(i=0; i < removedItems.length; i++){
        //     todoList.push(removedItems.pop())
        // }

        // # second ways, vanilla filtering
        // making new list to filter and add only the wanted items
        // newList = []
        // for(index in todoList){
        //     var val = todoList[index]
        //     if(val != taskText)
        //         newList.push(val)
        // }
        // todoList = newList

        // # advanced way is using the filter method in the class array/list
        todoList = todoList.filter((text, _ ,_2) => text != taskText)
        reloadList()
    })
    removeBTN.innerText = 'Remove'
    listItem.appendChild(removeBTN)
    return listItem;
}

function reloadList(){
    toDoList.innerHTML = ''
    for(index in todoList){
        toDoList.appendChild(
            createListItem(todoList[index])
        )
    }
}