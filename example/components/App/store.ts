import {action, Store} from "@/treactor";


export class AppStore extends Store {
    state: {
        items: string[];
    };

    getInitialState() {
        return {items: []}
    }

    @action
    addItem() {
        this.state.items.push("-----------");
    }
}