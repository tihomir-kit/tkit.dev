import React from 'react';
import { LogoWrapper, LogoLink, TKit, Lodash, Dev } from './logo.style';

type LogoProps = {
  showSmall?: boolean;
};

const Logo: React.FunctionComponent<LogoProps> = ({ showSmall }) => {
  return (
    <LogoWrapper showSmall={showSmall}>
      <LogoLink to={'/'}>
        <TKit>TKIT</TKit>
        <Lodash>_</Lodash>
        <Dev showSmall={showSmall}>dev</Dev>
      </LogoLink>
    </LogoWrapper>
  );
};

export default Logo;
