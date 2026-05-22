import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { FollowRestaurantDto } from './dto/follow-restaurant.dto.js';
import { MainController } from '../../shared/base/main.controller.js';
import { PaginationQueryDto } from '../../shared/dto/pagination.dto.js';
import { 
  CreateUserResponseDto, 
  PaginatedUsersResponseDto, 
  UserResponseDto, 
  FollowRestaurantResponseDto, 
  UnfollowRestaurantResponseDto, 
  UserFollowingResponseDto 
} from './dto/response-users.dto.js';

@ApiTags('Users')
@Controller('users')
export class UsersController extends MainController {
  constructor(private readonly UsersService: UsersService) {
    super(UsersService);
  }

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiOkResponse({ description: 'List of users', type: PaginatedUsersResponseDto })
  async index<T = UserResponseDto, Q extends PaginationQueryDto = PaginationQueryDto>(@Query() query: Q) {
    query.page = query.page ? Number(query.page) : 1;
    query.limit = query.limit ? Number(query.limit) : 20;

    return this.UsersService.findAll<T>(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: CreateUserResponseDto })
  create(@Body() dto: CreateUserDto) {
    return this.UsersService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiOkResponse({ description: 'User details', type: UserResponseDto })
  findOne(@Param('id') id: string) {
    return this.UsersService.findById(id);
  }

  @Post(':id/follow')
  @ApiOperation({ summary: 'Follow a restaurant' })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiCreatedResponse({ description: 'Followed successfully', type: FollowRestaurantResponseDto })
  follow(@Param('id') id: string, @Body() dto: FollowRestaurantDto) {
    return this.UsersService.followRestaurant(id, dto);
  }

  @Delete(':id/follow')
  @ApiOperation({ summary: 'Unfollow a restaurant' })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiOkResponse({ description: 'Unfollowed successfully', type: UnfollowRestaurantResponseDto })
  unfollow(@Param('id') id: string, @Body() dto: FollowRestaurantDto) {
    return this.UsersService.unfollowRestaurant(id, dto);
  }

  @Get(':id/following')
  @ApiOperation({ summary: 'Get restaurants followed by a user' })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiOkResponse({ description: 'List of followed restaurants', type: [UserFollowingResponseDto] })
  getFollowing(@Param('id') id: string) {
    return this.UsersService.getFollowedRestaurants(id);
  }
}
