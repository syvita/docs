import React from 'react';
import { Box, Flex, space } from '@stacks/ui';
import { Pagination } from '@components/pagination';
import { Section, SectionWrapper } from '@components/common';
import { FeedbackSection } from '@components/feedback';
import { Caption } from '@components/typography';

const Footer = ({ hidePagination, ...rest }: any) => {
  return (
    <Section px={space(['extra-loose', 'extra-loose', 'none', 'none'])} {...rest}>
      <SectionWrapper>
        <Pagination />
        <FeedbackSection />
      </SectionWrapper>
    </Section>
  );
};

export { Footer };
