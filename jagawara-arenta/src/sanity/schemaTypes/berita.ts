export default {
    name: 'berita',
    type: 'document',
    title: 'Histori Bencana',
    fields: [
        {
            name: 'judul',
            type: 'string',
            title: 'Judul Bencana',
            validation: (Rule: any) => Rule.required().error('Judul tidak boleh kosong!')
        },
        {
            name: 'tahun',
            type: 'number',
            title: 'Tahun Kejadian',
            validation: (Rule: any) => Rule.required().min(1900).max(2100)
        },
        {
            name: 'deskripsi',
            type: 'text',
            title: 'Deskripsi / Kronologi',
            description: 'Ceritakan detail kejadian longsor atau bencana lainnya.',
            validation: (Rule: any) => Rule.required()
        },
        {
            name: 'galeri_foto',
            type: 'array',
            title: 'Galeri Foto',
            description: 'Bisa upload lebih dari satu foto.',
            of: [
                { 
                    type: 'image', 
                    options: { hotspot: true }
                }
            ],
            options: {
                layout: 'grid'
            }
        }
    ]
}