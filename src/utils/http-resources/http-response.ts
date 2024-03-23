import { ApiProperty } from '@nestjs/swagger';

import { HttpError } from './http-error';

export class HttpResponse<T = unknown> {
    @ApiProperty()
    success: boolean;

    @ApiProperty()
    body?: T;

    errors?: Array<HttpError>;
}
