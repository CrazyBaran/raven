import {
  GenericCreateResponseSchema,
  GenericResponseSchema,
} from '@app/rvns-api';
import { TagData, TagTypeEnum } from '@app/rvns-tags';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiOAuth2,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@Controller('tags')
@ApiOAuth2(['openid'])
export class TagsController {
  public constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({ description: 'Get all tags' })
  @ApiResponse(GenericResponseSchema())
  @ApiQuery({ name: 'type', type: String, required: false })
  @Get()
  public async getAllTags(@Query() type?: TagTypeEnum): Promise<TagData[]> {
    return await Promise.all(
      (await this.tagsService.getAllTags()).map((tag) =>
        this.tagsService.tagEntityToTagData(tag),
      ),
    );
  }

  @ApiOperation({ description: 'Create tag' })
  @ApiResponse(GenericCreateResponseSchema())
  @Post()
  public async createTag(@Body() createTagDto: CreateTagDto): Promise<TagData> {
    return this.tagsService.tagEntityToTagData(
      await this.tagsService.createTag(createTagDto),
    );
  }
}
