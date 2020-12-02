export {Store} from "./store";
export {action} from "./actionDecorator";
export {Container} from "./container";
export {current} from "./utils";

import {Store} from "./store";
export type ContainerProps<STORE extends Store> = STORE['props'] & {name?: string};