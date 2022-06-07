// import { Box, Flex, HStack } from '@chakra-ui/react';
// import { usePoolList } from '~/modules/pools/usePoolList';
// import { useAccount } from 'wagmi';
// import { BeetsTab } from '~/components/tabs/BeetsTab';
// import { useState } from 'react';

// export type BeetsTabDefinition = {
//     text: string;
//     id: string;
// };

// type Props = {
//     // tab id of active tab
//     activeTab?: string;
//     tabs: BeetsTabDefinition[];
//     onTabChanged: (tab: BeetsTabDefinition) => void;
// };

// export function BeetsTabs({ tabs = [], activeTab, onTabChanged }: Props) {
//     const [_activeTab, setActiveTab] = useState(activeTab);
//     const handleTabClicked = (tab: BeetsTabDefinition) => () => {
//         setActiveTab(tab.id);
//         onTabChanged && onTabChanged(tab);
//     };

//     return (
//         <HStack spacing="2">
//             {tabs.map((tab) => (
//                 <BeetsT
//                     selected={_activeTab === tab.id}
//                     key={tab.id}
//                     text={tab.text}
//                     onClick={handleTabClicked(tab)}
//                 />
//             ))}
//         </HStack>
//     );
// }
