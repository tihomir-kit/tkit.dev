import * as React from 'react';
import FooterWrapper from './footer.style';

type FooterProps = {};

const Footer: React.FunctionComponent<FooterProps> = ({ ...props }) => {
  return (
    <FooterWrapper {...props}>
      {' '}
      Copyleft © {new Date().getFullYear()},{' '}
      <a href="https://github.com/pootzko/tkit.dev">all wrongs reserved</a>. Built with{' '}
      <a href="https://www.gatsbyjs.org">Gatsby</a>, hosted on{' '}
      <a href="https://www.netlify.com/">Netlify</a> and themed with{' '}
      <a href="https://themeforest.net/item/storyhub-react-gatsby-blog-template/23897134/">
        StoryHub
      </a>
      .
    </FooterWrapper>
  );
};

export default Footer;
