interface Props {
    providers: Array<React.JSXElementConstructor<React.PropsWithChildren<any>>>;
    children: React.ReactNode;
}

export default function Compose(props: Props) {
    const { providers = [], children } = props;

    return (
        <>
            {providers.reduceRight((acc, Provider) => {
                return <Provider>{acc}</Provider>;
            }, children)}
        </>
    );
}
