import { type SchemaTypeDefinition } from 'sanity'
import berita from './berita'
import monitoringAren from './monitoringAren'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [berita, monitoringAren],
}
