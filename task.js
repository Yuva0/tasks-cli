import { input, select, confirm } from "@inquirer/prompts";
import fs from "fs"
import path from "path"

let tasks = [];

// Handler functions
const loadTasks = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(path.resolve(), "tasks.json"), 'utf-8', (err, data) => {
            if (err) {
                return resolve([]);
            }

            try {
                if (!data) {
                    tasks = [];
                    resolve();
                }
                else {
                    tasks = JSON.parse(data);
                    resolve();
                }
            }

            catch (err) {
                reject(new Error('Failed to parse tasks ', err));
            }
        })
    })
};

// List Tasks
const listTasks = () => {
    return new Promise((resolve) => {
        if(!tasks || tasks.length == 0)
            console.error("No tasks found");

        tasks.forEach((task, index) => {
            console.log(`\nTask ${index+1} \n\tTitle: ${task.title} \n\tDescription: ${task.description} \n\tStatus: ${task.isCompleted ? "Completed" : "Not Completed"} \n`);
        });
        resolve();
    })
};

// Find Task
const findTask = (taskId) => {
    const task = tasks[taskId];
    if(task){
        console.log(`Title: ${task.title} \nDescription: ${task.description} \nStatus: ${task.isCompleted ? "Completed" : "Not Completed"} \n\n`);
    }
    else {
        console.error("Task not found");
    }
}

// Create Interactive Task
const createTaskInteractive = async () => {
    let title = "";
    while (!title || title.length === 0) {
        title = await input({
            message: "Enter a title"
        });
    }

    let description = "";
    while (!description || description.length === 0) {
        description = await input({
            message: "Enter a description"
        });
    }

    const isCompleted = await confirm({
        message: "Is the task completed? (y/n)"
    })

    tasks.push({ id: tasks.length, title, description, isCompleted });
    return saveTasks();
};

// Create Task
const createTask = (title, description, isCompleted) => {
    tasks.push({ id: tasks.length, title, description, isCompleted });
    return saveTasks()
};

// Delete Task Interactive
const deleteTaskInteractive = async () => {
    const deleteID = await input({
        message: "Enter the index to be deleted"
    });

    try {
        tasks.splice(deleteID - 1, 1);
        return saveTasks();
    }
    catch (err) {
        console.error("Please specify the correct index ", err);
    }
};

// Delete Task
const deleteTask = (deleteID) => {
    try{
        tasks.splice(deleteID - 1, 1);
        return saveTasks();
    }
    catch(err){
        console.error("Please specify the correct index ", err);
    }
};

// Save Tasks
const saveTasks = () => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(path.resolve(), 'tasks.json'), JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                return reject(new Error('Failed to save tasks.'));
            }
            resolve();
        });
    });
};

// Search Tasks
const searchTasks = (searchArgument) => {
    return new Promise((resolve) => {
        const searchedTasks = tasks.filter((task) => {
            if(task.title.includes(searchArgument) || task.description.includes(searchArgument)){
                return true;
            }
            return false;
        })

        if (Array.isArray(searchedTasks))
            searchedTasks.forEach((task) => console.log(`Title: ${task.title} \nDescription: ${task.description} \nStatus: ${task.isCompleted ? "Completed" : "Not Completed"} \n\n`));
        else
            console.log(`Title: ${searchedTasks.title} \nDescription: ${searchedTasks.description} \nStatus: ${searchedTasks.isCompleted ? "Completed" : "Not Completed"} \n\n`);

        resolve();
    });
}

// Mark as Completed
const markCompletedInteractive = async () => {
    const completedID = await input({
        message: "Enter the index for the task that is completed"
    });

    const task = tasks[completedID - 1];
    if (task) {
        task.isCompleted = true;
        saveTasks();
    } else {
        console.error("Task not found");
    }
    return saveTasks();
};

const markCompleted = (completedID) => {
    const task = tasks[completedID - 1];
    
    if (task) {
        task.isCompleted = true;
        saveTasks();
    }
    else {
        console.error("Task not found");
    }

    return saveTasks();
}

// Interactive Menu
const interactiveMainMenu = () => {
    loadTasks().then(async() => {
        return select({
            message: "Choose what you want to do:",
            choices: [
                { name: "Create a task", value: "create", },
                { name: "List all tasks", value: "list" },
                { name: "Delete a task", value: "delete" },
                { name: "Mark a task as completed", value: "mark" },
                { name: "Exit", value: "exit" }
            ]
        }).then((option) => {
            switch (option) {
                case "create":
                    return createTaskInteractive().then(() => interactiveMainMenu());

                case "list":
                    return listTasks().then(() => interactiveMainMenu());

                case "delete":
                    return deleteTaskInteractive().then(() => interactiveMainMenu());

                case "mark":
                    return markCompletedInteractive().then(() => interactiveMainMenu());

                case "exit":
                    return;
            }
        }).catch((err) => {
            console.error(err.message)
        })
    })

}

const main = () => {
    const checkForInteractiveMenuKeyword = process.argv.slice(-2);

    // Interactive Menu Enablement option
    if (checkForInteractiveMenuKeyword.includes("--interactive") || checkForInteractiveMenuKeyword.includes("-i")) {
        interactiveMainMenu();
        return;
    }

    loadTasks().then(() => {
         // Create a task
        if (process.argv.indexOf("-c") !== -1 || process.argv.indexOf("--create") !== -1){
            const createTaskIndex = process.argv.indexOf("-c") !== -1 ? process.argv.indexOf("-c") : process.argv.indexOf("--create");

            if(createTaskIndex !== -1){
                const titleIndex = createTaskIndex + 1;
                const descriptionIndex = createTaskIndex + 2;
                const markCompletedIndex = createTaskIndex + 3;

                const markCompleted = process.argv[markCompletedIndex] === "y" ? true : false;

                if(titleIndex && descriptionIndex){
                    createTask(process.argv[titleIndex], process.argv[descriptionIndex], markCompleted);
                }
                else {
                    console.error("Please enter valid title & description");
                }
            }
        }

        // List all task
        if (process.argv.indexOf("-l") !== -1 || process.argv.indexOf("--list") !== -1){
            console.log("Listed")
            listTasks();
        }

        // Find using task index
        if(process.argv.indexOf("-f") !== -1 || process.argv.indexOf("--find") !== -1){
            const findParamIndex = process.argv.indexOf("-f") !== -1 ? process.argv.indexOf("-f") : process.argv.indexOf("--find");
            const findArgIndex = findParamIndex !== -1 ? findParamIndex + 1: -1;
            const findArgument = process.argv[findArgIndex];

            if(findArgIndex != -1 && findArgument == undefined){
                console.error("Specify the task index to be checked")
                return;
            }

            findTask(findArgument - 1);
        }

        // Search for a task
        if(process.argv.indexOf("-s") !== -1 || process.argv.indexOf("--search") !== -1){
            const searchParamIndex = process.argv.indexOf("-s") !== -1 ? process.argv.indexOf("-s") : process.argv.indexOf("--search");
            const searchArgIndex = searchParamIndex !== -1 ? searchParamIndex + 1: -1;
            const searchArgument = process.argv[searchArgIndex];

            // Check for other params
            if(searchArgIndex != -1 && searchArgument == undefined){
                console.error("Specify the keyword to be searched for");
                return;
            }

            searchTasks(searchArgument);
        }

        // Delete a task
        if (process.argv.indexOf("-d") !== -1 || process.argv.indexOf("--delete") !== -1){
            const deleteParamIndex = process.argv.indexOf("-d") !== -1 ? process.argv.indexOf("-d") : process.argv.indexOf("--delete");
            const deleteArgIndex = deleteParamIndex !== -1 ? deleteParamIndex + 1: -1;
            const deleteArgument = process.argv[deleteArgIndex];

            if(deleteArgIndex !== -1 && deleteArgument == undefined){
                console.error("Specify the index of the task to be deleted");
                return;
            }

            deleteTask();
        }

        // Mark task as completed
        if (process.argv.indexOf("-m") !== -1 || process.argv.indexOf("--mark") !== -1){
            const markParamIndex = process.argv.indexOf("-m") !== -1 ? process.argv.indexOf("-m") : process.argv.indexOf("--mark");
            const markArgIndex = markParamIndex !== -1 ? markParamIndex + 1: -1;
            const markArgument = process.argv[markArgIndex];

            if (markArgIndex !== -1 && markArgument == undefined){
                console.error("Specify the index of the task to be marked as completed");
                return;
            }

            markCompleted(markArgument);
        }
    });
}

main()
