# treactor
Yet another flux/react state management implementation on typescript.
Main idea is to make library as small as possible and don't change the way how to erite react code too much. So it heavily uses react functional components and provide only some helpers:
 - external Store class wich handles all actions using decorated (@action) methods. This decorator will convert method invocation to just putting populated Action class to queue and dispatching them one-by-one. So nested calls inside action handlers will be executed independently in serial manner.
 - immer.js to make changes to store imperative, but be reactive from other side
 - Queue for storing actions
 - useStore function to connect external store with react functional component
 - Container function to wrap top-level react components. It will handle creating and connecting store.
 
