import { Skeleton, SkeletonProps } from '@chakra-ui/react';

export function BeetsSkeleton(props: SkeletonProps) {
    return <Skeleton {...props} startColor="gray.400" endColor="gray.500" />;
}
