"use client";
import Image from 'next/image'
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Team(){
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const staff = [
        { id: 1, foto: "/team/zeto.webp", nama:"Mazetto Faiq Aqillah", npm:"150510230274", divisi:"Project Manager", ig: ""},
        { id: 2, foto: "/team/iza.webp", nama:"Maritza Khansa", npm:"150510240042", divisi:"Ketua Tim Pelaksana", ig: ""},
        { id: 3, foto: "/team/nada.webp", nama:"Nada Syifa Nabilah", npm:"140410230002", divisi:"Project Manager", ig: ""},
        { id: 4, foto: "/team/zita.webp", nama:"Azita Aghni Maheerah", npm:"280904240089", divisi:"Creative Media", ig: ""},
        { id: 5, foto: "/team/hae.webp", nama:"Haerunisa", npm:"150510240332", divisi:"Creative Media", ig: ""},
        { id: 6, foto: "/team/ibnu.webp", nama:"Ibnu Zaidan Akbar", npm:"140810240043", divisi:"Project Manager", ig: ""},
        { id: 7, foto: "/team/aqila.webp", nama:"Maisya Najma Aqila", npm:"281204240018", divisi:"Public Relation", ig: ""},
        { id: 8, foto: "/team/naufal.webp", nama:"M. Naufal Azis", npm:"281204240046", divisi:"Creative Media", ig: ""},
        { id: 9, foto: "/team/nayla.webp", nama:"Nayla Haura Balqis Wijanarko", npm:"240310240044", divisi:"Sekretaris", ig: ""},
        { id: 10, foto: "/team/zaki.webp", nama:"Zaki Hasi Ramdhani", npm:"281204240065", divisi:"Creative Media", ig: ""},
        { id: 11, foto: "/team/fawaz.webp", nama:"Raden Fawwaz Badrani A. P", npm:"150610250076", divisi:"Bendahara", ig: ""},
        { id: 12, foto: "/team/adil.webp", nama:"Rayhan Fadilah Ramdan", npm:"281204250088", divisi:"Public Relation", ig: ""},
    ];

    return(
        <main className="font-spartan bg-white">
            <div className="min-h-screen flex justify-center items-center">
                <span data-aos="fade-up" data-aos-duration="1000" className="text-[24px] md:text-[32px] lg:text-[40px] font-bold text-black">MEET OUR TEAM</span>
            </div>
            <section className="flex flex-col py-4 md:py-8 px-4 md:px-8 items-center justify-center overflow-hidden min-h-screen overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 flex gap-4">
                    {staff.map((item) => (
                        <a data-aos="zoom-in" data-aos-duration="1000" key={item.id} className={"relative flex flex-col gap-1 md:gap-2 transition-all rounded-[30px] overflow-hidden " + (item.id === 2 ? "order-1 md:order-2" : (item.id === 1 ? "order-2 md:order-1" : "order-3 md:order3"))} target="_blank" href={item.ig}>
                            <div className="absolute bottom-2 left-0 w-full text-center z-0">
                                <span className="text-[16px] lg:text-[20px] text-[#0C2F69]">{item.divisi}</span>
                            </div>

                            <Image
                                src={item.foto}
                                alt={item.nama}
                                width={520}
                                height={520}
                                className="relative z-10 w-full h-auto rounded-[30px] object-cover object-center"
                                loading={item.id === 1 ? "eager" : "lazy"}
                            />

                            <span className="absolute bottom-8 left-0 z-20 w-full text-center text-[24px] lg:text-[28px] font-semibold text-[#0C2F69]">
                                {item.nama}
                            </span>
                        </a>
                    ))}
                </div>
            </section>
        </main>
    )
}