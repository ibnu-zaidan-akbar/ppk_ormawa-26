export default {
  name: 'monitoringAren',
  title: 'Monitoring Aren',
  type: 'document',
  fields: [
    {
      name: 'nama_lahan',
      title: 'Nama Lahan',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'foto_lahan',
      title: 'Foto Lahan',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Bisa upload lebih dari satu foto untuk dokumentasi lahan.',
    },
    {
      name: 'jumlah_bibit',
      title: 'Jumlah Pohon Aren',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'survival_rate',
      title: 'Survival Rate (%)',
      type: 'number',
      description: 'Gunakan titik untuk angka desimal (contoh: 85.5)',
      validation: (Rule: any) => Rule.required().min(0).max(100),
    },
  ]
}