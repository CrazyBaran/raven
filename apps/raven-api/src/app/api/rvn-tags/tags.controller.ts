import {
  EmptyResponseData,
  GenericCreateResponseSchema,
  GenericResponseSchema,
} from '@app/rvns-api';
import { TagData, TagTypeEnum } from '@app/rvns-tags';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOAuth2,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from './entities/tag.entity';
import { ParseTagPipe } from './pipes/parse-tag.pipe';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@Controller('tags')
@ApiOAuth2(['openid'])
export class TagsController {
  public constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({ description: 'Get all tags' })
  @ApiResponse(GenericResponseSchema())
  @ApiQuery({ name: 'type', enum: TagTypeEnum, required: false })
  @Get()
  public async getAllTags(
    @Query('type') type?: TagTypeEnum | null,
  ): Promise<TagData[]> {
    return await Promise.all(
      (await this.tagsService.getAllTags(type)).map((tag) =>
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

  @ApiOperation({ description: 'Update tag' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'id', type: String })
  @Patch(':id')
  public async updateTag(
    @Param('id', ParseUUIDPipe, ParseTagPipe) tagEntity: TagEntity,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<TagData> {
    return this.tagsService.tagEntityToTagData(
      await this.tagsService.updateTag(tagEntity, { name: updateTagDto.name }),
    );
  }

  @ApiOperation({ description: 'Get single tag' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  public async getTag(
    @Param('id', ParseUUIDPipe, ParseTagPipe) tagEntity: TagEntity,
  ): Promise<TagData> {
    return this.tagsService.tagEntityToTagData(tagEntity);
  }

  @ApiOperation({ description: 'Delete tag' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  public async deleteTag(
    @Param('id', ParseUUIDPipe, ParseTagPipe) tagEntity: TagEntity,
  ): Promise<EmptyResponseData> {
    await this.tagsService.deleteTag(tagEntity);
  }
}
