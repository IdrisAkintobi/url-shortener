import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class EncodeRequestDto {
    @ApiProperty({
        description: 'The long url to encode',
        example: 'https://example.com/this-is-a-very-long-url',
        required: true,
    })
    @IsUrl({
        require_protocol: true,
        allow_underscores: true,
    })
    readonly longUrl: string;
}
