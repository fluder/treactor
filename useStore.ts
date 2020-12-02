import {useEffect, useRef, useState} from "react";
import produce from "immer";

import {ContainerProps} from "./index";
import {Store} from "./store";
import uuid from "uuid/v4";

let storeRegistry = {} as any;


export function useContainerStore<STORE extends Store>(StoreClass: { new(props: any): STORE; }, props: ContainerProps<STORE>): [STORE, STORE['context']] {
    const storeRef = useRef(null as STORE | null);
    if (!!props.name && storeRegistry[props.name] != undefined) {
        storeRef.current = storeRegistry[props.name];
    }
    if (storeRef.current == null) {
        storeRef.current = new StoreClass(props);
        storeRegistry[!!props.name ? props.name : uuid()] = storeRef.current;
        console.log(`Created store of ` + storeRef.current.constructor.name + ` with name = ` + props.name)
    }
    const store = storeRef.current!;
    const cbRef = useRef(null as (number | null));
    const [x, setX] = useState({});

    useEffect(() => {
        cbRef.current = store.registerCb((model: any) => setX({}));
        return () => store.unregisterCb(cbRef.current!);
    }, []);

    for (let prop of Object.keys(props)) {
        const setterMethodName = `set${prop[0].toUpperCase()}${prop.slice(1)}`;
        if ((props as any)[prop] != (store.props as any)[prop]) {
            if ((store as any)[setterMethodName] !== undefined) {
                store.props = produce(store.props, (draftProps: any) => {
                    store.props = draftProps;
                    (store as any)[setterMethodName]((props as any)[prop]);
                });
            } else {
                store.props = produce(store.props, (draftProps: any) => {
                    draftProps[prop] = (props as any)[prop]
                });
            }
            store.updateContext();
        }
    }
    return [store, store.context];
}
