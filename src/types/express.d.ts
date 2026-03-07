import 'express';
import { UserPayload } from '@common/guard/user.payload';
declare module 'express' {
  export interface Request {
    user: UserPayload;
    file?: Express.Multer.File;
  }
}
