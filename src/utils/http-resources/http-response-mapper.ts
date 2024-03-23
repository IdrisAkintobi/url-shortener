import { HttpError } from './http-error';
import { HttpResponse } from './http-response';

export class HttpResponseMapper {
    static map<T>(body?: T, errors?: HttpError): HttpResponse<T> {
        return {
            success: !errors,
            body,
        };
    }
}
