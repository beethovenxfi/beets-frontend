import { Box } from "@chakra-ui/react";
import Image from "next/image";

import LogoFull from "~/assets/logo/logo-full.svg";

function Navbar() {
  return (
    <Box width="full" padding="4">
      <Image src={LogoFull} alt="Logo" />
    </Box>
  );
}

export default Navbar;
