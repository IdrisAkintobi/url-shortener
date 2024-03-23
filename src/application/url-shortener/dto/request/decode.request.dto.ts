import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class DecodeRequestDto {
    @ApiProperty({
        description: 'The short url to decode',
        example: 'https://short.est/short1',
        required: true,
    })
    @IsUrl()
    readonly shortUrl: string;
}
