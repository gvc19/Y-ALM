# Swagger Integration for NestJS Backend

This project has been integrated with Swagger for comprehensive API documentation.

## Features

- **Interactive API Documentation**: Browse and test your API endpoints through a web interface
- **Request/Response Schemas**: Detailed documentation of all data structures
- **Endpoint Descriptions**: Clear descriptions and examples for each API endpoint
- **Multiple Server Environments**: Support for different deployment environments

## Accessing Swagger UI

Once your application is running, you can access the Swagger documentation at:

```
http://localhost:3000/api
```

## Available Endpoints

### Health Check Endpoints

- `GET /` - Get hello message
- `GET /status` - Get API status and timestamp
- `GET /version` - Get API version and environment information

## Configuration

The Swagger configuration is located in `src/swagger.config.ts` and includes:

- API title and description
- Version information
- Contact details
- License information
- Server configurations
- API tags for organization

## Adding New Endpoints

To add new endpoints with Swagger documentation:

1. **Import Swagger decorators**:
   ```typescript
   import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
   ```

2. **Add tags to your controller**:
   ```typescript
   @ApiTags('your-tag-name')
   @Controller('your-route')
   ```

3. **Document your endpoints**:
   ```typescript
   @Get()
   @ApiOperation({ summary: 'Your endpoint summary' })
   @ApiResponse({ 
     status: 200, 
     description: 'Description of the response',
     type: YourResponseDto
   })
   ```

4. **Create DTOs for request/response schemas**:
   ```typescript
   export class YourResponseDto {
     @ApiProperty({
       description: 'Property description',
       example: 'Example value',
       type: String
     })
     property: string;
   }
   ```

## Customization

You can customize the Swagger configuration by modifying `src/swagger.config.ts`:

- Change API title and description
- Add more server environments
- Modify contact information
- Add authentication schemes
- Customize tags and categories

## Dependencies

The following packages are required for Swagger integration:

- `@nestjs/swagger` - NestJS Swagger module
- `swagger-ui-express` - Swagger UI for Express

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## Notes

- Swagger documentation is automatically generated based on your decorators
- All endpoints are automatically discovered and documented
- The documentation updates automatically when you restart the application
- You can test API endpoints directly from the Swagger UI interface
