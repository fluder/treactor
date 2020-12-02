import React, {useCallback} from "react";
import {ContainerProps} from "@/treactor";
import {AppContentStore} from "@/treactor/example/components/AppContent/store";
import {Container} from "@/treactor/container";


export const AppContent = Container(function AppContent(context: AppContentStore['context']) {
    const onClick = useCallback(() => context.addItem(), []);

    return <div className="body">
        {context.items.map((item, i) => <span key={i}>{item}</span>)}
        <button onClick={onClick}>Add item1</button>
    </div>
}, AppContentStore);