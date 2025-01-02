import { input, select, confirm } from "@inquirer/prompts";
import fs from "fs"
import path from "path"

/*
Props
{
    id: int;
    title: string;
    description?: string;
    isCompleted?: boolean
}
*/
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

const listTasks = () => {
    return new Promise((resolve) => {
        tasks.forEach((task, index) => {
            console.log(`\nTask ${index+1} \n\tTitle: ${task.title} \n\tDescription: ${task.description} \n\tStatus: ${task.isCompleted ? "Completed" : "Not Completed"} \n`);
        });
        resolve();
    })
};

const findTask = (taskId) => {
    const task = tasks[taskId];

    if(task){
        console.log(`Title: ${task.title} \nDescription: ${task.description} \nStatus: ${task.isCompleted ? "Completed" : "Not Completed"} \n\n`);
    }
    else {
        console.error("Task not found");
    }

}


const createTask = async () => {
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

const deleteTask = async () => {
    const deleteID = await input({
        message: "Enter the index to be deleted"
    });

    try {
        tasks.splice(deleteID - 1, 1);
        return saveTasks();
    }
    catch (err) {
        console.error("Please specify the correct index ", err)
    }
};

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


const markCompleted = async () => {
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


const interactiveMainMenu = async () => {
    loadTasks().then(() => {
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
                    return createTask().then(() => interactiveMainMenu());

                case "list":
                    return listTasks().then(() => interactiveMainMenu());

                case "delete":

                
                    return deleteTask().then(() => interactiveMainMenu());

                case "mark":
                    return markCompleted().then(() => interactiveMainMenu());

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

    if (checkForInteractiveMenuKeyword.includes("--interactive") || checkForInteractiveMenuKeyword.includes("-i")) {
        interactiveMainMenu();
        return;
    }

    // Check for task index
    if(process.argv.indexOf("-t") !== -1 || process.argv.indexOf("--task") !== -1){
        const taskParamIndex = process.argv.indexOf("-t") !== -1 ? process.argv.indexOf("-t") : process.argv.indexOf("--task");
        const taskArgIndex = taskArgumentIndex !== -1 ? taskArgumentIndex + 1: -1;
        const taskArgument = process.argv[taskIndex];

        // Check for other params



    }






    const taskArgumentIndex = process.argv.indexOf("-t") !== -1 ? process.argv.indexOf("-t") : process.argv.indexOf("--task");
    const taskIndex = taskArgumentIndex !== -1 ? taskArgumentIndex + 1 : -1;
    const taskArgument = process.argv[taskIndex];

    if(taskIndex != -1 && taskArgument == undefined){
        console.error("Specify the task index to be checked")
    }

    if (taskArgument) {
        loadTasks().then(() => {
            findTask(taskArgument - 1)
        }).catch((err) => {
            console.error(err.message);
        });
    }

}

main()
