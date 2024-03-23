import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    UseFilters,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ErrorExceptionFilter } from '../../utils/exception/error-exception-filter';
import { HttpResponse } from '../../utils/http-resources/http-response';
import { HttpResponseMapper } from '../../utils/http-resources/http-response-mapper';
import { DecodeRequestDto } from './dto/request/decode.request.dto';
import { EncodeRequestDto } from './dto/request/encode.request.dto';
import { StatisticRequestDto } from './dto/request/statistic.request.dto';
import { DecodeResponseDto } from './dto/response/decode.response.dto';
import { EncodeResponseDto } from './dto/response/encode.response.dto';
import { StatisticResponseDto } from './dto/response/statistic.response.dto';
import { ShortUrlService } from './url-shortener.service';

@ApiTags('url-shortener')
@Controller('v1')
@UseFilters(ErrorExceptionFilter)
export class ShortUrlController {
    constructor(private readonly shortUrlService: ShortUrlService) {}

    @ApiBody({ type: EncodeRequestDto, description: 'Encode long url' })
    @HttpCode(HttpStatus.OK)
    @Post('/encode')
    async encode(@Body() { longUrl }: EncodeRequestDto): Promise<HttpResponse<EncodeResponseDto>> {
        const response = await this.shortUrlService.encode(longUrl);
        return HttpResponseMapper.map(response);
    }

    @ApiBody({ type: DecodeRequestDto, description: 'Decode short url' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Get('/decode')
    async decode(@Body() { shortUrl }: DecodeRequestDto): Promise<HttpResponse<DecodeResponseDto>> {
        const response = await this.shortUrlService.decode(shortUrl);
        return HttpResponseMapper.map(response);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Get('/statistic/:path')
    async statistic(
        @Param() { path }: StatisticRequestDto,
    ): Promise<HttpResponse<StatisticResponseDto>> {
        const response = await this.shortUrlService.statistics(path);
        return HttpResponseMapper.map(response);
    }
}
