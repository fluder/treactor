import {action, Store} from "@/treactor";


export class AppContentStore extends Store {
    state: {
        items: string[];
    };

    getInitialState() {
        return {
            items: []
        }
    }

    @action
    addItem() {
        this.state.items.push("item");
    }
}