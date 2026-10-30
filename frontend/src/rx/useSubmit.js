import { useEffect, useMemo, useRef, useState } from "react";
import { Subject, catchError, defer, exhaustMap, finalize, of } from "rxjs";

export function useSubmit(action) {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState(null);
    const actionRef = useRef(action);
    actionRef.current = action;

    const submit$ = useMemo(() => new Subject(), []);

    useEffect(() => {
        const subscription = submit$
            .pipe(
                exhaustMap((value) => {
                    setPending(true);
                    setError(null);
                    return defer(() => actionRef.current(value)).pipe(
                        catchError((failure) => {
                            setError(failure);
                            return of(null);
                        }),
                        finalize(() => setPending(false))
                    );
                })
            )
            .subscribe();

        return () => subscription.unsubscribe();
    }, [submit$]);

    return {
        submit: (value) => submit$.next(value),
        pending,
        error,
        clearError: () => setError(null),
    };
}
