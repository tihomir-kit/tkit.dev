import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';
import SocialProfile from '@/components/social-profile/social-profile';
import { IntroWrapper, IntroImage, IntroTitle, Description, IntroInfo } from './style';
import { IoLogoLinkedin, IoLogoGithub } from 'react-icons/io';
import { RiStackOverflowFill } from 'react-icons/ri';
import { SiHackerrank } from 'react-icons/si';

type IntroProps = {};

const SocialLinks = [
  {
    icon: <IoLogoLinkedin />,
    url: 'https://www.linkedin.com/in/tihomirkit',
    tooltip: 'LinkedIn',
  },
  {
    icon: <IoLogoGithub />,
    url: 'https://github.com/tihomir-kit', // TODO: Extract to configuration
    tooltip: 'Github',
  },
  {
    icon: <RiStackOverflowFill />,
    url: 'https://stackoverflow.com/users/story/413785',
    tooltip: 'StackOverflow',
  },
  {
    icon: <SiHackerrank />,
    url: 'https://www.hackerrank.com/tihomir_kit',
    tooltip: 'HackerRank',
  },
];

const Intro: React.FunctionComponent<IntroProps> = () => {
  const Data = useStaticQuery(graphql`
    query {
      avatar: file(absolutePath: { regex: "/author.jpg/" }) {
        childImageSharp {
          fluid(maxWidth: 210, maxHeight: 210, quality: 100) {
            ...GatsbyImageSharpFluid_withWebp_tracedSVG
          }
        }
      }
      site {
        siteMetadata {
          author
          about
        }
      }
    }
  `);

  const { author, about } = Data.site.siteMetadata;
  const AuthorImage = Data.avatar.childImageSharp.fluid;

  return (
    <IntroWrapper>
      <IntroImage>
        <Image fluid={AuthorImage} alt="author" />
      </IntroImage>
      <IntroInfo>
        <IntroTitle>
          Hey! I’m <b>{author}</b>
        </IntroTitle>
        <Description>{about}</Description>
        <SocialProfile items={SocialLinks} />
      </IntroInfo>
    </IntroWrapper>
  );
};

export default Intro;
