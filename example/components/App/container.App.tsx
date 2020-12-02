import React, {useCallback} from "react";
import {AppStore} from "@/treactor/example/components/App/store";
import {AppContent} from "@/treactor/example/components/AppContent/container.AppContent";
import {Container} from "@/treactor/container";


export const App = Container(function App(context: AppStore['context']) {
    const onClick = useCallback(() => context.addItem(), []);

    return <div className="app">
        {context.items.map((item, i) => <span key={i}>{item}</span>)}
        <button onClick={onClick}>Add item</button>
        <AppContent name="body"/>
    </div>
}, AppStore);