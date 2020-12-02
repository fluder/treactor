import React from "react";

import {Store} from "./store";
import produce from "immer";


export interface Action {
    name: string;
    func: any;
    funcArguments: any[];
    store: Store;
}


class Dispatcher {
    private actionQueue: Action[];
    private isProcessing: boolean;

    constructor() {
        this.actionQueue = [];
        this.isProcessing = false;
    }

    putAction(action: Action) {
        this.actionQueue.push(action);
        this.processActions();
    }

    processActions() {
        if (this.isProcessing) {
            return
        }
        this.isProcessing = true;
        while (this.actionQueue.length > 0) {
            let nextAction = this.actionQueue.shift(),
                store = nextAction!.store,
                func = nextAction!.func,
                funcArguments = nextAction!.funcArguments;
            console.log(`Processing action: ${nextAction!.name}`);
            try {
                const initialProps = store.props as any;
                let [newState, newProps]: [any, any] = produce([store.state, store.props], ([draftState, draftProps]) => {
                    store.state = draftState;
                    store.props = draftProps;
                    func.apply(store, funcArguments);
                });
                store._currentState = undefined;
                store.state = newState;
                store.props = produce(initialProps, (draftProps: any) => {
                    for (let key of Array.from(new Set([...Object.keys(initialProps), ...Object.keys(newProps)]))) {
                        if (store.managedProps.indexOf(key) != -1) {
                            let eventHandler = initialProps['on' + key[0].toUpperCase() + key.slice(1) + 'Change'];
                            if (eventHandler !== undefined && initialProps[key] != newProps[key]) {
                                eventHandler(newProps[key]);
                            }
                        } else {
                            draftProps[key] = newProps[key];
                        }
                    }
                });
                if (store.updateContext()) {
                    store.triggerCb();
                }
            } catch (e) {
                console.log(e);
            }
        }
        this.isProcessing = false;
    }
}

export const dispatcher = new Dispatcher();
