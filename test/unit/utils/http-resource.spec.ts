import { HttpError } from '../../../src/utils/http-resources/http-error';
import { HttpResponseMapper } from '../../../src/utils/http-resources/http-response-mapper';

describe('HttpResponseMapper', () => {
    describe('map', () => {
        it('should map body to response with success=true when no errors', () => {
            const body = { message: 'Hello, world!' };
            const result = HttpResponseMapper.map(body);

            expect(result.success).toBe(true);
            expect(result.body).toEqual(body);
            expect(result.errors).toBeUndefined();
        });

        it('should map body to response with success=false when errors present', () => {
            const error = new HttpError();
            const result = HttpResponseMapper.map(null, error);

            expect(result.success).toBe(false);
            expect(result.body).toBeNull();
        });

        it('should map body to response with success=true when body and error is undefined', () => {
            const result = HttpResponseMapper.map();

            expect(result.success).toBe(true);
            expect(result.body).toBeUndefined();
            expect(result.errors).toBeUndefined();
        });
    });
});
