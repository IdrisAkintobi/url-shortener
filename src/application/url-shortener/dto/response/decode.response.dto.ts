import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class DecodeResponseDto {
    @ApiProperty({
        description: 'The decoded long url',
        example: 'https://example.com/this-is-a-very-long-url',
    })
    @IsUrl()
    longUrl: string;
}
