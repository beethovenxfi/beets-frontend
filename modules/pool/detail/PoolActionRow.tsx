import { HStack } from "@chakra-ui/layout"
import BeetsButton from "~/components/button/Button"

type Props = {

}

export default function PoolActionRow(props: Props) {
    
    return (
        <HStack>
            <BeetsButton>Add Liquidity</BeetsButton>
        </HStack>
    )
}