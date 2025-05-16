# Swagger (OpenAPI) Integration Guide for KINE-SAAS

This guide explains how to effectively use Swagger/OpenAPI documentation in the KINE-SAAS project.

## Overview

Swagger is integrated into our NestJS backend to provide interactive API documentation. The configuration allows us to:

- View and test API endpoints through a web UI
- Document endpoints, parameters, and responses
- Generate OpenAPI specification files
- Authenticate with JWT tokens to test protected routes
- Organize endpoints into logical groups with tags

## Accessing Swagger Documentation

The Swagger UI is available at:

```
http://localhost:3001/api/docs
```

The OpenAPI specification JSON file is automatically generated at:

```
/home/marouane-dbibih/projects/KINE-SAAS/apis/openapi-spec.json
```

## Key Decorators

### Controller Level Decorators

```typescript
@ApiTags('patients')
@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('jwt')  // Note: 'jwt' must match the name in DocumentBuilder.addBearerAuth()
export class PatientController {
  // Controller methods
}
```

### Method Level Decorators

```typescript
@Post()
@ApiOperation({ summary: 'Create a new patient' })
@ApiBody({ type: CreatePatientDto })
@ApiResponse({ status: 201, description: 'The patient has been successfully created.' })
@ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
create(@Body() createPatientDto: CreatePatientDto) {
  // Implementation
}
```

### Parameter Decorators

```typescript
@Get(':id')
@ApiParam({ name: 'id', description: 'Patient ID', type: String })
findOne(@Param('id') id: string) {
  // Implementation
}
```

```typescript
@Get()
@ApiQuery({ name: 'search', required: false, type: PatientSearchDto })
findAll(@Query() searchDto: PatientSearchDto) {
  // Implementation
}
```

### DTO Decorators

```typescript
export class CreatePatientDto {
  @ApiProperty({
    description: 'Patient first name',
    example: 'Mohammed',
    maxLength: 50
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional({
    description: 'Patient address',
    example: '123 Rue Mohammed V, Casablanca'
  })
  @IsOptional()
  @IsString()
  address?: string;
}
```

## Best Practices

### 1. Consistent Grouping with Tags

Group related endpoints using `@ApiTags`:

```typescript
// Auth module
@ApiTags('auth')
export class AuthController {}

// User module
@ApiTags('users')
export class UsersController {}

// Patient module
@ApiTags('patients') 
export class PatientController {}
```

### 2. Comprehensive API Responses

Document all possible response statuses:

```typescript
@ApiResponse({ status: 200, description: 'Success', type: PatientResponseDto })
@ApiResponse({ status: 400, description: 'Bad Request - Invalid data' })
@ApiResponse({ status: 401, description: 'Unauthorized - Token missing or invalid' })
@ApiResponse({ status: 403, description: 'Forbidden - Insufficient privileges' })
@ApiResponse({ status: 404, description: 'Not Found - Resource does not exist' })
@ApiResponse({ status: 500, description: 'Server Error' })
```

### 3. Detailed DTO Documentation

Always include:
- Description (what the field is for)
- Example (realistic sample data)
- Format/pattern information for special formats
- Validation constraints

```typescript
@ApiProperty({
  description: 'Patient Moroccan phone number',
  example: '+212661234567',
  pattern: '\\+212[567]\\d{8}'
})
```

### 4. Security Documentation

Always mark protected endpoints with `@ApiBearerAuth('jwt')` at either controller or method level.

### 5. Use Response Models

Define and use response DTOs to document what your API returns:

```typescript
@ApiResponse({ 
  status: 200, 
  description: 'Patient retrieved successfully',
  type: PatientResponseDto 
})
```

### 6. Pagination Documentation

For endpoints with pagination:

```typescript
@ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
@ApiQuery({ name: 'limit', required: false, description: 'Items per page', type: Number })
@ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by', type: String })
```

### 7. Schema Organization

Keep your Swagger documentation clean as the application grows:

1. Group endpoints logically with `@ApiTags`
2. Use consistent naming conventions
3. Use meaningful operation IDs
4. Document query parameters thoroughly
5. Keep examples up to date

## Complete Example

```typescript
@ApiTags('patients')
@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('jwt')
export class PatientController {
  @Get(':id/medical-record')
  @Roles(UserRole.ADMIN, UserRole.KINESITHERAPEUTE)
  @ApiOperation({ 
    summary: 'Get patient medical record',
    operationId: 'getPatientMedicalRecord' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Patient ID (UUID format)', 
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Medical record retrieved successfully.',
    type: MedicalRecordResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient privileges.' })
  @ApiResponse({ status: 404, description: 'Patient or medical record not found.' })
  getMedicalRecord(@Param('id') id: string) {
    return this.patientService.getMedicalRecord(id);
  }
}
```

## Maintaining Documentation

As the application grows:

1. Create a documentation review as part of pull request process
2. Create automated tests to ensure documentation is up to date
3. Remove deprecated endpoints from documentation
4. Consider breaking down large controller documentation into smaller focused controllers
5. Create API versions when making breaking changes
