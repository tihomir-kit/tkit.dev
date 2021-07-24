import * as React from 'react';
import FooterWrapper from './footer.style';

type FooterProps = {};

const Footer: React.FunctionComponent<FooterProps> = ({ ...props }) => {
  return (
    <FooterWrapper {...props}>
      {' '}
      Copyleft © {new Date().getFullYear()},{' '}
      <a href="https://github.com/pootzko/tkit.dev">all wrongs reserved</a>. Built with{' '}
      <a href="https://www.gatsbyjs.org">Gatsby</a> and hosted on{' '}
      <a href="https://www.netlify.com/">Netlify</a>.
    </FooterWrapper>
  );
};

export default Footer;
