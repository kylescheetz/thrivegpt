import { ResponseSchema } from '@/types/gpt-prompts';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning';
  code: string;
}

export interface ValidationWarning {
  path: string;
  message: string;
  suggestion?: string;
}

export interface ParseResult<T = any> {
  success: boolean;
  data?: T;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  originalText: string;
  parsedFormat: 'json' | 'yaml' | 'text' | 'unknown';
}

export class ResponseParser {
  /**
   * Parse and validate a GPT response against a schema
   */
  static parseAndValidate<T = any>(
    content: string,
    schema: ResponseSchema,
    format: 'json' | 'yaml' | 'text' = 'json'
  ): ParseResult<T> {
    const result: ParseResult<T> = {
      success: false,
      errors: [],
      warnings: [],
      originalText: content,
      parsedFormat: 'unknown'
    };

    try {
      // First, try to parse the content
      const parsed = this.parseContent(content, format);
      result.data = parsed.data;
      result.parsedFormat = parsed.format;
      result.errors.push(...parsed.errors);

      if (parsed.data && parsed.errors.length === 0) {
        // Validate against schema
        const validation = this.validateAgainstSchema(parsed.data, schema);
        result.errors.push(...validation.errors);
        result.warnings.push(...validation.warnings);
        result.success = validation.valid;
      }
    } catch (error) {
      result.errors.push({
        path: 'root',
        message: `Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
        code: 'PARSE_ERROR'
      });
    }

    return result;
  }

  /**
   * Parse content based on format
   */
  private static parseContent(content: string, format: 'json' | 'yaml' | 'text'): {
    data: any;
    format: 'json' | 'yaml' | 'text';
    errors: ValidationError[];
  } {
    const errors: ValidationError[] = [];
    
    if (format === 'text') {
      return { data: content, format: 'text', errors };
    }

    // Try to extract JSON from the content if it's wrapped in markdown or other text
    const cleanedContent = this.extractStructuredContent(content);

    if (format === 'json' || format === 'yaml') {
      try {
        const parsed = JSON.parse(cleanedContent);
        return { data: parsed, format: 'json', errors };
      } catch (jsonError) {
        errors.push({
          path: 'root',
          message: `Invalid JSON format: ${jsonError instanceof Error ? jsonError.message : 'Unknown error'}`,
          severity: 'error',
          code: 'INVALID_JSON'
        });

        // Try to fix common JSON issues
        const fixedJson = this.attemptJsonFix(cleanedContent);
        if (fixedJson) {
          try {
            const parsed = JSON.parse(fixedJson);
            errors[errors.length - 1].severity = 'warning';
            errors[errors.length - 1].message = 'JSON was auto-corrected';
            return { data: parsed, format: 'json', errors };
          } catch {
            // Auto-fix failed, keep original error
          }
        }
      }
    }

    return { data: null, format: 'unknown', errors };
  }

  /**
   * Extract structured content from markdown or mixed text
   */
  private static extractStructuredContent(content: string): string {
    // Remove markdown code blocks
    const codeBlockMatch = content.match(/```(?:json|yaml)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }

    // Look for JSON-like structure
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }

    // Look for YAML-like structure
    const yamlMatch = content.match(/^[a-zA-Z_][\w\s]*:[\s\S]*$/m);
    if (yamlMatch) {
      return content;
    }

    return content.trim();
  }

  /**
   * Attempt to fix common JSON formatting issues
   */
  private static attemptJsonFix(content: string): string | null {
    let fixed = content;

    try {
      // Fix trailing commas
      fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
      
      // Fix unquoted keys
      fixed = fixed.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
      
      // Fix single quotes to double quotes
      fixed = fixed.replace(/'/g, '"');
      
      // Fix escaped quotes issues
      fixed = fixed.replace(/\\"/g, '"');
      
      // Try parsing the fixed version
      JSON.parse(fixed);
      return fixed;
    } catch {
      return null;
    }
  }

  /**
   * Validate parsed data against schema
   */
  private static validateAgainstSchema(
    data: any,
    schema: ResponseSchema,
    path: string = 'root'
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    this.validateNode(data, schema, path, errors, warnings);

    return {
      valid: errors.filter(e => e.severity === 'error').length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate a single node against its schema
   */
  private static validateNode(
    value: any,
    schema: ResponseSchema,
    path: string,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // Check required fields
    if (schema.required && schema.type === 'object' && typeof value === 'object' && value !== null) {
      schema.required.forEach(field => {
        if (!(field in value) || value[field] === undefined || value[field] === null) {
          errors.push({
            path: `${path}.${field}`,
            message: `Missing required field: ${field}`,
            severity: 'error',
            code: 'MISSING_REQUIRED'
          });
        }
      });
    }

    // Type validation
    if (!this.isValidType(value, schema.type)) {
      errors.push({
        path,
        message: `Expected type ${schema.type}, got ${typeof value}`,
        severity: 'error',
        code: 'INVALID_TYPE'
      });
      return; // Don't continue validation if type is wrong
    }

    // Enum validation
    if (schema.enum && !schema.enum.includes(value)) {
      errors.push({
        path,
        message: `Value must be one of: ${schema.enum.join(', ')}. Got: ${value}`,
        severity: 'error',
        code: 'INVALID_ENUM'
      });
    }

    // Object properties validation
    if (schema.type === 'object' && schema.properties && typeof value === 'object' && value !== null) {
      Object.keys(schema.properties).forEach(key => {
        if (key in value) {
          this.validateNode(
            value[key],
            schema.properties![key],
            `${path}.${key}`,
            errors,
            warnings
          );
        }
      });

      // Check for unexpected properties
      Object.keys(value).forEach(key => {
        if (schema.properties && !(key in schema.properties)) {
          warnings.push({
            path: `${path}.${key}`,
            message: `Unexpected property: ${key}`,
            suggestion: 'This property is not defined in the schema'
          });
        }
      });
    }

    // Array validation
    if (schema.type === 'array' && Array.isArray(value) && schema.items) {
      value.forEach((item, index) => {
        this.validateNode(
          item,
          schema.items!,
          `${path}[${index}]`,
          errors,
          warnings
        );
      });
    }

    // String validation
    if (schema.type === 'string' && typeof value === 'string') {
      if (value.length === 0) {
        warnings.push({
          path,
          message: 'Empty string value',
          suggestion: 'Consider providing a meaningful value'
        });
      }
    }

    // Number validation
    if (schema.type === 'number' && typeof value === 'number') {
      if (isNaN(value)) {
        errors.push({
          path,
          message: 'Invalid number value (NaN)',
          severity: 'error',
          code: 'INVALID_NUMBER'
        });
      }
    }
  }

  /**
   * Check if value matches expected type
   */
  private static isValidType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number';
      case 'boolean':
        return typeof value === 'boolean';
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'array':
        return Array.isArray(value);
      default:
        return true;
    }
  }

  /**
   * Generate a human-readable summary of validation results
   */
  static generateValidationSummary(result: ValidationResult): string {
    const { valid, errors, warnings } = result;
    
    if (valid && warnings.length === 0) {
      return '✅ Response is valid and complete';
    }

    const summary: string[] = [];
    
    if (!valid) {
      summary.push(`❌ Validation failed with ${errors.filter(e => e.severity === 'error').length} errors`);
    } else {
      summary.push('✅ Response is valid');
    }

    if (warnings.length > 0) {
      summary.push(`⚠️ ${warnings.length} warnings`);
    }

    const errorCount = errors.filter(e => e.severity === 'error').length;
    const warningCount = errors.filter(e => e.severity === 'warning').length;
    
    if (errorCount > 0) {
      summary.push(`\nErrors (${errorCount}):`);
      errors
        .filter(e => e.severity === 'error')
        .forEach(error => {
          summary.push(`  • ${error.path}: ${error.message}`);
        });
    }

    if (warningCount > 0) {
      summary.push(`\nWarnings (${warningCount}):`);
      errors
        .filter(e => e.severity === 'warning')
        .forEach(warning => {
          summary.push(`  • ${warning.path}: ${warning.message}`);
        });
    }

    if (warnings.length > 0) {
      summary.push(`\nSuggestions:`);
      warnings.forEach(warning => {
        if (warning.suggestion) {
          summary.push(`  • ${warning.path}: ${warning.suggestion}`);
        }
      });
    }

    return summary.join('\n');
  }

  /**
   * Extract specific fields from parsed data with fallbacks
   */
  static extractField<T = any>(data: any, path: string, fallback?: T): T {
    const keys = path.split('.');
    let current = data;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return fallback as T;
      }
    }

    return current as T;
  }

  /**
   * Sanitize and clean response data
   */
  static sanitizeData<T = any>(data: T): T {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item)) as T;
    }

    const sanitized: any = {};
    
    Object.keys(data as any).forEach(key => {
      const value = (data as any)[key];
      
      if (typeof value === 'string') {
        // Trim whitespace and remove excessive newlines
        sanitized[key] = value.trim().replace(/\n{3,}/g, '\n\n');
      } else if (typeof value === 'number') {
        // Ensure valid numbers
        sanitized[key] = isNaN(value) ? 0 : value;
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    });

    return sanitized as T;
  }
}