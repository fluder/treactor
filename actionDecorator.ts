import {dispatcher} from "./dispatcher";
import {Store} from "@/treactor/store";


export function action(
    target: Object,
    propertyName: string,
    propertyDesciptor: PropertyDescriptor
) {
    let method = propertyDesciptor.value;
    propertyDesciptor.value = function(...args: any[]) {
        let actionName = `${target.constructor.name}.${propertyName}`;
        dispatcher.putAction({name: actionName, func: method, funcArguments: args, store: this as Store});
    };
    propertyDesciptor.value.isAction = true;
}