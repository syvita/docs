import React from 'react';
import {
  Box,
  BoxProps,
  ChevronIcon,
  color,
  Fade,
  Flex,
  FlexProps,
  space,
  Stack,
  StxInline,
  IconButton,
} from '@stacks/ui';
import { Link, LinkProps, Text } from '@components/typography';
import MenuIcon from 'mdi-react/MenuIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import { useMobileMenuState } from '@common/hooks/use-mobile-menu';

import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';
import NextLink from 'next/link';
import { StacksDocsLogo } from '@components/stacks-docs-logo';
import { ColorModeButton } from '@components/color-mode-button';
import { SearchButton } from '@components/search-button';
import { border, transition } from '@common/utils';
import { getCapsizeStyles } from '@components/mdx/typography';
import { useTouchable } from '@common/hooks/use-touchable';
import { useRouter } from 'next/router';

const MenuButton = ({ ...rest }: any) => {
  const { isOpen, handleOpen, handleClose } = useMobileMenuState();
  const Icon = isOpen ? CloseIcon : MenuIcon;
  const handleClick = isOpen ? handleClose : handleOpen;
  return (
    <IconButton
      color="var(--colors-invert)"
      display={['grid', 'grid', 'none']}
      onClick={handleClick}
      icon={Icon}
    />
  );
};

const HeaderWrapper: React.FC<BoxProps> = React.forwardRef((props, ref: any) => (
  <Box as="header" ref={ref} width="100%" position="relative" zIndex={9999} {...props} />
));

interface NavChildren {
  label: string;
  href?: string;
  target?: string;
}

interface NavItem {
  label: string;
  href: string;
  target?: string;
  children?: NavItem[];
}

const nav: NavItem[] = [
  {
    label: 'Social',
    href: '',
    children: [
      {
        label: 'Discord',
        href: 'https://discord.syvita.org',
      },
      {
        label: 'Twitter',
        href: 'https://twitter.com/syvitaguild',
      },
      {
        label: 'GitHub',
        href: 'https://github.com/syvita',
      },
    ],
  },
  { label: 'Explorer', href: 'https://explorer.syvita.org' },
];

const HeaderTextItem: ForwardRefExoticComponentWithAs<BoxProps & LinkProps, 'a'> = forwardRefWithAs<
  BoxProps & LinkProps,
  'a'
>(({ children, href, as = 'a', ...rest }, ref) => (
  <Text
    color={color('invert')}
    {...{
      ...getCapsizeStyles(16, 26),
      fontWeight: '400',
      color: 'currentColor',
      _hover: {
        cursor: href ? 'pointer' : 'unset',
        textDecoration: href ? 'underline' : 'none',
        color: href ? color('accent') : 'currentColor',
      },
      ...rest,
    }}
    as={as}
    href={href}
    ref={ref}
  >
    {children}
  </Text>
));

const NavItem: React.FC<FlexProps & { item: NavItem }> = ({ item, ...props }) => {
  const { hover, active, bind } = useTouchable({
    behavior: 'link',
  });
  return (
    <Flex justifyContent="center" position="relative" {...props} {...bind}>
      <HeaderTextItem
        as={item.href ? 'a' : 'span'}
        href={item.href}
        rel="nofollow noopener noreferrer"
        target="_blank"
      >
        {item.label}
      </HeaderTextItem>

      {item.children ? (
        <Box color={color('text-caption')} ml={space('extra-tight')}>
          <ChevronIcon direction="down" />
        </Box>
      ) : null}
      {item.children ? (
        <Fade in={hover || active}>
          {styles => (
            <Box
              pt={space('base-loose')}
              top="100%"
              position="absolute"
              transform="translateX(-5px)"
              zIndex={99999999}
              minWidth="200px"
              style={{ ...styles }}
            >
              <Box
                borderRadius="12px"
                border={border()}
                bg={color('bg')}
                overflow="hidden"
                boxShadow="0 0 8px 0 rgba(15,17,23,.03), 0 16px 40px 0 rgba(15,17,23,.06)"
              >
                {item.children.map((child, _key) => (
                  <Box
                    _hover={{
                      bg: color('accent'),
                      color: color('bg'),
                      cursor: 'pointer',
                    }}
                    transition={transition()}
                    color={color('text-title')}
                    borderBottom={_key < item.children.length - 1 && border()}
                    px={space('base')}
                    py={space('base-loose')}
                    as="a"
                    display="block"
                    // @ts-ignore
                    href={child.href}
                    target={child.target || '_blank'}
                  >
                    <HeaderTextItem color="currentColor">{child.label}</HeaderTextItem>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Fade>
      ) : null}
    </Flex>
  );
};

const Navigation: React.FC<BoxProps> = props => {
  return (
    <Box
      as="nav"
      position="relative"
      zIndex={99999999}
      display={['none', 'none', 'block']}
      transform="translateY(2px)"
      {...props}
    >
      <Stack mr={space('base')} isInline spacing={space('extra-loose')}>
        {nav.map((item, key) => (
          <NavItem item={item} key={key} />
        ))}
      </Stack>
    </Box>
  );
};

const LogoLink = React.memo(() => {
  return (
    <NextLink href="/" passHref>
      <Link _hover={{ textDecoration: 'none' }} as="a" display="flex">
        <Flex as="span" alignItems="center">
        <svg height="22" viewBox="0 0 2500 449" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M130.161 352.459C91.8116 352.459 60.9369 341.897 37.5371 320.772C14.4624 299.647 1.94998 271.21 0 235.46H49.237C51.187 257.885 59.1494 275.597 73.1243 288.597C87.4241 301.272 106.436 307.609 130.161 307.609C152.586 307.609 170.461 303.222 183.786 294.447C197.435 285.347 204.26 271.86 204.26 253.985C204.26 241.31 199.385 230.91 189.636 222.785C180.211 214.335 168.348 208.323 154.048 204.748C139.749 200.848 124.149 196.298 107.249 191.098C90.6741 185.898 75.2367 180.373 60.9369 174.523C46.637 168.348 34.6121 158.598 24.8622 145.274C15.4373 131.624 10.7249 115.049 10.7249 95.549C10.7249 68.2493 21.4498 46.1495 42.8996 29.2497C64.6743 12.0249 92.7866 3.41248 127.236 3.41248C162.011 3.41248 190.448 12.8374 212.548 31.6872C234.648 50.212 246.835 75.0742 249.11 106.274H199.873C198.248 88.7241 190.936 74.7493 177.936 64.3494C164.936 53.6245 148.036 48.262 127.236 48.262C106.761 48.262 90.6741 52.6495 78.9742 61.4244C67.2743 69.8743 61.4244 81.2492 61.4244 95.549C61.4244 106.599 64.9993 115.861 72.1493 123.336C79.2992 130.811 88.5616 136.499 99.9365 140.399C111.311 144.299 123.986 147.873 137.961 151.123C151.936 154.373 165.748 158.273 179.398 162.823C193.373 167.373 206.048 173.061 217.423 179.886C228.798 186.386 238.06 195.973 245.21 208.648C252.36 220.998 255.935 235.948 255.935 253.497C255.935 284.047 244.235 308.259 220.835 326.134C197.76 343.684 167.536 352.459 130.161 352.459Z" fill="currentColor"/>
          <path d="M494.834 102.861L408.547 339.784L371.498 448.008H326.161L359.31 350.996L268.149 102.861H316.898L381.248 287.135L446.085 102.861H494.834Z" fill="currentColor"/>
          <path d="M591.019 348.559L500.833 102.861H549.582L613.931 289.085L678.768 102.861H727.518L637.819 348.559H591.019Z" fill="currentColor"/>
          <path d="M755.453 0H808.103V59.4744H755.453V0ZM758.378 348.559V102.861H805.665V348.559H758.378Z" fill="currentColor"/>
          <path d="M888.894 25.8372H936.181V102.861H1008.82V143.811H936.181V266.66C936.181 279.66 939.431 289.735 945.931 296.884C952.756 304.034 962.181 307.609 974.206 307.609H1008.82V348.559H970.306C945.281 348.559 925.456 341.409 910.831 327.109C896.206 312.809 888.894 293.147 888.894 268.122V143.811H838.682V102.861H888.894V25.8372Z" fill="currentColor"/>
          <path d="M1144.83 352.459C1107.78 352.459 1078.85 340.759 1058.05 317.359C1037.25 293.959 1026.85 263.41 1026.85 225.71C1026.85 188.336 1037.25 157.948 1058.05 134.549C1078.85 110.824 1107.62 98.9615 1144.34 98.9615C1160.27 98.9615 1175.22 102.374 1189.19 109.199C1203.49 116.024 1214.54 124.799 1222.34 135.524V102.861H1269.63V348.559H1222.34V315.409C1216.49 326.134 1206.25 335.072 1191.63 342.222C1177.33 349.046 1161.73 352.459 1144.83 352.459ZM1095.59 287.622C1109.24 303.222 1127.44 311.022 1150.19 311.022C1172.94 311.022 1191.14 303.222 1204.79 287.622C1218.77 272.022 1225.75 251.385 1225.75 225.71C1225.75 200.035 1218.77 179.398 1204.79 163.798C1191.14 148.198 1172.94 140.399 1150.19 140.399C1127.44 140.399 1109.24 148.198 1095.59 163.798C1081.94 179.398 1075.12 200.035 1075.12 225.71C1075.12 251.385 1081.94 272.022 1095.59 287.622Z" fill="currentColor"/>
          <path d="M1588.46 352.459C1559.21 352.459 1532.24 346.284 1507.54 333.934C1483.17 321.259 1463.02 301.434 1447.09 274.46C1431.17 247.485 1423.2 215.31 1423.2 177.936C1423.2 140.561 1431.17 108.386 1447.09 81.4117C1463.34 54.4369 1483.82 34.7746 1508.52 22.4248C1533.54 9.74991 1560.84 3.41248 1590.41 3.41248C1630.71 3.41248 1664.68 14.1374 1692.3 35.5871C1719.93 57.0369 1735.53 84.6616 1739.1 118.461H1686.45C1682.88 97.6615 1672.15 80.7617 1654.28 67.7618C1636.73 54.7619 1615.44 48.262 1590.41 48.262C1555.96 48.262 1527.85 59.7994 1506.08 82.8742C1484.63 105.624 1473.9 137.311 1473.9 177.936C1473.9 218.56 1484.63 250.572 1506.08 273.972C1527.85 297.372 1555.8 309.072 1589.93 309.072C1616.9 309.072 1640.14 301.922 1659.64 287.622C1679.46 273.322 1689.38 255.285 1689.38 233.51C1689.38 227.01 1687.26 221.648 1683.04 217.423C1679.14 213.198 1673.61 211.085 1666.46 211.085H1592.36V170.136H1679.14C1693.76 170.136 1707.25 175.498 1719.6 186.223C1731.95 196.623 1738.13 210.435 1738.13 227.66V348.559H1692.3V291.035C1684.83 309.559 1671.66 324.509 1652.81 335.884C1633.96 346.934 1612.51 352.459 1588.46 352.459Z" fill="currentColor"/>
          <path d="M2005.93 102.861V348.559H1958.64V305.172C1952.14 320.447 1941.91 332.147 1927.93 340.272C1914.28 348.396 1898.2 352.459 1879.67 352.459C1852.05 352.459 1829.78 343.359 1812.88 325.159C1796.31 306.959 1788.02 283.235 1788.02 253.985V102.861H1835.31V244.722C1835.31 264.222 1840.51 279.985 1850.91 292.01C1861.63 304.034 1875.61 310.047 1892.83 310.047C1912.01 310.047 1927.77 303.059 1940.12 289.085C1952.47 275.11 1958.64 257.397 1958.64 235.948V102.861H2005.93Z" fill="currentColor"/>
          <path d="M2058.72 0H2111.37V59.4744H2058.72V0ZM2061.65 348.559V102.861H2108.93V348.559H2061.65Z" fill="currentColor"/>
          <path d="M2166.33 348.559V0H2213.61V348.559H2166.33Z" fill="currentColor"/>
          <path d="M2375.2 352.459C2338.15 352.459 2309.23 340.759 2288.43 317.359C2267.63 293.959 2257.23 263.41 2257.23 225.71C2257.23 188.336 2267.63 157.948 2288.43 134.549C2309.23 110.824 2337.99 98.9615 2374.71 98.9615C2391.29 98.9615 2406.56 102.699 2420.54 110.174C2434.51 117.324 2445.24 126.911 2452.71 138.936V0H2500V348.559H2452.71V311.997C2445.24 324.347 2434.51 334.259 2420.54 341.734C2406.56 348.884 2391.45 352.459 2375.2 352.459ZM2325.96 287.622C2339.61 303.222 2357.81 311.022 2380.56 311.022C2403.31 311.022 2421.51 303.222 2435.16 287.622C2449.14 272.022 2456.13 251.385 2456.13 225.71C2456.13 200.035 2449.14 179.398 2435.16 163.798C2421.51 148.198 2403.31 140.399 2380.56 140.399C2357.81 140.399 2339.61 148.198 2325.96 163.798C2312.31 179.398 2305.49 200.035 2305.49 225.71C2305.49 251.385 2312.31 272.022 2325.96 287.622Z" fill="currentColor"/>
        </svg>

        </Flex>
      </Link>
    </NextLink>
  );
});

const Header = ({ hideSubBar, ...rest }: any) => {
  return (
    <>
      <HeaderWrapper>
        <Box mx="auto" px="extra-loose">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            bg={color('bg')}
            style={{
              backdropFilter: 'blur(5px)',
            }}
            height="72px"
            mx="auto"
            color={color('text-title')}
            {...rest}
          >
            <LogoLink />
            <Flex alignItems="center">
              <Navigation />
              <Stack isInline spacing="tight">
                <SearchButton />
                <ColorModeButton />
                <MenuButton />
              </Stack>
            </Flex>
          </Flex>
        </Box>
      </HeaderWrapper>
    </>
  );
};

export { Header };
