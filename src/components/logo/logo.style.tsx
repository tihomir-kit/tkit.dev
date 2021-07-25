import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

import { themeGet } from '@styled-system/theme-get';

type MediaPortProps = {
  showSmall?: boolean;
};

export const LogoWrapper = styled.h1<MediaPortProps>`
  color: ${themeGet('colors.textColor', '#292929')};
  font-family: 'Montserrat';
  margin: 0;
  font-size: 36px;

  @media (max-width: 575px) {
    font-size: 20px;
  }

  ${({ showSmall }: any) =>
    showSmall &&
    `
    font-size: 20px;
  `}
`;

export const LogoLink = styled(props => <Link {...props} />)`
  box-shadow: none;
  text-decoration: none;
  color: inherit;
`;

export const TKit = styled.span`
  font-weight: normal;
`;

export const Lodash = styled.span`
  color: ${themeGet('colors.primary', '#D10068')};
  padding-left: 4px;
  font-weight: 500;
`;

export const Dev = styled.span<MediaPortProps>`
  color: ${themeGet('lightTextColor', '#757575')};
  transform: rotate(-90deg);
  display: inline-block;
  font-weight: normal;
  font-size: 12px;
  padding-left: 12px;
  margin-left: -6px;

  @media (max-width: 575px) {
    font-size: 6px;
    padding-left: 9px;
    margin-left: -4px;
  }

  ${({ showSmall }: any) =>
    showSmall &&
    `
    font-size: 6px;
    padding-left: 9px;
    margin-left: -4px;
  `}
`;
