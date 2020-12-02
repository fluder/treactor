import React from "react";
import {useContainerStore} from "@/treactor/useStore";
import {Store} from "@/treactor/store";
import {ContainerProps} from "@/treactor/index";


export function Container<STORE extends Store>(BaseComponent: any, StoreClass: { new(props: any): STORE; }): (props: ContainerProps<STORE>) => any {
    let component = function (props: any) {
        const [store, context] = useContainerStore(StoreClass as any, props);
        return <BaseComponent {...context}/>;
    } as any;
    component.displayName = (StoreClass as any).name + 'Container';
    return React.memo(component)
}