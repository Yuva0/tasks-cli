# To-Do List CLI

A simple and interactive command-line interface (CLI) application for managing your daily tasks. Easily add, list, mark, or delete tasks—all from your terminal.

---

## Features

- Add tasks to your to-do list.
- View your list of tasks.
- Mark tasks as completed.
- Delete tasks when they're no longer needed.
- Interactive mode with `--interactive` for an enhanced user experience.

---

## Installation

1. Clone this repository:
    ```bash
    git clone https://github.com/yourusername/todo-cli.git
    cd todo-cli
    npm install
    npm link
    task

## Usage
<table>
    <tr>
        <th>Command</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>task --list</td>
        <td>List all tasks</td>
    </tr>
    <tr>
        <td>task --create Title Description y</td>
        <td>Create a task while adding title, description and completion status</td>
    </tr>
    <tr>
        <td>task --delete 1</td>
        <td>Delete the task at index 1</td>
    </tr>
    <tr>
        <td>task --search game</td>
        <td>Search for task having keyword 'game'</td>
    </tr>
    <tr>
        <td>task --mark 1</td>
        <td>Mark the task at index 1 as completed</td>
    </tr>
    <tr>
        <td>task --interactive</td>
        <td>Interactive version of using tasks</td>
    </td>
</table>

## Development
1. Running Locally

#### You can run the script without linking by using Node.js:

```bash
node task.js --list
```

#### Adding Features
Feel free to fork this project and contribute! Here's how to set up your development environment:

- Clone the repo and create a new branch.
- Make your changes.
- Submit a pull request.


## Technology Stack
- Node.js: Core framework for building the CLI
- Inquirer.js: For interactive prompts


## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contributions
Contributions are welcome! If you have ideas or bug fixes, feel free to open an issue or submit a pull request.
