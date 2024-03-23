import { ApiProperty } from '@nestjs/swagger';

export class HttpError {
    @ApiProperty()
    errorCode: string;

    @ApiProperty()
    errorMessage: string;
}
