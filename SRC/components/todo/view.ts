/**
 * Encapsulate a single task view logic
 */
class TaskView {
    text: string;
    inx: number;
    onRemoveTaskCb: any;
    //: (inx: number) => {};
    constructor(text: string, inx: number) {
        this.text = text;
        this.inx = inx;
        //this.onRemoveTaskCb = function(): void {};
    }
    render() {
        const el = document.createElement('li');
        el.innerHTML = this.text + ' <a href="#" data-inx="' + this.inx + '">[x]</a>';
        this.onRemoveTaskCb = this.onRemoveTaskCb || function() {};
        el.querySelector('a')!.addEventListener('click', e => {
            e.preventDefault();
            this.onRemoveTaskCb(parseInt((e.target as HTMLUListElement).dataset.inx!, 10));
        });
        return el;
    }
}

/**
 * TODO widget view logic
 */
export class TodoView {
    el: Element;
    input: HTMLInputElement | null;
    list: HTMLUListElement | null;
    onSubmitCb: any;
    onRemoveTaskCb: any;
    constructor(el: Element) {
        this.el = el;
        this.input = el.querySelector('[data-bind=input]');
        this.list = el.querySelector('[data-bind=tasks]');
        this.onSubmitCb = function() {};
        this.onRemoveTaskCb = function() {};
        this.el.addEventListener('submit', e => {
            e.preventDefault();
            if (this.input) this.onSubmitCb(this.input.value);
        });
    }
    emptyList() {
        if (this.list) this.list.innerHTML = '';
    }
    addTask(text: string, inx: number) {
        const taskView = new TaskView(text, inx);
        taskView.onRemoveTaskCb = this.onRemoveTaskCb;
        if (this.list) this.list.appendChild(taskView.render());
    }
}
