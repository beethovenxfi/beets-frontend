import { useOnAppLoad } from '~/components/global/useOnAppLoad';

export function GlobalRenderer() {
    useOnAppLoad();

    return <></>;
}
