import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class EncodeResponseDto {
    @ApiProperty({
        description: 'The encode short url',
        example: 'https://short.est/abc123',
    })
    @IsUrl()
    shortUrl: string;
}
