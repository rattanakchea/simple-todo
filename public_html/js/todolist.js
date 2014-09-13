"use strict";

function Todolist()
{
    var version = "v1.0";
    var appStorage = new AppStorage("todolist");
    
    //declare as global to minimize DOM query
    var $taskInput = $("#task-form").find("input");  //task input element
    
    //private function (note: no keyword 'this.addTask')
    function addTask(){
       console.log("add task");
        
        var taskName = $taskInput.val();
        if (taskName) {
            addTaskElement(taskName);
            
            $taskInput.val("").focus(); //return the keyboard to task input
            
            //save to localStorage
            saveTaskList();
        }
        
    }
    
    function addTaskElement(taskName){
        //make a copy of the task template <li></li>
        var $task = $("#task-template .task").clone();
        
        //find the task-name and insert the text
        $task.find(".task-name").text(taskName);
        //or $(".task-name", $task).text(taskName);    
        //insert in the task list
        $("#task-list").append($task);
        
        //button events
        $task.find(".ui-icon-delete").click( function(){
           $task.remove();
           saveTaskList();
        });
        $task.find(".ui-icon-arrow-d").click( function(){
           $task.insertAfter($task.next());
           saveTaskList();
        });
        $task.find(".ui-icon-arrow-u").click( function(){
           $task.insertBefore($task.prev());
           saveTaskList();
        });
        
        //task edit event
        $task.on('click', "div.task-name", function(){
            editTask($(this));
        });
        
    }
    
    function editTask($e){
        //console.log($e);
        var text = $e.text();
        
        var $editTaskInput = $e.hide()
                .parent().find("input.task-name");
        //show edit text
        $editTaskInput.val(text).show().focus();
        
        //click out of form or press enter
        $editTaskInput.on("blur", function(){
            hideAndSaveEditTask($(this));
        });
        
        //save when press enter
        $editTaskInput.on("keypress", function(e){
            
            if(e.which == 13){    
                hideAndSaveEditTask($(this));
            }
        });
    }
    function hideAndSaveEditTask($e){
        console.log($e);
        $e.hide(); //hide the edited form
        //alert($e.val());
        var $text = $e.closest('li').find("div.task-name");
        
        //save edited task when press enter
        if ($e.val()){
            $text.text($e.val());
            saveTaskList();
        }
        $text.show(); //show the text
                
    }
    
    
    function saveTaskList() {
        var tasks = [];
        $("#task-list").find("div.task-name").each(function(){
           tasks.push($(this).text()); 
        });
        
        appStorage.setValue("taskList", tasks);
        
    }
    
    function loadTaskList(){
        var tasks = appStorage.getValue("taskList");
        if (tasks) {
            for (var i in tasks){
                addTaskElement(tasks[i]);
            }
        }
    }
    
    
    this.start = function(){
        $("#header").append(version);
        loadTaskList();
        
        $taskInput.keypress(function(e) {
            if (e.which == 13) { //Enter key
                addTask();
                return false;
            }
        });
        
        $("#empty-tasks").click(function(){
            appStorage.removeAll();
            $("#task-list").empty();
        });
        
    };
            
}

//jQuery shorthand to start application

$(function()
{
    window.app = new Todolist();
    window.app.start();
});