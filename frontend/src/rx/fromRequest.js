import { Observable, catchError, map, of, startWith } from "rxjs";

export function fromRequest(load) {
    return new Observable((subscriber) => {
        const controller = new AbortController();

        load(controller.signal).then(
            (value) => {
                subscriber.next(value);
                subscriber.complete();
            },
            (error) => {
                if (error.name !== "AbortError") {
                    subscriber.error(error);
                }
            }
        );

        return () => controller.abort();
    });
}

export function withStatus(source$) {
    return source$.pipe(
        map((data) => ({ status: "success", data, error: null })),
        startWith({ status: "loading", data: null, error: null }),
        catchError((error) => of({ status: "error", data: null, error }))
    );
}

export function loadWithStatus(load) {
    return withStatus(fromRequest(load));
}
