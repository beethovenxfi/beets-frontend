import { Skeleton, SkeletonProps } from '@chakra-ui/react';

export function BeetsSkeleton(props: SkeletonProps) {
    return <Skeleton borderRadius="md" startColor="gray.400" endColor="gray.500" {...props} />;
}
