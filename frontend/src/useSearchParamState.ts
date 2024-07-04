import { useSearchParams } from "react-router-dom";

type Dispatch<A> = (value: A) => void;
type SetSearchParamStateAction<S> = S | ((prevState?: S) => S);

export function useSearchParamState<T extends string>(
    paramName: string,
    defaultValue: T
): [T, Dispatch<SetSearchParamStateAction<T>>];
export function useSearchParamState<T extends string>(
    paramName: string
): [T | undefined, Dispatch<SetSearchParamStateAction<T | undefined>>];

export function useSearchParamState<T>(paramName: string, defaultValue?: T) {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentState = (searchParams.get(paramName) as T) ?? defaultValue;
    const setState: Dispatch<SetSearchParamStateAction<T>> = (value) => {
        const newParams = new URLSearchParams(searchParams);
        let newValue: T | undefined;
        if (typeof value === "function") {
            const cb = value as (prevState?: T) => T | undefined;
            newValue = cb(currentState);
        } else {
            newValue = value;
        }
        if (newValue == undefined || newValue === defaultValue) {
            newParams.delete(paramName);
        } else {
            newParams.set(paramName, newValue as string);
        }
        setSearchParams(newParams);
    };

    return [currentState, setState];
}
