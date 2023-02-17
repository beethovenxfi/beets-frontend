import { Text, Heading, VStack } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';
import useReliquary from '../../lib/useReliquary';
import { useCurrentStep } from '../../lib/useReliquaryCurrentStep';

interface Props {
    investTypeText: string;
}

interface TitleProps {
    title: string | undefined;
    subtitle?: string;
}

interface ExtendedTitleProps extends TitleProps {
    id: string;
    titleTrue?: string;
    titleFalse?: string;
}

export function ReliquaryInvestTitle({ investTypeText }: Props) {
    const { currentStep } = useCurrentStep();
    const { createRelic } = useReliquary();

    const { t } = useTranslation('reliquary');
    const titles = t<string, ExtendedTitleProps[]>('reliquary.invest.titles', { returnObjects: true });

    function getCurrentStepTitle(currentStep: string | null): TitleProps | undefined {
        if (!currentStep) {
            return;
        }
        const [titleRaw] = titles.filter((title) => title.id === currentStep);

        return {
            title:
                currentStep === 'reliquary-invest'
                    ? createRelic
                        ? titleRaw.titleTrue
                        : titleRaw.titleFalse
                    : titleRaw.title,
            ...(titleRaw.subtitle && { subtitle: titleRaw.subtitle }),
        };
    }

    function getTitles() {
        const titles: TitleProps | undefined = getCurrentStepTitle(currentStep);

        return (
            <>
                <Text fontSize="3xl" fontWeight="400">
                    {titles?.title}
                </Text>
                {titles?.subtitle && <Text>{titles.subtitle}</Text>}
            </>
        );
    }

    return (
        <VStack pb="4" spacing="0">
            <Heading size="sm" color="beets.green">
                {investTypeText}
            </Heading>
            {getTitles()}
        </VStack>
    );
}
