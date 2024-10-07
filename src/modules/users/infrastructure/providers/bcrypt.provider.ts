import { HashProvider } from '../../providers/hash.provider';
import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class BcryptProvider implements HashProvider {
  async hash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  async compare(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
