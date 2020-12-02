import {current as immerCurrent, isDraft} from "immer";


export function current(x: any) {
    return isDraft(x) ? immerCurrent(x) : x;
}