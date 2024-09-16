import { MetadataKeys } from '@domain/enums/metadata-keys.enum'

export const Controller = (basePath: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(MetadataKeys.BASE_PATH, basePath, target)
  }
}
