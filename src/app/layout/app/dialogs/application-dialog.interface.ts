export interface IApplicationDialog<T> {
    close(): void;
    submit(data: T): void;
}
