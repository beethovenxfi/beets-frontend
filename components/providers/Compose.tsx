export type ProviderWithProps = [React.JSXElementConstructor<React.PropsWithChildren<any>>, any];
interface Props {
    providers: Array<ProviderWithProps>;
    children: React.ReactNode;
}

export default function Compose(props: Props) {
    const { providers = [], children } = props;

    return (
        <>
            {providers.reduceRight((acc, prov) => {
                const Provider = prov[0];
                return <Provider {...(prov[1] || {})}>{acc}</Provider>;
            }, children)}
        </>
    );
}
