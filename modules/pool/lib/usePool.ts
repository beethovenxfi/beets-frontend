import { useContext } from 'react';
import { PoolContext, PoolContextType } from '~/modules/pool/components/PoolProvider';

export function usePool() {
    //we force cast here because the context will never be null
    return useContext(PoolContext) as PoolContextType;
}
