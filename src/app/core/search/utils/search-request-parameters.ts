import { HttpParams } from '@angular/common/http';

export class SearchRequestParametersUtils<T> {
    public static getHttpRequestParams<T>(parameters: T): HttpParams {
        return Object.keys(parameters)
            .reduce((previousValue: HttpParams, key: string) => (
                parameters[key] ? previousValue.append(key, parameters[key]) : previousValue
            ), new HttpParams());
    }
}
