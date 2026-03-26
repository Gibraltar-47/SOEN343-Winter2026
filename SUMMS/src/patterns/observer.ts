export interface Observer {
  update(event: string, payload?: any): void;
}

export interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(event: string, payload?: any): void;
}