import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Badge,
  Highlight,
} from "@chakra-ui/react"
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons"
import { useEth } from "../contexts/EthContext"

const Links = ["Accueil", "Dashboard"]

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
)

const sumupAddress = (address) => {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""
}

export function Layout({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    state: { networkName, connectedUser, workflowStatus },
  } = useEth()

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <Text color="blue.700" fontSize="2xl">
                <Highlight query={["My"]} styles={{ px: "1", py: "1", bg: "orange.100" }}>
                  Oh.My.Vote
                </Highlight>
              </Text>
            </Box>
            <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Menu>
              <Flex>
                <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                  <Avatar size={"sm"} />
                </MenuButton>
                <Box ml="3">
                  <Text>
                    {sumupAddress(connectedUser)}{" "}
                    <Badge fontSize="sm" colorScheme="green" ml="1">
                      Voter
                    </Badge>
                  </Text>

                  <Badge variant="outline" fontSize="0.7em">
                    {networkName}
                  </Badge>
                </Box>
              </Flex>
              <MenuList>
                <MenuItem>Link 1</MenuItem>
                <MenuItem>Link 2</MenuItem>
                <MenuDivider />
                <MenuItem>Link 3</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Stack mt="8" maxW="980" mx="auto" gap="4">
        <HStack justifyContent="right">
          <Badge fontSize="lg" colorScheme="red">
            {workflowStatus}
          </Badge>
        </HStack>
        {children}
      </Stack>
    </>
  )
}
