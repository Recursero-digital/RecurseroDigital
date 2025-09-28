import { v4 as uuidv4 } from 'uuid';
import { IdGenerator } from '../core/infrastructure/IdGenerator';

export class UUIDGenerator implements IdGenerator {
    generate(): string {
        return uuidv4();
    }
}
