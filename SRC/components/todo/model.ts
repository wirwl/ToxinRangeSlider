/**
 * Service layer to persist data in localStorage
 */
export class TodoModel {
    settings: any = {
        color: 'black',
        background: 'white',
    };
    options: any;
    constructor(options: any) {
        this.options = this.options;
        $.extend(this.settings, this.options);
        console.log('Created new TodoModel object');
    }
    getTasks() {
        return JSON.parse(localStorage.todo || '[]');
    }
    removeTask(inx: number) {
        const list = this.getTasks().filter((task: any, i: number) => {
            return i !== inx;
        });
        localStorage.todo = JSON.stringify(list);
    }
    addTask(val: string) {
        const list = this.getTasks();
        list.push(val);
        localStorage.todo = JSON.stringify(list);
    }
}
