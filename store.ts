import produce, {current} from "immer";


type StoreInternalProps = "props" | "state" | "context" | "managedProps" | "nextCbId" | "registeredCb" |
    "getInitialState" | "getDefaultProps" | "triggerCb" | "registerCb" | "unregisterCb" | "updateContext" |
    "currentState" | "_currentState"


export abstract class Store {
    props: {};
    state: {};
    _currentState?: any;

    context: this['props'] & this['state'] & {name: string} & Omit<this, StoreInternalProps>;
    managedProps: string[];
    private nextCbId: number = 0;
    private registeredCb: {[key: number]: (model: Store) => void} = {};
    private promises: {[key: number]: any} = {};
    private nextPromiseId: number = 0;

    constructor(props: any) {
        this.state = this.getInitialState();
        this.managedProps = Object.keys(props);
        this.props = Object.assign({}, this.getDefaultProps(), props);
        let storeActions = {} as any;
        for (let key in this) {
            if ((this[key] as any).isAction) {
                storeActions[key] = (this[key] as any).bind(this);
            }
        }
        this.context = Object.assign({}, this.state, this.props, {name: props.name}, storeActions);
        for (let prop of Object.keys(props)) {
            const setterMethodName = `set${prop[0].toUpperCase()}${prop.slice(1)}`;

            if ((this as any)[setterMethodName] !== undefined) {
                this.props = produce(this.props, (draftProps: any) => {
                    this.props = draftProps;
                    (this as any)[setterMethodName]((props as any)[prop]);
                });
            }
        }
    }

    getInitialState(): this['state'] {
        return {}
    }

    getDefaultProps(): any {
        return {}
    }

    triggerCb() {
        for (let cb of Object.values(this.registeredCb)) {
            cb(this);
        }
    }

    registerCb(cb: (model: Store) => void) {
        let cbId = this.nextCbId;
        this.nextCbId++;

        this.registeredCb[cbId] = cb;

        return cbId;
    }

    unregisterCb(cbId: number) {
        delete this.registeredCb[cbId];
    }

    updateContext() {
        const oldContext = this.context;
        this.context = produce(this.context, (draftContext: any) => {
            for (let key of Object.keys(this.props)) {
                draftContext[key] = draftContext[key] != (this.props as any)[key] ? (this.props as any)[key] : draftContext[key];
            }
            for (let key of Object.keys(this.state)) {
                draftContext[key] = draftContext[key] != (this.state as any)[key] ? (this.state as any)[key] : draftContext[key];
            }
        });
        return oldContext != this.context;
    }

    runPromise(promiseFunc: any, ...args: any[]) {
        const promiseId = this.nextPromiseId;
        this.nextPromiseId += 1;

        let project = {
            _isAlive: true
        } as any;
        for (let key in this) {
            if (this[key] !== undefined && (this[key] as any).isAction) {
                project[key] = (...args: any[]) => {
                    if (project._isAlive) {
                        (this[key] as any).bind(this)(...args);
                    } else {
                        throw("Canceled")
                    }
                }
            }
        }
        this.promises[promiseId] = project;
        promiseFunc(project, ...args);

        return promiseId;
    }

    cancelPromise(promiseId: number) {
        this.promises[promiseId]._isAlive = false;
        delete this.promises[promiseId]
    }
}
