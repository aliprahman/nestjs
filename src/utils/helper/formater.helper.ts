import { ClassTransformOptions, plainToInstance } from 'class-transformer';

export const circularToJSON = (circular: unknown) => JSON.parse(JSON.stringify(circular));

export function transformer<T, V>(
    cls: { new (...args: unknown[]): T },
    obj: V | V[],
    options?: ClassTransformOptions,
  ) {
    const result = plainToInstance(cls, circularToJSON(obj), {
      excludeExtraneousValues: true,
      exposeUnsetFields: true,
      enableImplicitConversion: true,
      // exposeDefaultValues: true,
      ...options,
    });
    return result as unknown;
  }