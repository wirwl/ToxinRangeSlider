interface JQuery {
    ToDo(): any;
    ToDo(options: ToDo.ToDoOptions): any;
    //type '{ (): any; (options: ToDoOptions): any; }'
}

//'use strict';

import { TodoPresenter } from './presenter';
import { TodoView } from './view';
import { TodoModel } from './model';

export function createToDo(el: Element, options: any) {
    //return new TodoPresenter(new TodoModel(options), new TodoView(el));
}

export namespace ToDo {
    // interface IToDoOptions {
    //     color: string;
    //     backgroundColor: string;
    // }
    //implements IToDoOptions
    export class ToDoOptions {
        // Fields
        color: string;
        backgroundColor: string;

        constructor(color: string, backgroundColor: string) {
            this.color = color;
            this.backgroundColor = backgroundColor;
        }
    }

    export class Greenify {
        // Fields
        element: JQuery;
        options: ToDoOptions;

        constructor(element: JQuery, options: ToDoOptions) {
            this.element = element;
            this.options = options;

            this.OnCreate();
        }

        OnCreate() {
            //this.element.css('color', this.options.color).css('background-color', this.options.backgroundColor);
        }
    }
}

(function($) {
    if (!$) return false;

    $.fn.extend({
        ToDo: function(opts: any) {
            //defaults
            const defaults: any = new ToDo.ToDoOptions('#0F0', '#000');

            const oopts = $.extend(defaults, opts);
            return (this as any).each(function(this: Element) {
                const o = oopts;
                const obj = $(this);
                //new Coloring.Greenify(obj, o);
                //new TodoPresenter(new TodoModel(o), new TodoView(this));
            });
        },
    });

    //start
    $(function() {
        //$('.set-todo').ToDo();
    });

    return true;
})(jQuery);
