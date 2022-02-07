import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

//swagger
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

// Product
import { Product_DTO } from './product.model';
import { Product_Service } from './product.service';

@ApiTags('Products')
@Controller('product')
export class Product_Controller {
  constructor(private readonly product_service: Product_Service) {}

  // Add product
  @Post('/add_product')
  @ApiCreatedResponse({ description: 'Create a product in database' })
  async add_product(@Body() data: Product_DTO) {
    const add_response = await this.product_service.insert_product(data);
    return add_response;
  }

  // Get all products
  @Get('/get_all_products')
  @ApiOkResponse({ description: 'Get all products in database' })
  async get_all_products() {
    const all_response = await this.product_service.find_all();
    return all_response;
  }

  // Get product by id
  @Get('/get_product_byID/:id')
  @ApiOkResponse({ description: 'Get an product by id' })
  async get_product_byID(@Param('id') product_id: string) {
    const byID_response = await this.product_service.find_byID(product_id);
    return byID_response;
  }

  // Delete product
  @Delete(':id')
  @ApiOkResponse({ description: 'Delete an product from database' })
  async delete_product(@Param('id') product_id: string) {
    const delete_response = await this.product_service.delete_product(
      product_id,
    );
    return delete_response;
  }
}