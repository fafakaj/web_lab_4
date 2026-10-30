import { useEffect, useState } from "react";

export function useObservable(observable$, initialValue) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        const subscription = observable$.subscribe(setValue);
        return () => subscription.unsubscribe();
    }, [observable$]);

    return value;
}
