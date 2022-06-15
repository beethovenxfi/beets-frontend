import Slider from 'react-slick';
import { HomeSocialCarouselCard } from '~/modules/home/components/HomeSocialCarouselCard';
import { Box, Flex, IconButton, Link } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'react-feather';

export function HomeSocialCarousel() {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        arrows: true,
        nextArrow: (
            <Box>
                <Link color="gray.100" position="absolute" style={{ right: '-18px' }}>
                    <ChevronRight size={32} />
                </Link>
            </Box>
        ),
        prevArrow: (
            <Box>
                <Link color="gray.100" position="absolute" style={{ left: '-18px' }}>
                    <ChevronLeft size={32} />
                </Link>
            </Box>
        ),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <Flex height="92.5px" flexDirection="column" justifyContent="flex-end">
            <Box bgColor="gray.700" py="4" px="2" borderRadius="md" mx="12">
                <Slider {...settings}>
                    <HomeSocialCarouselCard height="153px" />
                    <HomeSocialCarouselCard height="153px" />
                    <HomeSocialCarouselCard height="153px" />
                    <HomeSocialCarouselCard height="153px" />
                    <HomeSocialCarouselCard height="153px" />
                    <HomeSocialCarouselCard height="153px" />
                    <HomeSocialCarouselCard height="153px" />
                    <HomeSocialCarouselCard height="153px" />
                </Slider>
            </Box>
        </Flex>
    );
}
