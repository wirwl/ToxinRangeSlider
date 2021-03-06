import HandleView from './View/SubViews/HandleView';

export interface DomEntities {
  domEntity: string;
  $parentElement: JQuery<HTMLElement>;
}

export interface SubViewData {
  domEntity: string;
  $parentElement: JQuery<HTMLElement>;
}

export type UserInputData = {
  value: number;
  handle: HandleView;
  event: JQuery.TriggeredEvent;
};
