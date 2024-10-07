import { BaseEntity } from '../../../../core/entity/base-entity';

export class TypeOrmMapper {
  static toEntity<T extends BaseEntity>(
    schema: any,
    entityConstructor: new (...args: any[]) => T,
  ): T {
    if (!schema) {
      return null;
    }
    return new entityConstructor(schema);
  }

  public static toSchema<T extends BaseEntity>(entity: T): any {
    return entity.toJSON();
  }
}
