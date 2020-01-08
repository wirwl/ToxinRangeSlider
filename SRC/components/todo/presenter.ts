import { TodoView } from './view';
import { TodoModel } from './model';

/**
 * Presenter listenes to view events, retrieve data, manipulates it and
 * updates the view
 */
export class TodoPresenter {
    view: TodoView;
    model: TodoModel;
    constructor(model: TodoModel, view: TodoView) {
        this.view = view;
        this.model = model;
        this.view.onSubmitCb = this.onSubmit.bind(this);
        this.view.onRemoveTaskCb = this.onRemoveTask.bind(this);
        this.updateList();
    }
    onRemoveTask(inx: number) {
        this.model.removeTask(inx);
        this.updateList();
    }
    onSubmit(text: string) {
        this.model.addTask(text);
        this.updateList();
    }
    updateList() {
        this.view.emptyList();
        this.model.getTasks().forEach((text: string, inx: number) => {
            this.view.addTask(text, inx);
        });
    }
}
