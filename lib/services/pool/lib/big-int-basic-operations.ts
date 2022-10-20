export const BZERO = BigInt(0);
export const BONE = BigInt(1);

const _require = (b: boolean, message: string) => {
    if (!b) throw new Error(message);
};

/**
 * @dev Applies `scalingFactor` to `amount`, resulting in a larger or equal value depending on whether it needed
 * scaling or not.
 */
export function _upscale(amount: bigint, scalingFactor: bigint): bigint {
    // Upscale rounding wouldn't necessarily always go in the same direction: in a swap for example the balance of
    // token in should be rounded up, and that of token out rounded down. This is the only place where we round in
    // the same direction for all amounts, as the impact of this rounding is expected to be minimal (and there's no
    // rounding error unless `_scalingFactor()` is overriden).
    return MathSol.mulDownFixed(amount, scalingFactor);
}

/**
 * @dev Same as `_upscale`, but for an entire array. This function does not return anything, but instead *mutates*
 * the `amounts` array.
 */
export function _upscaleArray(amounts: bigint[], scalingFactors: bigint[]): bigint[] {
    const upscaledAmounts = new Array<bigint>(amounts.length);
    for (let i = 0; i < amounts.length; ++i) {
        upscaledAmounts[i] = MathSol.mulDownFixed(amounts[i], scalingFactors[i]);
    }
    return upscaledAmounts;
}

/**
 * @dev Reverses the `scalingFactor` applied to `amount`, resulting in a smaller or equal value depending on
 * whether it needed scaling or not. The result is rounded down.
 */
export function _downscaleDown(amount: bigint, scalingFactor: bigint): bigint {
    return MathSol.divDownFixed(amount, scalingFactor);
}

/**
 * @dev Same as `_downscaleDown`, but for an entire array. This function does not return anything, but instead
 * *mutates* the `amounts` array.
 */
export function _downscaleDownArray(amounts: bigint[], scalingFactors: bigint[]): bigint[] {
    const downscaledAmounts = new Array<bigint>(amounts.length);
    for (let i = 0; i < amounts.length; ++i) {
        downscaledAmounts[i] = MathSol.divDownFixed(amounts[i], scalingFactors[i]);
    }
    return downscaledAmounts;
}

/**
 * @dev Reverses the `scalingFactor` applied to `amount`, resulting in a smaller or equal value depending on
 * whether it needed scaling or not. The result is rounded up.
 */
export function _downscaleUp(amount: bigint, scalingFactor: bigint): bigint {
    return MathSol.divUpFixed(amount, scalingFactor);
}

/**
 * @dev Same as `_downscaleUp`, but for an entire array. This function does not return anything, but instead
 * *mutates* the `amounts` array.
 */
export function _downscaleUpArray(amounts: bigint[], scalingFactors: bigint[]): bigint[] {
    const downscaledAmounts = new Array<bigint>(amounts.length);
    for (let i = 0; i < amounts.length; ++i) {
        downscaledAmounts[i] = MathSol.divUpFixed(amounts[i], scalingFactors[i]);
    }
    return downscaledAmounts;
}

export class MathSol {
    /**
     * @dev Returns the addition of two unsigned integers of 256 bits, reverting on overflow.
     */
    // add(a: bigint, b: bigint): bigint {
    //     const c = a + b;
    //     // _require(c >= a, Errors.ADD_OVERFLOW);
    //     return c;
    // }

    /**
     * @dev Returns the addition of two signed integers, reverting on overflow.
     */
    static add(a: bigint, b: bigint): bigint {
        const c = a + b;
        _require((b >= 0 && c >= a) || (b < 0 && c < a), 'Errors.ADD_OVERFLOW');
        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers of 256 bits, reverting on overflow.
     */
    static sub(a: bigint, b: bigint): bigint {
        _require(b <= a, 'Errors.SUB_OVERFLOW');
        const c = a - b;
        return c;
    }

    /**
     * @dev Returns the subtraction of two signed integers, reverting on overflow.
     */
    // sub(int256 a, int256 b) internal pure returns (int256) {
    //     int256 c = a - b;
    //     // _require((b >= 0 && c <= a) || (b < 0 && c > a), Errors.SUB_OVERFLOW);
    //     return c;
    // }

    /**
     * @dev Returns the largest of two numbers of 256 bits.
     */
    static max(a: bigint, b: bigint): bigint {
        return a >= b ? a : b;
    }

    /**
     * @dev Returns the smallest of two numbers of 256 bits.
     */
    static min(a: bigint, b: bigint): bigint {
        return a < b ? a : b;
    }

    static mul(a: bigint, b: bigint): bigint {
        const c = a * b;
        _require(a == BZERO || c / a == b, 'Errors.MUL_OVERFLOW');
        return c;
    }

    static div(a: bigint, b: bigint, roundUp: boolean): bigint {
        return roundUp ? this.divUp(a, b) : this.divDown(a, b);
    }

    static divDown(a: bigint, b: bigint): bigint {
        _require(b != BZERO, 'Errors.ZERO_DIVISION');
        return a / b;
    }

    static divUp(a: bigint, b: bigint): bigint {
        _require(b != BZERO, 'Errors.ZERO_DIVISION');

        if (a == BZERO) {
            return BZERO;
        } else {
            return BONE + (a - BONE) / b;
        }
    }

    // Modification: Taken from the fixed point class
    static ONE = BigInt('1000000000000000000'); // 18 decimal places
    static MAX_POW_RELATIVE_ERROR = BigInt(10000);

    static mulUpFixed(a: bigint, b: bigint): bigint {
        const product = a * b;
        _require(a == BZERO || product / a == b, 'Errors.MUL_OVERFLOW');

        if (product == BZERO) {
            return BZERO;
        } else {
            // The traditional divUp formula is:
            // divUp(x, y) := (x + y - 1) / y
            // To avoid intermediate overflow in the addition, we distribute the division and get:
            // divUp(x, y) := (x - 1) / y + 1
            // Note that this requires x != 0, which we already tested for.

            return (product - BONE) / this.ONE + BONE;
        }
    }

    // Modification: Taken from the fixed point class
    // Same as divDown in Smart Contract FixedPoint.sol
    static divDownFixed(a: bigint, b: bigint): bigint {
        _require(b != BZERO, 'Errors.ZERO_DIVISION');
        if (a == BZERO) {
            return BZERO;
        } else {
            const aInflated = a * this.ONE;
            // _require(aInflated / a == ONE, Errors.DIV_INTERNAL); // mul overflow

            return aInflated / b;
        }
    }

    // Modification: Taken from the fixed point class
    static divUpFixed(a: bigint, b: bigint): bigint {
        _require(b != BZERO, 'Errors.ZERO_DIVISION');

        if (a == BZERO) {
            return BZERO;
        } else {
            const aInflated = a * this.ONE;
            _require(aInflated / a == this.ONE, 'Errors.DIV_INTERNAL'); // mul overflow

            // The traditional divUp formula is:
            // divUp(x, y) := (x + y - 1) / y
            // To avoid intermediate overflow in the addition, we distribute the division and get:
            // divUp(x, y) := (x - 1) / y + 1
            // Note that this requires x != 0, which we already tested for.

            return (aInflated - BONE) / b + BONE;
        }
    }

    // Modification: Taken from the fixed point class
    static complementFixed(x: bigint): bigint {
        return x < this.ONE ? this.ONE - x : BZERO;
    }

    // This is the same as mulDown in Smart Contracts FixedPoint.sol
    static mulDownFixed(a: bigint, b: bigint): bigint {
        const product = a * b;
        _require(a == BZERO || product / a == b, 'Errors.MUL_OVERFLOW');

        return product / this.ONE;
    }
}
