import { Swiper, SwiperSlide } from 'swiper/react';
import { ReactNode } from 'react';
import { Pagination } from 'swiper';

interface Props {
    items: ReactNode[];
}

export function Carousel({ items }: Props) {
    return (
        <Swiper
            slidesPerView={4}
            spaceBetween={16}
            onSlideChange={() => console.log('slide change')}
            //onSwiper={(swiper) => console.log(swiper)}
            breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
            }}
            pagination={{
                dynamicBullets: true,
                clickable: true,
            }}
            modules={[Pagination]}
        >
            {items.map((item, index) => (
                <SwiperSlide key={index}>{item}</SwiperSlide>
            ))}
        </Swiper>
    );
}
