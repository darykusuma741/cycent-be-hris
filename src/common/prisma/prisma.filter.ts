import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch(PrismaClientKnownRequestError)
export class PrismaFilter implements ExceptionFilter<PrismaClientKnownRequestError> {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    let text: String = '';
    switch (exception.code) {
      case 'P2000':
        text = 'The value provided for one of the fields is too long. Please reduce its length and try again.';
        break;
      case 'P2001':
        text = 'No data found for the specified query. Please check the input and try again.';
        break;
      case 'P2002':
        text = 'A unique constraint was violated. The value already exists in the database. Please provide a different value.';
        break;
      case 'P2003':
        text = 'Foreign key constraint violation. Related data was not found in the database.';
        break;
      case 'P2004':
        text = 'A database constraint violation occurred. Please ensure all field values are valid.';
        break;
      case 'P2005':
        text = 'An invalid value was provided for one of the fields. Please check and correct the input.';
        break;
      case 'P2006':
        text = 'The type of value provided does not match the expected data type for the field. Please check and try again.';
        break;
      case 'P2007':
        text = 'Data validation failed due to a rule violation in the database. Please check your input.';
        break;
      case 'P2008':
        text = 'An unexpected error occurred while processing the query. Please try again later.';
        break;
      case 'P2009':
        text = 'The operation timed out. Please check your query and network settings and try again.';
        break;
      case 'P2010':
        text = 'The database is in an invalid state. Please check the database integrity and try again.';
        break;
      case 'P2011':
        text = 'A field value was too large for the database. Please reduce the value and try again.';
        break;
      case 'P2012':
        text = 'A foreign key violation occurred. Please ensure all related data is correctly linked.';
        break;
      case 'P2013':
        text = 'The query was invalid. Please check the query structure and ensure all parameters are correct.';
        break;
      case 'P2014':
        text = 'The requested data could not be found. Please ensure the query parameters are correct.';
        break;
      case 'P2015':
        text = 'There was an error with the database migration process. Please check the migration files and try again.';
        break;
      case 'P2016':
        text = 'There was an issue with inserting data. Please check the data format and try again.';
        break;
      case 'P2017':
        text = 'Data update failed. Please verify the input data and ensure it meets the necessary constraints.';
        break;
      case 'P2018':
        text = 'Data deletion failed due to foreign key constraints. Please ensure related data is deleted or updated.';
        break;
      case 'P2019':
        text = 'Data does not meet the schema constraints. Please check the input data and ensure it adheres to the schema rules.';
        break;
      case 'P2020':
        text = 'Failed to execute query due to an unknown error. Please check the logs for more details.';
        break;
      case 'P2021':
        text = 'A database connection issue occurred. Please check the database connection and try again.';
        break;
      case 'P2022':
        text = 'The specified relation was not found in the database schema. Please ensure the relation exists.';
        break;
      case 'P2023':
        text = 'The migration step could not be completed due to a mismatch in the schema. Please check the migration logs.';
        break;
      case 'P2024':
        text = 'The database engine failed to execute the query. Please ensure all fields are properly configured.';
        break;
      case 'P2025':
        text = 'The record to update or delete was not found in the database. Please verify the data exists.';
        break;
      case 'P2026':
        text = 'A type mismatch error occurred during query execution. Please ensure correct types are used for the fields.';
        break;
      case 'P2027':
        text = 'The connection to the database was lost during the operation. Please check the connection and try again.';
        break;
      case 'P2028':
        text = 'The operation could not be completed because of a locking issue in the database.';
        break;
      case 'P2029':
        text = 'A database constraint could not be fulfilled due to missing data. Please ensure all required data is present.';
        break;
      case 'P2030':
        text = 'Database write operation failed due to permission issues. Please check the database user permissions.';
        break;
      case 'P2031':
        text = 'A transaction failure occurred. Please ensure the transaction is valid and try again.';
        break;
      case 'P2032':
        text = 'The database schema has changed. Please ensure your migrations are up to date and retry.';
        break;
      case 'P2033':
        text = 'A timeout occurred during query execution. Please check your query and database performance.';
        break;
      case 'P2034':
        text = 'Query execution failed due to insufficient database resources. Please check the server status.';
        break;
      case 'P2035':
        text = 'Database synchronization failed. Please verify the sync process and retry the operation.';
        break;
      case 'P2036':
        text = 'An unknown error occurred while executing the database query. Please review the logs for further details.';
        break;
      case 'P2037':
        text = 'A concurrency issue occurred while processing the request. Please retry the operation.';
        break;

      default:
        text = exception.message;
        break;
    }
    this.logger.error(`(${exception.code}) ${text}`);
    // this.logger.error('\n===================== Prisma Error =======================' + exception.message + '\n===================== Prisma Error =======================');

    response.status(400).json({
      statusCode: 400,
      // message: exception.errors.map((e) => `${e.path}, ${e.message}`).join(' || '),
      message: `${text}`,
    });
  }
}
