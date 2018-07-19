export class BasicModel<T> {
  constructor(objInterface: T) {
    for (const key in objInterface) {
      if (objInterface.hasOwnProperty(key)) {
        const self: any = this;
        self[key] = objInterface[key];
      }
    }
  }
}
